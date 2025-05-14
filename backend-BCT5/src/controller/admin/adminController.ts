import { Elysia } from 'elysia';
import pool from '../../connect/db';

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
  });