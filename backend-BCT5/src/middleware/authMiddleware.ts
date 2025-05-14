import { Elysia } from 'elysia';
import { jwtVerify } from 'jose'; // ✅ อย่าลืม import jose ด้วย
import { isJWTPayload, JWTPayload } from '../utils/jwt';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback');

export const authMiddleware = new Elysia().derive(async ({ request, set }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    set.status = 401;
    throw new Error('Unauthorized');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!isJWTPayload(payload)) {
      set.status = 403;
      throw new Error('Invalid token structure');
    }

    return {
      user: payload as JWTPayload
    };

  } catch (err) {
    set.status = 401;
    throw new Error('Invalid token');
  }
});