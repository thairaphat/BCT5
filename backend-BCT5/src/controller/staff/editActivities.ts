import pool from '../../connect/db';
import { Elysia } from 'elysia';
export const editActivity = async (
  activity_id: Number,
  name: string,
  description: string,
  location: string,
  start_date: string,
  end_date: string,
  activity_type: number,
  reg_deadline: string,
  max_participants: number,
  volunteer_hours: number,
  volunteer_points: number,
  updated_by: number
) => {
  try {
    // ตรวจสอบว่ากิจกรรมมีอยู่จริงและไม่ถูกยกเลิก
    const activityCheckResult = await pool.query(
      `SELECT a.id, a.status 
       FROM activities a 
       WHERE a.id = $1 AND a.status NOT IN ('cancelled', 'closed')`,
      [activity_id]
    );

    if (activityCheckResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรมที่ต้องการแก้ไข หรือกิจกรรมถูกปิดหรือยกเลิกไปแล้ว'
      };
    }

    // ตรวจสอบว่ามีคนลงทะเบียนไปแล้วหรือไม่
    const registrationsResult = await pool.query(
      'SELECT COUNT(*) as count FROM registrations WHERE activity_id = $1',
      [activity_id]
    );

    const registrationsCount = parseInt(registrationsResult.rows[0].count);

    // ตรวจสอบว่าถ้ามีคนลงทะเบียนแล้ว max_participants ต้องไม่น้อยกว่าจำนวนคนที่ลงทะเบียน
    if (registrationsCount > 0 && max_participants < registrationsCount) {
      return {
        success: false,
        message: `ไม่สามารถกำหนดจำนวนผู้เข้าร่วมน้อยกว่าจำนวนที่ลงทะเบียนแล้ว (${registrationsCount} คน)`
      };
    }

    // ตรวจสอบว่า start_date น้อยกว่า end_date
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    const regDeadlineObj = new Date(reg_deadline);

    if (startDateObj > endDateObj) {
      return {
        success: false,
        message: 'วันที่เริ่มต้นกิจกรรมต้องมาก่อนวันที่สิ้นสุดกิจกรรม'
      };
    }

    if (regDeadlineObj > startDateObj) {
      return {
        success: false,
        message: 'วันสิ้นสุดการลงทะเบียนต้องมาก่อนวันที่เริ่มต้นกิจกรรม'
      };
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. อัปเดตข้อมูลกิจกรรมใน activities
      await client.query(
        `UPDATE activities 
         SET name = $1, activity_type = $2, reg_deadline = $3, max_participants = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5`,
        [name, activity_type, reg_deadline, max_participants, activity_id]
      );

      // 2. อัปเดตรายละเอียดกิจกรรมใน activity_details
      await client.query(
        `UPDATE activity_details 
         SET description = $1, location = $2, start_date = $3, end_date = $4, volunteer_hours = $5, volunteer_points = $6
         WHERE id_activity_details = $7`,
        [description, location, start_date, end_date, volunteer_hours, volunteer_points, activity_id]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'แก้ไขกิจกรรมสำเร็จ',
        activity: {
          id: activity_id,
          name,
          activity_type,
          description,
          location,
          start_date,
          end_date,
          reg_deadline,
          max_participants,
          volunteer_hours,
          volunteer_points,
          updated_by
        }
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error editing activity:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการแก้ไขกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};