import pool from '../../connect/db';

export const joinActivity = async (user_id: number, activity_id: number) => {
  try {
    // ตรวจสอบว่าลงทะเบียนแล้วหรือไม่
    const checkExisting = await pool.query(
      'SELECT * FROM registrations WHERE user_id = $1 AND activity_id = $2',
      [user_id, activity_id]
    );

    if (checkExisting.rows.length > 0) {
      return {
        success: false,
        message: 'คุณได้ลงทะเบียนกิจกรรมนี้ไปแล้ว'
      };
    }

    // ตรวจสอบสถานะกิจกรรม
    const activityCheck = await pool.query(
      'SELECT status, max_participants FROM activities WHERE id = $1',
      [activity_id]
    );

    if (activityCheck.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรม'
      };
    }

    if (activityCheck.rows[0].status !== 'open') {
      return {
        success: false,
        message: 'กิจกรรมนี้ไม่ได้เปิดให้ลงทะเบียน'
      };
    }

    // ตรวจสอบว่าไม่ใช่ผู้สร้างกิจกรรม
    const creatorCheck = await pool.query(
      'SELECT created_by FROM activities WHERE id = $1',
      [activity_id]
    );

    if (creatorCheck.rows.length > 0 && creatorCheck.rows[0].created_by === user_id) {
      return {
        success: false,
        message: 'ไม่สามารถลงทะเบียนกิจกรรมที่คุณเป็นผู้สร้างได้'
      };
    }

    // ตรวจสอบจำนวนผู้เข้าร่วมปัจจุบันกับ max_participants
    const registrationsCount = await pool.query(
      'SELECT COUNT(*) as count FROM registrations WHERE activity_id = $1',
      [activity_id]
    );

    const currentCount = parseInt(registrationsCount.rows[0].count);
    const maxParticipants = activityCheck.rows[0].max_participants;

    if (currentCount >= maxParticipants) {
      return {
        success: false,
        message: 'กิจกรรมนี้เต็มแล้ว ไม่สามารถลงทะเบียนได้'
      };
    }

    // เพิ่มข้อมูลการลงทะเบียน
    const currentDate = new Date().toISOString();
    const result = await pool.query(
      `INSERT INTO registrations (user_id, activity_id, registration_date, status, created_at, updated_at)
       VALUES ($1, $2, $3, 'pending', $4, $5)
       RETURNING id`,
      [user_id, activity_id, currentDate, currentDate, currentDate]
    );

    return {
      success: true,
      message: 'ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ รอการอนุมัติ',
      activity_id,
      registration_id: result.rows[0].id
    };
  } catch (error) {
    console.error('Error joining activity:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียนกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ดึงข้อมูลกิจกรรมที่นิสิตลงทะเบียนไว้
export const getStudentActivities = async (user_id: number) => {
  try {
    // ปรับปรุง query ให้สอดคล้องกับโครงสร้างฐานข้อมูล
    const result = await pool.query(
      `SELECT r.id, r.user_id, r.activity_id, r.status as registration_status, 
              r.registration_date, r.attended_date, r.points_earned, r.hours_earned,
              a.id as activity_id, a.name, a.activity_type, a.status as activity_status,
              ad.description, ad.location, ad.start_date, ad.end_date, 
              ad.volunteer_hours, ad.volunteer_points
       FROM registrations r
       JOIN activities a ON r.activity_id = a.id
       JOIN activity_details ad ON a.id = ad.id_activity_details
       WHERE r.user_id = $1
       ORDER BY r.registration_date DESC`,
      [user_id]
    );

    return {
      success: true,
      activities: result.rows
    };
  } catch (error) {
    console.error('Error fetching student activities:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมที่ลงทะเบียน',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};