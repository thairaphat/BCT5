import { Elysia } from 'elysia';
import { banUser, unbanUser, toggleUserRole } from '../controller/admin/adminController';
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
  );