import pool from '../../connect/db';
import { Elysia } from 'elysia';

export const closeActivity = async (activity_id: number, closed_by: number) => {
  console.log('ปิดกิจกรรม id:', activity_id, 'user:', closed_by);
  try {
    // ตรวจสอบว่ากิจกรรมมีอยู่จริงและไม่ถูกปิดหรือยกเลิกไปแล้ว
    const activityCheckResult = await pool.query(
      `SELECT a.id, s.status_name 
       FROM activities a 
       JOIN status_check s ON a.status_check_id = s.id
       WHERE a.id = $1 AND a.is_deleted = FALSE`,
      [activity_id]
    );

    if (activityCheckResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรมที่ต้องการปิด'
      };
    }

    const currentStatus = activityCheckResult.rows[0].status_name;

    if (currentStatus === 'closed') {
      return {
        success: false,
        message: 'กิจกรรมนี้ถูกปิดไปแล้ว'
      };
    }

    if (currentStatus === 'cancelled') {
      return {
        success: false,
        message: 'ไม่สามารถปิดกิจกรรมที่ถูกยกเลิกแล้ว'
      };
    }

    // ดึง status_check_id สำหรับสถานะ 'closed'
    const statusResult = await pool.query(
      'SELECT id FROM status_check WHERE status_name = $1',
      ['closed']
    );

    if (statusResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบสถานะ "closed" ในระบบ'
      };
    }

    const closedStatusId = statusResult.rows[0].id;

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // อัปเดตสถานะกิจกรรมเป็น 'closed' โดยใช้ status_check_id แทน status
      await client.query(
        `UPDATE activities 
         SET status_check_id = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [closedStatusId, activity_id]
      );

      // บันทึกการปิดกิจกรรมไว้ในประวัติหรือตาราง log (ถ้ามี)
      // ...

      await client.query('COMMIT');

      return {
        success: true,
        message: 'ปิดกิจกรรมสำเร็จ',
        activity_id,
        closed_by
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error closing activity:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการปิดกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};