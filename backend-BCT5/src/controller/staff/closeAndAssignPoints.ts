import pool from '../../connect/db';
import { createNotification, notifyAllParticipants, notifyParticipantsByStatus } from '../notificationController';

export const closeAndAssignPoints = async (
  activity_id: number,
  closed_by: number,
  staff_note: string = ''
) => {
  try {
    // ตรวจสอบว่ากิจกรรมมีอยู่จริงและยังไม่ถูกปิด
    const activityCheck = await pool.query(
      `SELECT a.id, a.name, ad.volunteer_hours, ad.volunteer_points, 
              s.status_name, s.id as current_status_id
       FROM activities a
       JOIN activity_details ad ON a.id = ad.id_activity_details
       JOIN status_check s ON a.status_check_id = s.id
       WHERE a.id = $1 AND a.is_deleted = FALSE`,
      [activity_id]
    );

    if (activityCheck.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรมที่ต้องการปิด'
      };
    }

    const activity = activityCheck.rows[0];
    
    // ตรวจสอบว่ากิจกรรมเป็นสถานะ open เท่านั้น
    if (activity.status_name !== 'open') {
      return {
        success: false,
        message: `ไม่สามารถปิดกิจกรรมได้ เนื่องจากกิจกรรมอยู่ในสถานะ "${activity.status_name}" ต้องเป็นสถานะ "open" เท่านั้น`
      };
    }

    // ดึง status_check_id สำหรับสถานะต่างๆ
    const statusResult = await pool.query(
      `SELECT id, status_name 
       FROM status_check 
       WHERE status_name IN ('closed', 'passed', 'failed')`,
      []
    );

    if (statusResult.rows.length < 3) {
      return {
        success: false,
        message: 'ไม่พบสถานะที่จำเป็นในระบบ (closed, passed, failed)'
      };
    }

    let closedStatusId = 0;
    let passedStatusId = 0;
    let failedStatusId = 0;

    for (const row of statusResult.rows) {
      if (row.status_name === 'closed') {
        closedStatusId = row.id;
      } else if (row.status_name === 'passed') {
        passedStatusId = row.id;
      } else if (row.status_name === 'failed') {
        failedStatusId = row.id;
      }
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. อัปเดตสถานะกิจกรรมเป็น 'closed'
      await client.query(
        `UPDATE activities 
         SET status_check_id = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [closedStatusId, activity_id]
      );

      // 2. ดึงรายการผู้ลงทะเบียนที่ไม่ได้ยกเลิก
      const activeRegistrationsResult = await client.query(
        `SELECT r.registration_id, r.user_id, s.status_name
         FROM registrations r
         JOIN status_check s ON r.status_check_id = s.id
         WHERE r.activity_id = $1 
         AND s.status_name NOT IN ('cancelled', 'failed', 'passed')`,
        [activity_id]
      );

      // 3. อัปเดตสถานะผู้ลงทะเบียนเป็น 'passed' และให้คะแนนเต็ม
      if (activeRegistrationsResult.rows.length > 0) {
        await client.query(
          `UPDATE registrations 
           SET status_check_id = $1, 
               hours_earned = $2, 
               points_earned = $3, 
               feedback = $4,
               attended_date = CURRENT_TIMESTAMP,
               updated_at = CURRENT_TIMESTAMP
           WHERE activity_id = $5 
           AND registration_id IN (
             SELECT r.registration_id
             FROM registrations r
             JOIN status_check s ON r.status_check_id = s.id
             WHERE r.activity_id = $5 
             AND s.status_name NOT IN ('cancelled', 'failed', 'passed')
           )`,
          [
            passedStatusId,
            activity.volunteer_hours,
            activity.volunteer_points,
            staff_note ? staff_note : 'ผ่านการเข้าร่วมกิจกรรม บันทึกโดยระบบอัตโนมัติ',
            activity_id
          ]
        );
      }

      // 4. อัปเดตสถานะผู้ที่ยกเลิกเป็น 'failed' ถ้ายังไม่เป็น
      await client.query(
        `UPDATE registrations 
         SET status_check_id = $1,
             hours_earned = 0,
             points_earned = 0,
             feedback = 'ไม่ผ่านการเข้าร่วมกิจกรรม เนื่องจากยกเลิกการเข้าร่วม',
             updated_at = CURRENT_TIMESTAMP
         WHERE activity_id = $2 
         AND registration_id IN (
           SELECT r.registration_id
           FROM registrations r
           JOIN status_check s ON r.status_check_id = s.id
           WHERE r.activity_id = $2 
           AND s.status_name = 'cancelled'
           AND r.status_check_id != $1
         )`,
        [failedStatusId, activity_id]
      );

      // 5. บันทึกข้อมูลการปิดกิจกรรม (ถ้าต้องการ)
      // สร้างหรืออัปเดตตาราง activity_closures ถ้าต้องการเก็บประวัติ
      try {
        await client.query(
          `INSERT INTO activity_closures 
           (activity_id, closed_by, closed_at, note)
           VALUES ($1, $2, CURRENT_TIMESTAMP, $3)`,
          [activity_id, closed_by, staff_note]
        );
      } catch (err) {
        console.log('activity_closures table might not exist, skipping record');
        // ถ้าไม่มีตาราง activity_closures ก็ข้ามไป ไม่ต้อง rollback transaction
      }

      // 6. สร้างการแจ้งเตือนให้ผู้เข้าร่วมทุกคน (ถ้ามีตาราง notifications)
      try {
        // สำหรับผู้ที่ผ่าน
        await notifyParticipantsByStatus(
          activity_id,
          `กิจกรรม "${activity.name}" ปิดแล้ว คุณได้รับ ${activity.volunteer_hours} ชั่วโมงจิตอาสา และ ${activity.volunteer_points} คะแนน`,
          ['in-process', 'approved', 'pending'],
          'points',
          `/student/activity-detail/${activity_id}`
        );

        // สำหรับผู้ที่ยกเลิก
        await notifyParticipantsByStatus(
          activity_id,
          `กิจกรรม "${activity.name}" ปิดแล้ว คุณไม่ได้รับคะแนนเนื่องจากยกเลิกการเข้าร่วม`,
          ['cancelled'],
          'activity',
          `/student/activity-detail/${activity_id}`
        );
      } catch (err) {
        console.log('Notifications feature might not be set up, skipping notification creation');
      }

      await client.query('COMMIT');

      return {
        success: true,
        message: `ปิดกิจกรรมและให้คะแนนผู้เข้าร่วมสำเร็จ มีผู้ผ่านกิจกรรม ${activeRegistrationsResult.rows.length} คน`,
        activity_id,
        activity_name: activity.name,
        closed_by,
        participants_count: activeRegistrationsResult.rows.length
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error closing activity and assigning points:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการปิดกิจกรรมและให้คะแนน',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// สร้าง API เพื่อให้ผู้ใช้ยกเลิกการเข้าร่วมกิจกรรม
export const cancelParticipation = async (
  user_id: number,
  activity_id: number,
  reason: string = ''
) => {
  try {
    // ตรวจสอบการลงทะเบียน
    const regCheckResult = await pool.query(
      `SELECT r.registration_id, s.status_name
       FROM registrations r
       JOIN status_check s ON r.status_check_id = s.id
       WHERE r.user_id = $1 AND r.activity_id = $2`,
      [user_id, activity_id]
    );

    if (regCheckResult.rows.length === 0) {
      return {
        success: false,
        message: 'คุณไม่ได้ลงทะเบียนกิจกรรมนี้'
      };
    }

    const registration = regCheckResult.rows[0];
    
    // ตรวจสอบว่าสถานะปัจจุบันไม่ใช่ "cancelled" หรือ "failed" หรือ "passed"
    if (['cancelled', 'failed', 'passed'].includes(registration.status_name)) {
      return {
        success: false,
        message: `ไม่สามารถยกเลิกได้ เนื่องจากการลงทะเบียนอยู่ในสถานะ "${registration.status_name}" แล้ว`
      };
    }

    // ตรวจสอบว่ากิจกรรมยังเปิดอยู่หรือไม่
    const activityResult = await pool.query(
      `SELECT a.id, s.status_name
       FROM activities a
       JOIN status_check s ON a.status_check_id = s.id
       WHERE a.id = $1`,
      [activity_id]
    );

    if (activityResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรม'
      };
    }

    if (activityResult.rows[0].status_name !== 'open') {
      return {
        success: false,
        message: `ไม่สามารถยกเลิกได้ เนื่องจากกิจกรรมอยู่ในสถานะ "${activityResult.rows[0].status_name}" ไม่ใช่สถานะ "open"`
      };
    }

    // ดึง status_check_id สำหรับสถานะ 'cancelled'
    const cancelledStatusResult = await pool.query(
      'SELECT id FROM status_check WHERE status_name = $1',
      ['cancelled']
    );

    if (cancelledStatusResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบสถานะ "cancelled" ในระบบ'
      };
    }

    const cancelledStatusId = cancelledStatusResult.rows[0].id;

    // อัปเดตสถานะเป็น 'cancelled'
    await pool.query(
      `UPDATE registrations 
       SET status_check_id = $1, 
           feedback = $2, 
           updated_at = CURRENT_TIMESTAMP
       WHERE registration_id = $3`,
      [cancelledStatusId, reason ? reason : 'ยกเลิกการเข้าร่วมโดยผู้ใช้', registration.registration_id]
    );

    return {
      success: true,
      message: 'ยกเลิกการเข้าร่วมกิจกรรมสำเร็จ',
      activity_id,
      registration_id: registration.registration_id
    };
  } catch (error) {
    console.error('Error cancelling participation:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการยกเลิกการเข้าร่วมกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};