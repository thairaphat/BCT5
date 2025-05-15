// src/route/adminRoute.ts
import { Elysia, t } from 'elysia';
import { banUser, unbanUser, toggleUserRole } from '../controller/admin/adminController';
import { 
  getPendingActivities, 
  getAllActivities, 
  getActivityById,
  approveActivity,
  rejectActivity,
  getActivityStats
} from '../controller/admin/adminActivityController';
import { authMiddleware } from '../middleware/authMiddleware';

// สร้าง middleware ตรวจสอบว่าเป็น admin
const adminAuthMiddleware = (app: Elysia) =>
  app.use(authMiddleware).derive(({ user, set }) => {
    if (!user || user.role !== 'admin') {
      set.status = 403;
      throw new Error('Forbidden: Admin access required');
    }
    return { user };
  });

export const adminRoute = new Elysia()
  .group('/admin', app => 
    app
      .use(adminAuthMiddleware)
      
      // ======= User Management Routes =======
      // Route สำหรับ ban ผู้ใช้
      .post('/ban-user', async ({ body, set }) => {
        const { id_user } = body as { id_user: number };
        const result = await banUser(id_user);
        
        if (!result.success && result.status) {
          set.status = result.status;
        }
        
        return result;
      })
      
      // Route สำหรับ unban ผู้ใช้
      .post('/unban-user', async ({ body, set }) => {
        const { id_user } = body as { id_user: number };
        const result = await unbanUser(id_user);
        
        if (!result.success && result.status) {
          set.status = result.status;
        }
        
        return result;
      })
      
      // Route สำหรับเปลี่ยน role
      .post('/toggle-role', async ({ body, set }) => {
        const { id_user } = body as { id_user: number };
        const result = await toggleUserRole(id_user);
        
        if (!result.success && result.status) {
          set.status = result.status;
        }
        
        return result;
      })

      // ======= Dashboard Route =======
      // Route สำหรับหน้า Dashboard
      .get('/dashboard', async () => {
        return await getActivityStats();
      })

      // ======= Activity Management Routes =======
      // ดึงข้อมูลกิจกรรมที่รอการอนุมัติ
      .get('/activities/pending', async () => {
        return await getPendingActivities();
      })

      // ดึงข้อมูลกิจกรรมทั้งหมด (สามารถกรองตาม status ได้)
      .get('/activities', async ({ query }) => {
        const status = query.status ? query.status.split(',') : undefined;
        return await getAllActivities(status);
      })

      // ดึงรายละเอียดกิจกรรมตาม ID
      .get('/activities/:id', async ({ params }) => {
        const activityId = parseInt(params.id);
        return await getActivityById(activityId);
      }, {
        params: t.Object({
          id: t.String()
        })
      })

      // อนุมัติกิจกรรม
      .post('/activities/:id/approve', async ({ params, user }) => {
        const activityId = parseInt(params.id);
        return await approveActivity(activityId, parseInt(user.id));
      }, {
        params: t.Object({
          id: t.String()
        })
      })

      // ปฏิเสธกิจกรรม
      .post('/activities/:id/reject', async ({ params, body, user }) => {
        const activityId = parseInt(params.id);
        const { reason } = body as { reason: string };
        
        if (!reason || reason.trim() === '') {
          return {
            success: false,
            message: 'กรุณาระบุเหตุผลในการปฏิเสธกิจกรรม'
          };
        }
        
        return await rejectActivity(activityId, parseInt(user.id), reason);
      }, {
        params: t.Object({
          id: t.String()
        }),
        body: t.Object({
          reason: t.String()
        })
      })
  );