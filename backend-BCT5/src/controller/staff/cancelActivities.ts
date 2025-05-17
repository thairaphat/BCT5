import pool from '../../connect/db';

export const cancelActivity = async (activity_id: number, cancelled_by: number, reason: string) => {
  try {
    // ตรวจสอบว่ากิจกรรมมีอยู่จริงและไม่ถูกยกเลิกไปแล้ว
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
        message: 'ไม่พบกิจกรรมที่ต้องการยกเลิก'
      };
    }

    if (activityCheckResult.rows[0].status_name === 'cancelled') {
      return {
        success: false,
        message: 'กิจกรรมนี้ถูกยกเลิกไปแล้ว'
      };
    }

    if (activityCheckResult.rows[0].status_name === 'closed') {
      return {
        success: false,
        message: 'ไม่สามารถยกเลิกกิจกรรมที่ปิดไปแล้ว'
      };
    }

    // ดึง status_check_id สำหรับสถานะ 'cancelled'
    const statusResult = await pool.query(
      'SELECT id FROM status_check WHERE status_name = $1',
      ['cancelled']
    );

    if (statusResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบสถานะ "cancelled" ในระบบ'
      };
    }

    const cancelledStatusId = statusResult.rows[0].id;

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // อัปเดตสถานะกิจกรรมเป็น 'cancelled' (ใช้ status_check_id แทน status)
      await client.query(
        `UPDATE activities 
         SET status_check_id = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [cancelledStatusId, activity_id]
      );

      // บันทึกเหตุผลในการยกเลิกกิจกรรม
      await client.query(
        `INSERT INTO activity_cancellations (activity_id, cancelled_by, reason, cancelled_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [activity_id, cancelled_by, reason]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'ยกเลิกกิจกรรมสำเร็จ',
        activity_id,
        cancelled_by,
        reason
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error cancelling activity:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการยกเลิกกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};