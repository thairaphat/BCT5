import pool from '../../connect/db';

// ดึงข้อมูลกิจกรรมทั้งหมดที่รอการอนุมัติ (status = 'pending')
export const getPendingActivities = async () => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.name, a.activity_type, a.reg_deadline, a.status, a.max_participants, 
             a.created_at, a.updated_at, a.created_by, 
             ad.description, ad.location, ad.start_date, ad.end_date, 
             ad.volunteer_hours, ad.volunteer_points,
             u.student_id as creator_student_id,
             ud.first_name as creator_first_name, 
             ud.last_name as creator_last_name
      FROM activities a
      JOIN activity_details ad ON a.id = ad.id_activity_details
      JOIN users u ON a.created_by = u.id_user
      JOIN user_details ud ON u.id_user_details = ud.id_user_details
      WHERE a.status = 'pending'
      ORDER BY a.created_at DESC
    `);

    return {
      success: true,
      pendingActivities: result.rows
    };
  } catch (error) {
    console.error('Error fetching pending activities:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมที่รอการอนุมัติ',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ดึงข้อมูลกิจกรรมทั้งหมด สามารถกรองตาม status และ activity_type ได้
export const getAllActivities = async (status?: string[], activityTypes?: string[]) => {
  try {
    let query = `
      SELECT a.id, a.name, a.activity_type, a.reg_deadline, a.status, a.max_participants, 
             a.created_at, a.updated_at, a.created_by, 
             ad.description, ad.location, ad.start_date, ad.end_date, 
             ad.volunteer_hours, ad.volunteer_points,
             u.student_id as creator_student_id,
             ud.first_name as creator_first_name, 
             ud.last_name as creator_last_name
      FROM activities a
      JOIN activity_details ad ON a.id = ad.id_activity_details
      JOIN users u ON a.created_by = u.id_user
      JOIN user_details ud ON u.id_user_details = ud.id_user_details
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;
    
    if (status && status.length > 0) {
      query += ` AND a.status = ANY($${paramIndex})`;
      params.push(status);
      paramIndex++;
    }
    
    if (activityTypes && activityTypes.length > 0) {
      query += ` AND a.activity_type = ANY($${paramIndex})`;
      params.push(activityTypes);
      paramIndex++;
    }

    query += ' ORDER BY a.created_at DESC';
    
    const result = await pool.query(query, params);

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

// ดึงประเภทกิจกรรมทั้งหมดที่มีอยู่ในระบบ
export const getActivityTypes = async () => {
  try {
    const query = `
      SELECT DISTINCT activity_type
      FROM activities
      ORDER BY activity_type
    `;
    
    const result = await pool.query(query);

    return {
      success: true,
      activityTypes: result.rows.map(row => row.activity_type)
    };
  } catch (error) {
    console.error('Error fetching activity types:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ดึงรายละเอียดกิจกรรมตาม ID
export const getActivityById = async (activityId: number) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.name, a.activity_type, a.reg_deadline, a.status, a.max_participants, 
             a.created_at, a.updated_at, a.created_by, 
             ad.description, ad.location, ad.start_date, ad.end_date, 
             ad.volunteer_hours, ad.volunteer_points,
             u.student_id as creator_student_id,
             ud.first_name as creator_first_name, 
             ud.last_name as creator_last_name
      FROM activities a
      JOIN activity_details ad ON a.id = ad.id_activity_details
      JOIN users u ON a.created_by = u.id_user
      JOIN user_details ud ON u.id_user_details = ud.id_user_details
      WHERE a.id = $1
    `, [activityId]);

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรม'
      };
    }

    // ถ้ากิจกรรมถูกปฏิเสธ ให้ดึงเหตุผลมาด้วย
    let rejectionReason = null;
    if (result.rows[0].status === 'rejected') {
      const reasonResult = await pool.query(`
        SELECT reason, rejected_at 
        FROM activity_rejections 
        WHERE activity_id = $1 
        ORDER BY rejected_at DESC LIMIT 1
      `, [activityId]);
      
      if (reasonResult.rows.length > 0) {
        rejectionReason = reasonResult.rows[0];
      }
    }

    return {
      success: true,
      activity: result.rows[0],
      rejectionReason
    };
  } catch (error) {
    console.error('Error fetching activity details:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายละเอียดกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// อนุมัติกิจกรรม
export const approveActivity = async (activityId: number, approvedBy: number) => {
  try {
    // ตรวจสอบสถานะปัจจุบันของกิจกรรม
    const checkResult = await pool.query(
      'SELECT status FROM activities WHERE id = $1',
      [activityId]
    );

    if (checkResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรมที่ต้องการอนุมัติ'
      };
    }

    if (checkResult.rows[0].status !== 'pending') {
      return {
        success: false,
        message: `ไม่สามารถอนุมัติกิจกรรมได้ เนื่องจากกิจกรรมอยู่ในสถานะ ${checkResult.rows[0].status}`
      };
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // อัปเดตสถานะเป็น 'open'
      await client.query(
        `UPDATE activities 
         SET status = 'open', updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [activityId]
      );

      // บันทึกประวัติการอนุมัติ (สมมติว่ามีตาราง activity_approvals)
      await client.query(
        `INSERT INTO activity_approvals (activity_id, approved_by, approved_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)`,
        [activityId, approvedBy]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'อนุมัติกิจกรรมสำเร็จ',
        activityId
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error approving activity:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการอนุมัติกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ปฏิเสธกิจกรรม
export const rejectActivity = async (activityId: number, rejectedBy: number, reason: string) => {
  try {
    // ตรวจสอบสถานะปัจจุบันของกิจกรรม
    const checkResult = await pool.query(
      'SELECT status FROM activities WHERE id = $1',
      [activityId]
    );

    if (checkResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบกิจกรรมที่ต้องการปฏิเสธ'
      };
    }

    if (checkResult.rows[0].status !== 'pending') {
      return {
        success: false,
        message: `ไม่สามารถปฏิเสธกิจกรรมได้ เนื่องจากกิจกรรมอยู่ในสถานะ ${checkResult.rows[0].status}`
      };
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // อัปเดตสถานะเป็น 'rejected'
      await client.query(
        `UPDATE activities 
         SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [activityId]
      );

      // บันทึกเหตุผลในการปฏิเสธ (สมมติว่ามีตาราง activity_rejections)
      await client.query(
        `INSERT INTO activity_rejections (activity_id, rejected_by, reason, rejected_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [activityId, rejectedBy, reason]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'ปฏิเสธกิจกรรมสำเร็จ',
        activityId,
        reason
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error rejecting activity:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการปฏิเสธกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// สรุปข้อมูลกิจกรรมสำหรับหน้า Dashboard
export const getActivityStats = async () => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM activities WHERE status = 'pending') AS pending_count,
        (SELECT COUNT(*) FROM activities WHERE status = 'open') AS open_count,
        (SELECT COUNT(*) FROM activities WHERE status = 'closed') AS closed_count,
        (SELECT COUNT(*) FROM activities WHERE status = 'cancelled') AS cancelled_count,
        (SELECT COUNT(*) FROM activities WHERE status = 'rejected') AS rejected_count,
        (SELECT COUNT(*) FROM activities) AS total_count
    `);

    // รายการกิจกรรมล่าสุด (5 รายการ)
    const latestActivities = await pool.query(`
      SELECT a.id, a.name, a.status, a.created_at, u.student_id as creator_student_id
      FROM activities a
      JOIN users u ON a.created_by = u.id_user
      ORDER BY a.created_at DESC
      LIMIT 5
    `);

    return {
      success: true,
      stats: stats.rows[0],
      latestActivities: latestActivities.rows
    };
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติกิจกรรม',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};