import pool from '../../connect/db';

export const cancelActivity = async (activity_id: number, cancelled_by: number, reason: string) => {
  try {
    // ตรวจสอบว่ากิจกรรมมีอยู่จริงและไม่ถูกยกเลิกไปแล้ว
    const activityCheckResult = await pool.query(
      `SELECT a.id, a.status 
       FROM activities a 
       WHERE a.id = $1`,
      [activity_id]
    );

    if (activityCheckResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรมที่ต้องการยกเลิก'
      };
    }

    if (activityCheckResult.rows[0].status === 'cancelled') {
      return {
        success: false,
        message: 'กิจกรรมนี้ถูกยกเลิกไปแล้ว'
      };
    }

    if (activityCheckResult.rows[0].status === 'closed') {
      return {
        success: false,
        message: 'ไม่สามารถยกเลิกกิจกรรมที่ปิดไปแล้ว'
      };
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // อัปเดตสถานะกิจกรรมเป็น 'cancelled'
      await client.query(
        `UPDATE activities 
         SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [activity_id]
      );

      // ลบการลงทะเบียนสำหรับกิจกรรมนี้ทั้งหมด (ถ้าต้องการ)
      // await client.query(
      //   `DELETE FROM registrations WHERE id_activity = $1`,
      //   [activity_id]
      // );

      // บันทึกเหตุผลในการยกเลิกกิจกรรม (สมมติว่ามีตาราง activity_cancellations)
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