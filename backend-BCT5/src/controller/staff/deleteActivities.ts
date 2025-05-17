import pool from '../../connect/db';

export const deleteActivity = async (activity_id: number, deleted_by: number) => {
  try {
    // ตรวจสอบว่ากิจกรรมมีอยู่จริง
    const activityCheckResult = await pool.query(
      `SELECT a.id, a.created_by, s.status_name
       FROM activities a 
       JOIN status_check s ON a.status_check_id = s.id
       WHERE a.id = $1 AND a.is_deleted = FALSE`,
      [activity_id]
    );

    if (activityCheckResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรมที่ต้องการลบ'
      };
    }

    // อาจเพิ่มการตรวจสอบว่าผู้ลบเป็นผู้สร้างกิจกรรมหรือไม่
    if (activityCheckResult.rows[0].created_by !== deleted_by) {
      return {
        success: false,
        message: 'คุณไม่มีสิทธิ์ลบกิจกรรมที่ไม่ได้สร้างเอง'
      };
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // ลบข้อมูลในตาราง activity_approvals ก่อน <<<< เพิ่มส่วนนี้ เพื่อแก้ปัญหา
      try {
        await client.query(
          `DELETE FROM activity_approvals WHERE activity_id = $1`,
          [activity_id]
        );
      } catch (error) {
        console.log('No activity_approvals table or no records for this activity');
      }
      
      // ลบข้อมูลในตาราง activity_rejections ก่อน (ถ้ามี) <<<< เพิ่มส่วนนี้ เผื่อมีตารางนี้
      try {
        await client.query(
          `DELETE FROM activity_rejections WHERE activity_id = $1`,
          [activity_id]
        );
      } catch (error) {
        console.log('No activity_rejections table or no records for this activity');
      }

      // ลบข้อมูลในตาราง registration_approvals ก่อน (ถ้ามี)
      try {
        await client.query(
          `DELETE FROM registration_approvals 
           WHERE registration_id IN (SELECT registration_id FROM registrations WHERE activity_id = $1)`,
          [activity_id]
        );
      } catch (error) {
        console.log('No registration_approvals table or no records for this activity');
      }

      // ลบข้อมูลในตาราง registration_rejections ก่อน (ถ้ามี)
      try {
        await client.query(
          `DELETE FROM registration_rejections
           WHERE registration_id IN (SELECT registration_id FROM registrations WHERE activity_id = $1)`,
          [activity_id]
        );
      } catch (error) {
        console.log('No registration_rejections table or no records for this activity');
      }

      // ลบข้อมูลการลงทะเบียน
      try {
        await client.query(
          `DELETE FROM registrations WHERE activity_id = $1`,
          [activity_id]
        );
      } catch (error) {
        console.log('No registrations or error deleting registrations');
      }

      // ลบข้อมูลการยกเลิก (ถ้ามี)
      try {
        await client.query(
          `DELETE FROM activity_cancellations WHERE activity_id = $1`,
          [activity_id]
        );
      } catch (error) {
        console.log('No activity_cancellations table or no records for this activity');
      }

      // ลบรายละเอียดกิจกรรม
      try {
        await client.query(
          `DELETE FROM activity_details WHERE id_activity_details = $1`,
          [activity_id]
        );
      } catch (error) {
        console.log('Error deleting activity details', error);
      }

      // ลบข้อมูลกิจกรรมหลัก
      await client.query(
        `DELETE FROM activities WHERE id = $1`,
        [activity_id]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'ลบกิจกรรมสำเร็จ',
        activity_id,
        deleted_by
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting activity:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};