import type { Context } from 'elysia';

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'staff' | 'admin' | 'student';
};