import pool from '../../connect/db';
import { Elysia } from 'elysia';
export const closeActivity = async (activity_id: number, closed_by: number) => {
  console.log('ปิดกิจกรรม id:', activity_id, 'user:', closed_by);
  try {
    // ตรวจสอบว่ากิจกรรมมีอยู่จริงและไม่ถูกปิดหรือยกเลิกไปแล้ว
    const activityCheckResult = await pool.query(
      `SELECT a.id, a.status 
       FROM activities a 
       WHERE a.id = $1`,
      [activity_id]
    );

    if (activityCheckResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรมที่ต้องการปิด'
      };
    }

    if (activityCheckResult.rows[0].status === 'closed') {
      return {
        success: false,
        message: 'กิจกรรมนี้ถูกปิดไปแล้ว'
      };
    }

    if (activityCheckResult.rows[0].status === 'cancelled') {
      return {
        success: false,
        message: 'ไม่สามารถปิดกิจกรรมที่ถูกยกเลิกแล้ว'
      };
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // อัปเดตสถานะกิจกรรมเป็น 'closed'
      await client.query(
        `UPDATE activities 
         SET status = 'closed', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [activity_id]
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