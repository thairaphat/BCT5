import pool from '../../connect/db';

export const deleteActivity = async (activity_id: number, deleted_by: number) => {
  try {
    // ตรวจสอบว่ากิจกรรมมีอยู่จริง
    const activityCheckResult = await pool.query(
      `SELECT a.id, a.status, a.created_by
       FROM activities a 
       WHERE a.id = $1`,
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

      // ลบข้อมูลที่เกี่ยวข้องก่อน (foreign key constraints)
      
      // 1. ลบข้อมูลการลงทะเบียน
      await client.query(
        `DELETE FROM registrations WHERE activity_id = $1`,
        [activity_id]
      );

    //   // 2. ลบข้อมูลการยกเลิก (ถ้ามี)
    //   await client.query(
    //     `DELETE FROM activity_cancellations WHERE activity_id = $1`,
    //     [activity_id]
    //   );

      // 3. ลบรายละเอียดกิจกรรม
      await client.query(
        `DELETE FROM activity_details WHERE id_activity_details = $1`,
        [activity_id]
      );

      // 4. ลบข้อมูลกิจกรรมหลัก
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