import pool from '../../connect/db';

// ดึงข้อมูลกิจกรรมทั้งหมด
export const getAllActivities = async (status: string[] = ['open', 'closed', 'cancelled']) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.name, a.activity_type, a.reg_deadline, a.status, a.max_participants, 
              a.created_at, a.updated_at, a.created_by, ad.id_activity_details,
              ad.description, ad.location, ad.start_date, ad.end_date, 
              ad.volunteer_hours, ad.volunteer_points
       FROM activities a
       JOIN activity_details ad ON a.id = ad.id_activity_details
       WHERE a.status = ANY($1)
       ORDER BY a.created_at DESC`,
      [status]
    );

    return {
      success: true,
      activities: result.rows
    };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ดึงข้อมูลกิจกรรมตาม ID
export const getActivityById = async (activity_id: number) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.name, a.activity_type, a.reg_deadline, a.status, a.max_participants, 
              a.created_at, a.updated_at, a.created_by, ad.id_activity_details,
              ad.description, ad.location, ad.start_date, ad.end_date, 
              ad.volunteer_hours, ad.volunteer_points
       FROM activities a
       JOIN activity_details ad ON a.id = ad.id_activity_details
       WHERE a.id = $1`,
      [activity_id]
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรมที่ต้องการ'
      };
    }

    return {
      success: true,
      activity: result.rows[0]
    };
  } catch (error) {
    console.error('Error fetching activity:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};