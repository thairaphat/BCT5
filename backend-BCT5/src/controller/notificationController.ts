import pool from '../connect/db';

// ส่งการแจ้งเตือนไปยังผู้ใช้
export const createNotification = async (
  user_id: number,
  content: string,
  notification_type: 'activity' | 'points' | 'registration' | 'system',
  activity_id?: number,
  action_url?: string
) => {
  try {
    const result = await pool.query(
      `INSERT INTO notifications
       (user_id, content, is_read, created_at, activity_id, notification_type, action_url)
       VALUES ($1, $2, FALSE, CURRENT_TIMESTAMP, $3, $4, $5)
       RETURNING id`,
      [user_id, content, activity_id, notification_type, action_url]
    );

    return {
      success: true,
      notification_id: result.rows[0].id
    };
  } catch (error) {
    console.error('Error creating notification:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างการแจ้งเตือน',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ส่งการแจ้งเตือนไปยังผู้ลงทะเบียนทั้งหมดในกิจกรรม
export const notifyAllParticipants = async (
  activity_id: number,
  content: string,
  notification_type: 'activity' | 'points' | 'registration' | 'system',
  action_url?: string
) => {
  try {
    // ดึงรายชื่อผู้ลงทะเบียน
    const participantsResult = await pool.query(
      `SELECT DISTINCT r.user_id 
       FROM registrations r
       WHERE r.activity_id = $1`,
      [activity_id]
    );

    if (participantsResult.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบผู้ลงทะเบียนในกิจกรรมนี้'
      };
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // สร้างการแจ้งเตือนสำหรับผู้ลงทะเบียนแต่ละคน
      for (const participant of participantsResult.rows) {
        await client.query(
          `INSERT INTO notifications
           (user_id, content, is_read, created_at, activity_id, notification_type, action_url)
           VALUES ($1, $2, FALSE, CURRENT_TIMESTAMP, $3, $4, $5)`,
          [participant.user_id, content, activity_id, notification_type, action_url]
        );
      }

      await client.query('COMMIT');

      return {
        success: true,
        message: `ส่งการแจ้งเตือนไปยังผู้ลงทะเบียนทั้งหมด ${participantsResult.rows.length} คนสำเร็จ`,
        notification_count: participantsResult.rows.length
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error notifying all participants:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งการแจ้งเตือนไปยังผู้ลงทะเบียน',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ส่งการแจ้งเตือนไปยังผู้ลงทะเบียนที่มีสถานะเฉพาะ
export const notifyParticipantsByStatus = async (
  activity_id: number,
  content: string,
  status: string[],
  notification_type: 'activity' | 'points' | 'registration' | 'system',
  action_url?: string
) => {
  try {
    // ดึงรายชื่อผู้ลงทะเบียนตามสถานะ
    const participantsResult = await pool.query(
      `SELECT DISTINCT r.user_id 
       FROM registrations r
       JOIN status_check s ON r.status_check_id = s.id
       WHERE r.activity_id = $1 AND s.status_name = ANY($2)`,
      [activity_id, status]
    );

    if (participantsResult.rows.length === 0) {
      return {
        success: false,
        message: `ไม่พบผู้ลงทะเบียนที่มีสถานะ ${status.join(', ')} ในกิจกรรมนี้`
      };
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // สร้างการแจ้งเตือนสำหรับผู้ลงทะเบียนแต่ละคน
      for (const participant of participantsResult.rows) {
        await client.query(
          `INSERT INTO notifications
           (user_id, content, is_read, created_at, activity_id, notification_type, action_url)
           VALUES ($1, $2, FALSE, CURRENT_TIMESTAMP, $3, $4, $5)`,
          [participant.user_id, content, activity_id, notification_type, action_url]
        );
      }

      await client.query('COMMIT');

      return {
        success: true,
        message: `ส่งการแจ้งเตือนไปยังผู้ลงทะเบียนที่มีสถานะ ${status.join(', ')} จำนวน ${participantsResult.rows.length} คนสำเร็จ`,
        notification_count: participantsResult.rows.length
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error notifying participants by status:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งการแจ้งเตือนไปยังผู้ลงทะเบียน',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ดึงการแจ้งเตือนของผู้ใช้
export const getUserNotifications = async (user_id: number, unread_only: boolean = false, limit: number = 20) => {
  try {
    let query = `
      SELECT n.id, n.content, n.is_read, n.created_at, n.activity_id, 
             n.notification_type, n.action_url,
             a.name as activity_name
      FROM notifications n
      LEFT JOIN activities a ON n.activity_id = a.id
      WHERE n.user_id = $1
    `;

    const params: any[] = [user_id];

    if (unread_only) {
      query += ` AND n.is_read = FALSE`;
    }

    query += ` ORDER BY n.created_at DESC LIMIT $2`;
    params.push(limit);

    const result = await pool.query(query, params);

    return {
      success: true,
      notifications: result.rows,
      total_count: result.rows.length,
      unread_count: result.rows.filter(n => !n.is_read).length
    };
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// มาร์คการแจ้งเตือนว่าอ่านแล้ว
export const markNotificationAsRead = async (notification_id: number, user_id: number) => {
  try {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [notification_id, user_id]
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'ไม่พบการแจ้งเตือนหรือคุณไม่มีสิทธิ์เข้าถึงการแจ้งเตือนนี้'
      };
    }

    return {
      success: true,
      message: 'มาร์คการแจ้งเตือนว่าอ่านแล้วสำเร็จ',
      notification_id
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการมาร์คการแจ้งเตือน',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// มาร์คการแจ้งเตือนทั้งหมดของผู้ใช้ว่าอ่านแล้ว
export const markAllNotificationsAsRead = async (user_id: number) => {
  try {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE
       WHERE user_id = $1 AND is_read = FALSE
       RETURNING id`,
      [user_id]
    );

    return {
      success: true,
      message: `มาร์คการแจ้งเตือนทั้งหมด ${result.rowCount} รายการว่าอ่านแล้วสำเร็จ`,
      updated_count: result.rowCount
    };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการมาร์คการแจ้งเตือนทั้งหมด',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// นับจำนวนการแจ้งเตือนที่ยังไม่ได้อ่านของผู้ใช้
export const getUnreadNotificationCount = async (user_id: number) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as unread_count
       FROM notifications
       WHERE user_id = $1 AND is_read = FALSE`,
      [user_id]
    );

    return {
      success: true,
      unread_count: parseInt(result.rows[0].unread_count)
    };
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการนับจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};