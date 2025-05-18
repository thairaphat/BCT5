import pool from '../../connect/db';

// ดึงข้อมูลประวัติกิจกรรมทั้งหมดของนักศึกษา พร้อมเรียงลำดับและมีข้อมูลเพิ่มเติม
export const getStudentActivityHistory = async (user_id: number) => {
  try {
    const result = await pool.query(
      `SELECT r.registration_id, r.user_id, r.activity_id, r.status as registration_status, 
              r.registration_date, r.attended_date, r.points_earned, r.hours_earned, r.feedback,
              a.id as activity_id, a.name, a.activity_type, a.status as activity_status,
              a.created_at, a.updated_at, a.max_participants,
              ad.description, ad.location, ad.start_date, ad.end_date, 
              ad.volunteer_hours, ad.volunteer_points
       FROM registrations r
       JOIN activities a ON r.activity_id = a.id
       JOIN activity_details ad ON a.id = ad.id_activity_details
       WHERE r.user_id = $1
       ORDER BY 
          CASE 
            WHEN r.status = 'pending' THEN 1
            WHEN r.status = 'approved' THEN 2
            WHEN r.status = 'attended' THEN 3
            WHEN r.status = 'rejected' THEN 4
            ELSE 5
          END,
          ad.start_date DESC`, // แก้จาก a.start_date เป็น ad.start_date
      [user_id]
    );

    // คำนวณคะแนนและชั่วโมงจิตอาสารวม
    let totalPoints = 0;
    let totalHours = 0;
    
    result.rows.forEach(row => {
      if (row.registration_status === 'attended' && row.points_earned) {
        totalPoints += parseFloat(row.points_earned);
      }
      if (row.registration_status === 'attended' && row.hours_earned) {
        totalHours += parseFloat(row.hours_earned);
      }
    });

    // แยกข้อมูลตามสถานะการลงทะเบียน
    const pendingActivities = result.rows.filter(r => r.registration_status === 'pending');
    const approvedActivities = result.rows.filter(r => r.registration_status === 'approved');
    const attendedActivities = result.rows.filter(r => r.registration_status === 'attended');
    const rejectedActivities = result.rows.filter(r => r.registration_status === 'rejected');

    // จัดเตรียมรูปแบบข้อมูลที่จะส่งกลับ
    return {
      success: true,
      summary: {
        totalActivities: result.rows.length,
        pendingCount: pendingActivities.length,
        approvedCount: approvedActivities.length,
        attendedCount: attendedActivities.length,
        rejectedCount: rejectedActivities.length,
        totalPoints: totalPoints,
        totalHours: totalHours,
      },
      pendingActivities,
      approvedActivities,
      attendedActivities,
      rejectedActivities,
      allActivities: result.rows
    };
  } catch (error) {
    console.error('Error fetching student activity history:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ดึงรายละเอียดของกิจกรรมเฉพาะที่นักศึกษาลงทะเบียน
export const getStudentActivityDetail = async (user_id: number, activity_id: number) => {
  try {
    // ตรวจสอบว่านักศึกษาลงทะเบียนกิจกรรมนี้หรือไม่
    const registrationCheck = await pool.query(
      `SELECT r.registration_id, s.status_name
       FROM registrations r
       JOIN status_check s ON r.status_check_id = s.id
       WHERE r.user_id = $1 AND r.activity_id = $2`,
      [user_id, activity_id]
    );

    if (registrationCheck.rows.length === 0) {
      return {
        success: false,
        message: 'คุณไม่ได้ลงทะเบียนกิจกรรมนี้'
      };
    }

    const registration = registrationCheck.rows[0];
    
    // ถ้าสถานะเป็น 'rejected' ให้ดึงข้อมูลการปฏิเสธเพิ่มเติม
    let rejectionInfo = null;
    if (registration.status_name === 'rejected') {
      const rejectionResult = await pool.query(
        `SELECT rr.reason, rr.rejected_at,
                u.student_id as rejected_by_student_id,
                ud.first_name as rejected_by_first_name, 
                ud.last_name as rejected_by_last_name
         FROM registration_rejections rr
         JOIN users u ON rr.rejected_by = u.id_user
         JOIN user_details ud ON u.id_user_details = ud.id_user_details
         WHERE rr.registration_id = $1
         ORDER BY rr.rejected_at DESC
         LIMIT 1`,
        [registration.registration_id]
      );
      
      if (rejectionResult.rows.length > 0) {
        rejectionInfo = rejectionResult.rows[0];
      }
    }

    // ดึงข้อมูลกิจกรรมพร้อมรายละเอียด
    const activityResult = await pool.query(
      `SELECT a.id, a.name, a.activity_type, a.reg_deadline, s2.status_name as activity_status, 
              a.max_participants, a.created_at, a.updated_at, a.created_by,
              ad.description, ad.location, ad.start_date, ad.end_date, 
              ad.volunteer_hours, ad.volunteer_points,
              r.registration_id, s.status_name as registration_status, 
              r.registration_date, r.attended_date, r.points_earned, r.hours_earned, r.feedback,
              u.student_id as creator_student_id,
              ud.first_name as creator_first_name, 
              ud.last_name as creator_last_name
       FROM activities a
       JOIN activity_details ad ON a.id = ad.id_activity_details
       JOIN registrations r ON a.id = r.activity_id AND r.user_id = $1
       JOIN status_check s ON r.status_check_id = s.id
       JOIN status_check s2 ON a.status_check_id = s2.id
       JOIN users u ON a.created_by = u.id_user
       JOIN user_details ud ON u.id_user_details = ud.id_user_details
       WHERE a.id = $2 AND a.is_deleted = FALSE`,
      [user_id, activity_id]
    );

    if (activityResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลกิจกรรม'
      };
    }

    // ดึงข้อมูลจำนวนผู้เข้าร่วมทั้งหมด
    const participantsCount = await pool.query(
      `SELECT COUNT(*) as total_participants 
       FROM registrations r
       JOIN status_check s ON r.status_check_id = s.id
       WHERE r.activity_id = $1 AND s.status_name IN ('approved', 'in-process', 'passed', 'failed')`,
      [activity_id]
    );

    // รวมข้อมูลเพื่อส่งกลับ
    return {
      success: true,
      activity: {
        ...activityResult.rows[0],
        total_participants: participantsCount.rows[0].total_participants
      },
      rejectionInfo
    };
  } catch (error) {
    console.error('Error fetching student activity detail:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายละเอียดกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ดึงข้อมูลสรุปสำหรับแดชบอร์ดของนักศึกษา
export const getStudentDashboard = async (user_id: number) => {
  try {
    // ดึงข้อมูลสรุปกิจกรรมของนักศึกษา
    const activityStats = await pool.query(
      `SELECT 
        COUNT(*) as total_activities,
        SUM(CASE WHEN sc.status_name = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN sc.status_name IN ('approved', 'in-process') THEN 1 ELSE 0 END) as approved_count, 
        SUM(CASE WHEN sc.status_name = 'passed' THEN 1 ELSE 0 END) as attended_count,
        SUM(CASE WHEN sc.status_name IN ('rejected', 'failed') THEN 1 ELSE 0 END) as rejected_count,
        SUM(CASE WHEN sc.status_name = 'passed' THEN r.points_earned ELSE 0 END) as total_points,
        SUM(CASE WHEN sc.status_name = 'passed' THEN r.hours_earned ELSE 0 END) as total_hours
      FROM registrations r
      JOIN status_check sc ON r.status_check_id = sc.id
      WHERE r.user_id = $1`,
      [user_id]
    );

    // ดึงข้อมูลกิจกรรมล่าสุด 5 รายการ
    const recentActivities = await pool.query(
      `SELECT r.registration_id, sc.status_name as registration_status, 
              r.registration_date, a.id as activity_id, a.name, 
              a.activity_type, sc2.status_name as activity_status,
              ad.start_date, ad.end_date
       FROM registrations r
       JOIN status_check sc ON r.status_check_id = sc.id
       JOIN activities a ON r.activity_id = a.id
       JOIN status_check sc2 ON a.status_check_id = sc2.id
       JOIN activity_details ad ON a.id = ad.id_activity_details
       WHERE r.user_id = $1
       ORDER BY r.registration_date DESC
       LIMIT 5`,
      [user_id]
    );

    // ดึงข้อมูลกิจกรรมที่กำลังจะถึง
    const upcomingActivities = await pool.query(
      `SELECT r.registration_id, sc.status_name as registration_status, 
              a.id as activity_id, a.name, a.activity_type,
              ad.start_date, ad.end_date
       FROM registrations r
       JOIN status_check sc ON r.status_check_id = sc.id
       JOIN activities a ON r.activity_id = a.id
       JOIN activity_details ad ON a.id = ad.id_activity_details
       WHERE r.user_id = $1
         AND sc.status_name IN ('approved', 'in-process')
         AND ad.start_date > CURRENT_DATE
       ORDER BY ad.start_date ASC
       LIMIT 3`,
      [user_id]
    );

    // ดึงข้อมูลส่วนตัวของนักศึกษา
    const userProfile = await pool.query(
      `SELECT u.id_user, u.student_id, u.role, sc.status_name as status,
              ud.first_name, ud.last_name, ud.email,
              ud.volunteer_hours, ud.volunteer_points,
              f.faculty_name, d.department_name
       FROM users u
       JOIN user_details ud ON u.id_user_details = ud.id_user_details
       JOIN status_check sc ON u.status_check_id = sc.id
       LEFT JOIN faculty f ON ud.faculty_id = f.faculty_id
       LEFT JOIN department d ON ud.department_id = d.department_id
       WHERE u.id_user = $1`,
      [user_id]
    );

    return {
      success: true,
      stats: activityStats.rows[0],
      recentActivities: recentActivities.rows,
      upcomingActivities: upcomingActivities.rows,
      profile: userProfile.rows[0]
    };
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแดชบอร์ด',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};