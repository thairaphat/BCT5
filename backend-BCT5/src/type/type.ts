import type { Context } from 'elysia';
import type { JWTPayload } from '../utils/jwt';
export type User = {
  id: number;
  name?: string;
  student_id?: string;
  email?: string;
  role: 'staff' | 'admin' | 'student';
};