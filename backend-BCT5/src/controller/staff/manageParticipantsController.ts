import pool from '../../connect/db';
import { createNotification } from '../notificationController';

// ดึงรายชื่อผู้เข้าร่วมกิจกรรม
export const getActivityParticipants = async (activity_id: number) => {
  try {
    const result = await pool.query(
      `SELECT r.registration_id, r.user_id, r.status as registration_status, 
              r.registration_date, r.attended_date, r.points_earned, r.hours_earned, r.feedback,
              u.student_id, 
              ud.first_name, ud.last_name, 
              f.faculty_name, 
              d.department_name
       FROM registrations r
       JOIN users u ON r.user_id = u.id_user
       JOIN user_details ud ON u.id_user_details = ud.id_user_details
       LEFT JOIN faculty f ON ud.faculty_id = f.faculty_id
       LEFT JOIN department d ON ud.department_id = d.department_id
       WHERE r.activity_id = $1
       ORDER BY r.registration_date ASC`,
      [activity_id]
    );

    // ดึงข้อมูลกิจกรรม
    const activityResult = await pool.query(
      `SELECT a.id, a.name, a.max_participants, 
              (SELECT COUNT(*) FROM registrations WHERE activity_id = $1) as current_count
       FROM activities a 
       WHERE a.id = $1`,
      [activity_id]
    );

    if (activityResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรม'
      };
    }

    return {
      success: true,
      activity: activityResult.rows[0],
      participants: result.rows
    };
  } catch (error) {
    console.error('Error fetching activity participants:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้เข้าร่วมกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// อนุมัติผู้เข้าร่วมกิจกรรม
// แก้ไขฟังก์ชัน approveParticipant ใน src/controller/staff/manageParticipantsController.ts
import pool from '../../connect/db';

// อนุมัติผู้เข้าร่วมกิจกรรม
import pool from '../../connect/db';

// อนุมัติผู้เข้าร่วมกิจกรรม
export const approveParticipant = async (registration_id: number, approved_by: number) => {
  try {
    // ตรวจสอบว่ามีการลงทะเบียนอยู่จริงหรือไม่
    const checkResult = await pool.query(
      `SELECT r.registration_id, r.status, r.status_check_id, s.status_name
       FROM registrations r
       LEFT JOIN status_check s ON r.status_check_id = s.id
       WHERE r.registration_id = $1`,
      [registration_id]
    );

    if (checkResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลการลงทะเบียน'
      };
    }

    // ตรวจสอบว่าสถานะปัจจุบันเป็น 'pending' หรือไม่
    const currentStatus = checkResult.rows[0].status_name || checkResult.rows[0].status;
    if (currentStatus !== 'pending') {
      return {
        success: false,
        message: `ไม่สามารถอนุมัติได้ เนื่องจากการลงทะเบียนอยู่ในสถานะ ${currentStatus}`
      };
    }

    // ดึง status_check_id สำหรับสถานะ 'in-process'
    const statusResult = await pool.query(
      'SELECT id FROM status_check WHERE status_name = $1',
      ['in-process']
    );

    if (statusResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบสถานะ "in-process" ในระบบ'
      };
    }

    const inProcessStatusId = statusResult.rows[0].id;

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // อัปเดตเฉพาะ status_check_id เป็นค่า in-process
      await client.query(
        `UPDATE registrations 
         SET status_check_id = $1, updated_at = CURRENT_TIMESTAMP
         WHERE registration_id = $2`,
        [inProcessStatusId, registration_id]
      );
      

      // บันทึกข้อมูลการอนุมัติใน registration_approvals ถ้ามีตารางนี้
      try {
        await client.query(
          `INSERT INTO registration_approvals (registration_id, approved_by, approved_at)
           VALUES ($1, $2, CURRENT_TIMESTAMP)`,
          [registration_id, approved_by]
        );
      } catch (error) {
        // ถ้าไม่มีตาราง registration_approvals ให้ข้ามไป
        console.log('Note: registration_approvals table might not exist. Skipping approval record.');
      }

      await client.query('COMMIT');

      return {
        success: true,
        message: 'อนุมัติผู้เข้าร่วมกิจกรรมสำเร็จ',
        registration_id
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error approving participant:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการอนุมัติผู้เข้าร่วมกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ปฏิเสธผู้เข้าร่วมกิจกรรม
export const rejectParticipant = async (registration_id: number, rejected_by: number, reason: string) => {
  try {
    // ตรวจสอบสถานะการลงทะเบียน
    const checkResult = await pool.query(
      `SELECT s.status_name 
       FROM registrations r
       JOIN status_check s ON r.status_check_id = s.id
       WHERE r.registration_id = $1`,
      [registration_id]
    );

    if (checkResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลการลงทะเบียน'
      };
    }

    if (checkResult.rows[0].status_name !== 'pending') {
      return {
        success: false,
        message: `ไม่สามารถปฏิเสธได้ เนื่องจากการลงทะเบียนอยู่ในสถานะ ${checkResult.rows[0].status_name}`
      };
    }

    // ใช้ status_check_id โดยตรง
    const rejectedStatusId = 3; // ID ของสถานะ 'rejected' จากตาราง status_check

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // อัปเดตสถานะการลงทะเบียนเป็น 'rejected' และเก็บเหตุผลในฟิลด์ feedback
      await client.query(
        `UPDATE registrations 
         SET status_check_id = $1, feedback = $2, updated_at = CURRENT_TIMESTAMP
         WHERE registration_id = $3`,
        [rejectedStatusId, reason, registration_id]
      );

      // เพิ่มข้อมูลการปฏิเสธลงในตาราง registration_rejections
      await client.query(
        `INSERT INTO registration_rejections (registration_id, rejected_by, reason, rejected_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [registration_id, rejected_by, reason]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'ปฏิเสธผู้เข้าร่วมกิจกรรมสำเร็จ',
        registration_id,
        reason
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in transaction:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error rejecting participant:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการปฏิเสธผู้เข้าร่วมกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

//ดึงข้อมูลประวัติการปฏิเสธของการลงทะเบียน
export const getRejectionHistory = async (registration_id: number) => {
  try {
    // ตรวจสอบว่าการลงทะเบียนมีอยู่จริง
    const regResult = await pool.query(
      `SELECT r.registration_id, s.status_name, r.feedback, 
              a.name as activity_name, a.id as activity_id,
              u.student_id as user_student_id,
              ud.first_name as user_first_name, ud.last_name as user_last_name
       FROM registrations r
       JOIN status_check s ON r.status_check_id = s.id
       JOIN activities a ON r.activity_id = a.id
       JOIN users u ON r.user_id = u.id_user
       JOIN user_details ud ON u.id_user_details = ud.id_user_details
       WHERE r.registration_id = $1`,
      [registration_id]
    );

    if (regResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลการลงทะเบียน'
      };
    }

    // ดึงประวัติการปฏิเสธ
    const rejectionResult = await pool.query(
      `SELECT rr.id, rr.reason, rr.rejected_at,
              u.student_id as rejected_by_student_id,
              ud.first_name as rejected_by_first_name, 
              ud.last_name as rejected_by_last_name,
              u.role as rejected_by_role
       FROM registration_rejections rr
       JOIN users u ON rr.rejected_by = u.id_user
       JOIN user_details ud ON u.id_user_details = ud.id_user_details
       WHERE rr.registration_id = $1
       ORDER BY rr.rejected_at DESC`,
      [registration_id]
    );

    return {
      success: true,
      registration: regResult.rows[0],
      rejections: rejectionResult.rows
    };
  } catch (error) {
    console.error('Error fetching rejection history:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการปฏิเสธ',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// บันทึกการเข้าร่วมกิจกรรมจริง (check-in)
export const recordAttendance = async (registration_id: number, hours_earned: number, points_earned: number, feedback: string = '') => {
  try {
    // ตรวจสอบสถานะการลงทะเบียน
    const checkResult = await pool.query(
      'SELECT status FROM registrations WHERE registration_id = $1',
      [registration_id]
    );

    if (checkResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลการลงทะเบียน'
      };
    }

    if (checkResult.rows[0].status !== 'approved') {
      return {
        success: false,
        message: `ไม่สามารถบันทึกการเข้าร่วมได้ เนื่องจากการลงทะเบียนอยู่ในสถานะ ${checkResult.rows[0].status}`
      };
    }

    // อัปเดตข้อมูลการเข้าร่วม
    const currentDate = new Date().toISOString();
    await pool.query(
      `UPDATE registrations 
       SET status = 'attended', attended_date = $2, hours_earned = $3, points_earned = $4, 
           feedback = $5, updated_at = CURRENT_TIMESTAMP
       WHERE registration_id = $1`,
      [registration_id, currentDate, hours_earned, points_earned, feedback]
    );

    return {
      success: true,
      message: 'บันทึกการเข้าร่วมกิจกรรมสำเร็จ',
      registration_id,
      attended_date: currentDate,
      hours_earned,
      points_earned
    };
  } catch (error) {
    console.error('Error recording attendance:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกการเข้าร่วมกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};