import pool from '../../connect/db';

export const createActivity = async (
  name: string,
  description: string,
  location: string,
  start_date: string,
  end_date: string,
  activity_type: string,
  reg_deadline: string,
  max_participants: number,
  volunteer_hours: number,
  volunteer_points: number,
  created_by: number
) => {
  try {
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

      // 1. สร้างข้อมูลกิจกรรมใน activities
      const activityResult = await client.query(
        `INSERT INTO activities(name, activity_type, reg_deadline, created_by, status, max_participants, created_at, updated_at)
         VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id, name, activity_type, reg_deadline, status, max_participants`,
        [name, activity_type, reg_deadline, created_by, 'open', max_participants]
      );

      const activityId = activityResult.rows[0].id;

      // 2. เพิ่มรายละเอียดกิจกรรมใน activity_details
      await client.query(
        `INSERT INTO activity_details(id_activity_details, description, location, start_date, end_date, volunteer_hours, volunteer_points)
         VALUES($1, $2, $3, $4, $5, $6, $7)`,
        [activityId, description, location, start_date, end_date, volunteer_hours, volunteer_points]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'สร้างกิจกรรมสำเร็จ',
        activity: {
          id: activityId,
          name,
          activity_type,
          description,
          location,
          start_date,
          end_date,
          reg_deadline,
          status: 'open',
          max_participants,
          volunteer_hours,
          volunteer_points,
          created_by
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
    console.error('Error creating activity:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};