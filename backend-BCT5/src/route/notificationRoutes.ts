import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  createNotification,
  notifyAllParticipants,
  notifyParticipantsByStatus
} from '../controller/notificationController';

export const notificationRoutes = new Elysia()
  .use(authMiddleware)
  
  // ดึงการแจ้งเตือนของผู้ใช้
  .get('/notifications', async ({ query, user }) => {
    if (!user) {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการดูการแจ้งเตือน'
      };
    }

    const unread_only = query.unread_only === 'true';
    const limit = query.limit ? parseInt(query.limit) : 20;

    return await getUserNotifications(parseInt(user.id), unread_only, limit);
  })
  
  // นับจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
  .get('/notifications/unread-count', async ({ user }) => {
    if (!user) {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการดูการแจ้งเตือน'
      };
    }

    return await getUnreadNotificationCount(parseInt(user.id));
  })
  
  // มาร์คการแจ้งเตือนว่าอ่านแล้ว
  .post('/notifications/:id/mark-as-read', async ({ params, user }) => {
    if (!user) {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการอัปเดตการแจ้งเตือน'
      };
    }

    const notification_id = parseInt(params.id);
    return await markNotificationAsRead(notification_id, parseInt(user.id));
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  
  // มาร์คการแจ้งเตือนทั้งหมดว่าอ่านแล้ว
  .post('/notifications/mark-all-as-read', async ({ user }) => {
    if (!user) {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการอัปเดตการแจ้งเตือน'
      };
    }

    return await markAllNotificationsAsRead(parseInt(user.id));
  })
  
  // สำหรับ staff หรือ admin เท่านั้น - สร้างการแจ้งเตือนสำหรับกิจกรรม
  .post('/notifications/activity/:activityId', async ({ params, body, user }) => {
    if (!user || !['staff', 'admin'].includes(user.role)) {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการสร้างการแจ้งเตือน'
      };
    }

    const activity_id = parseInt(params.activityId);
    const { content, notification_type, status } = body as {
      content: string,
      notification_type: 'activity' | 'points' | 'registration' | 'system',
      status?: string[]
    };

    if (status && status.length > 0) {
      return await notifyParticipantsByStatus(
        activity_id, 
        content,
        status,
        notification_type,
        `/student/activity-detail/${activity_id}`
      );
    } else {
      return await notifyAllParticipants(
        activity_id, 
        content,
        notification_type,
        `/student/activity-detail/${activity_id}`
      );
    }
  }, {
    params: t.Object({
      activityId: t.String()
    }),
    body: t.Object({
      content: t.String(),
      notification_type: t.Union([
        t.Literal('activity'),
        t.Literal('points'),
        t.Literal('registration'),
        t.Literal('system')
      ]),
      status: t.Optional(t.Array(t.String()))
    })
  });