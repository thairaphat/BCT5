import { Elysia } from 'elysia';
import pool from '../../connect/db';
interface RoleToggleRequest {
  id_user: number;
}
export const adminController = new Elysia()
  .post('/ban-user', async ({ body, set }: { body: { id_user: number }, set: any }) => {
  const { id_user } = body;

  if (!id_user) {
    set.status = 400;
    return { success: false, message: 'Missing user ID' };
  }

  await pool.query('UPDATE users SET status = $1 WHERE id_user = $2', ['banned', id_user]);

  return { success: true, message: 'User has been banned' };
})
  .post('/unban-user', async ({ body, set }: { body: { id_user: number }, set: any }) => {
  const { id_user } = body;

    if (!id_user) {
      set.status = 400;
      return { success: false, message: 'Missing user ID' };
    }

    await pool.query('UPDATE users SET status = $1 WHERE id_user = $2', ['active', id_user]);

    return { success: true, message: 'User has been unbanned' };
  })
  .post('/toggle-role', async ({ body, set }: { body: RoleToggleRequest; set: any }) => {
    const { id_user } = body;

    if (!id_user) {
      set.status = 400;
      return { success: false, message: 'Missing user ID' };
    }

    const result = await pool.query('SELECT role FROM users WHERE id_user = $1', [id_user]);

    if (result.rowCount === 0) {
      set.status = 404;
      return { success: false, message: 'User not found' };
    }

    const currentRole = result.rows[0].role;
    let newRole = '';
    if (currentRole === 'student') {
      newRole = 'staff';
    } else if (currentRole === 'staff') {
      newRole = 'student';
    } else {
      set.status = 400;
      return { success: false, message: `Cannot toggle role '${currentRole}'` };
    }

    await pool.query('UPDATE users SET role = $1 WHERE id_user = $2', [newRole, id_user]);

    return {
      success: true,
      message: `Role changed from '${currentRole}' to '${newRole}'`,
      newRole
    };
  });