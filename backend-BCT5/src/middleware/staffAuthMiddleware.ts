import { Elysia } from 'elysia';
import { authMiddleware } from './authMiddleware';
import { User } from '../type/type';  // import type User ด้วย

export const staffAuthMiddleware = (app: Elysia) =>
  app.use(authMiddleware).derive(({ user, set }) => {
    if (!user || user.role !== 'staff') {
      set.status = 403;
      throw new Error('Forbidden');
    }
    
    // cast user เป็น User
    const staffUser = user as User;

    return { user: staffUser };
  });