import { Elysia } from 'elysia';
import pool from '../connect/db';
import { authMiddleware } from '../middleware/authMiddleware';
import type { CustomContext } from '../type/context';

export const studentRoute = new Elysia()

  .use(authMiddleware) // แนบ middleware ตรวจ JWT

  .get('/student/profile', async ({ user }: CustomContext) => {
    if (user.role !== 'student') {
      return { success: false, message: 'Access denied' };
    }

   const result = await pool.query(
      `SELECT 
        u.id_user, u.student_id, u.role, u.status,
        d.id_user_details, d.first_name, d.last_name, d.email,
        d.volunteer_hours, d.volunteer_points, d.faculty_id, d.department_id
      FROM users u
      JOIN user_details d ON u.id_user_details = d.id_user_details
      WHERE u.id_user = $1`,
      [user.id]
    );

    if (result.rowCount === 0) {
      return { success: false, message: 'Profile not found' };
    }

    return {
      success: true,
      profile: result.rows[0]
    };
  });