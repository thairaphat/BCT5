import pool from '../../connect/db';

// ดึงรายชื่อผู้เข้าร่วมกิจกรรม
export const getActivityParticipants = async (activity_id: number) => {
  try {
    const result = await pool.query(
      `SELECT r.registration_id, r.user_id, r.status as registration_status, 
              r.registration_date, r.attended_date, r.points_earned, r.hours_earned, r.feedback,
              u.student_id, 
              ud.first_name, ud.last_name, 
              f.faculty_name, 
              d.department_name
       FROM registrations r
       JOIN users u ON r.user_id = u.id_user
       JOIN user_details ud ON u.id_user_details = ud.id_user_details
       LEFT JOIN faculty f ON ud.faculty_id = f.faculty_id
       LEFT JOIN department d ON ud.department_id = d.department_id
       WHERE r.activity_id = $1
       ORDER BY r.registration_date ASC`,
      [activity_id]
    );

    // ดึงข้อมูลกิจกรรม
    const activityResult = await pool.query(
      `SELECT a.id, a.name, a.max_participants, 
              (SELECT COUNT(*) FROM registrations WHERE activity_id = $1) as current_count
       FROM activities a 
       WHERE a.id = $1`,
      [activity_id]
    );

    if (activityResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรม'
      };
    }

    return {
      success: true,
      activity: activityResult.rows[0],
      participants: result.rows
    };
  } catch (error) {
    console.error('Error fetching activity participants:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้เข้าร่วมกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// อนุมัติผู้เข้าร่วมกิจกรรม
export const approveParticipant = async (registration_id: number, approved_by: number) => {
  try {
    // ตรวจสอบสถานะการลงทะเบียน
    const checkResult = await pool.query(
      'SELECT status FROM registrations WHERE registration_id = $1',
      [registration_id]
    );

    if (checkResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลการลงทะเบียน'
      };
    }

    if (checkResult.rows[0].status !== 'pending') {
      return {
        success: false,
        message: `ไม่สามารถอนุมัติได้ เนื่องจากการลงทะเบียนอยู่ในสถานะ ${checkResult.rows[0].status}`
      };
    }

    // อัปเดตสถานะการลงทะเบียนเป็น 'approved'
    await pool.query(
      `UPDATE registrations 
       SET status = 'approved', updated_at = CURRENT_TIMESTAMP
       WHERE registration_id = $1`,
      [registration_id]
    );

    return {
      success: true,
      message: 'อนุมัติผู้เข้าร่วมกิจกรรมสำเร็จ',
      registration_id
    };
  } catch (error) {
    console.error('Error approving participant:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการอนุมัติผู้เข้าร่วมกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ปฏิเสธผู้เข้าร่วมกิจกรรม
export const rejectParticipant = async (registration_id: number, rejected_by: number, reason: string) => {
  try {
    // ตรวจสอบสถานะการลงทะเบียน
    const checkResult = await pool.query(
      'SELECT status FROM registrations WHERE registration_id = $1',
      [registration_id]
    );

    if (checkResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลการลงทะเบียน'
      };
    }

    if (checkResult.rows[0].status !== 'pending') {
      return {
        success: false,
        message: `ไม่สามารถปฏิเสธได้ เนื่องจากการลงทะเบียนอยู่ในสถานะ ${checkResult.rows[0].status}`
      };
    }

    // อัปเดตสถานะการลงทะเบียนเป็น 'rejected' และเก็บเหตุผลในฟิลด์ feedback
    await pool.query(
      `UPDATE registrations 
       SET status = 'rejected', feedback = $2, updated_at = CURRENT_TIMESTAMP
       WHERE registration_id = $1`,
      [registration_id, reason]
    );

    return {
      success: true,
      message: 'ปฏิเสธผู้เข้าร่วมกิจกรรมสำเร็จ',
      registration_id,
      reason
    };
  } catch (error) {
    console.error('Error rejecting participant:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการปฏิเสธผู้เข้าร่วมกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// บันทึกการเข้าร่วมกิจกรรมจริง (check-in)
export const recordAttendance = async (registration_id: number, hours_earned: number, points_earned: number, feedback: string = '') => {
  try {
    // ตรวจสอบสถานะการลงทะเบียน
    const checkResult = await pool.query(
      'SELECT status FROM registrations WHERE registration_id = $1',
      [registration_id]
    );

    if (checkResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบข้อมูลการลงทะเบียน'
      };
    }

    if (checkResult.rows[0].status !== 'approved') {
      return {
        success: false,
        message: `ไม่สามารถบันทึกการเข้าร่วมได้ เนื่องจากการลงทะเบียนอยู่ในสถานะ ${checkResult.rows[0].status}`
      };
    }

    // อัปเดตข้อมูลการเข้าร่วม
    const currentDate = new Date().toISOString();
    await pool.query(
      `UPDATE registrations 
       SET status = 'attended', attended_date = $2, hours_earned = $3, points_earned = $4, 
           feedback = $5, updated_at = CURRENT_TIMESTAMP
       WHERE registration_id = $1`,
      [registration_id, currentDate, hours_earned, points_earned, feedback]
    );

    return {
      success: true,
      message: 'บันทึกการเข้าร่วมกิจกรรมสำเร็จ',
      registration_id,
      attended_date: currentDate,
      hours_earned,
      points_earned
    };
  } catch (error) {
    console.error('Error recording attendance:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกการเข้าร่วมกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};