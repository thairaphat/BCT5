import type { Context } from 'elysia';
import type { JWTPayload } from '../utils/jwt';

export type CustomContext = Context & {
  user: JWTPayload;
};