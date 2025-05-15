import { JWTPayload, jwtVerify } from "jose";
import { isJWTPayload } from "../utils/jwt";
import Elysia from "elysia";
import 'dotenv/config';
import { jwtSecret } from '../utils/secret';

export const authMiddleware = (app: Elysia) =>
    app.derive(async ({ request, set }) => {
        console.log(' authMiddleware called');
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            set.status = 401;
            throw new Error('Unauthorized');
        }

        const token = authHeader.split(' ')[1];
        console.log(' verify-token:', token);
        console.log(' verify-secret:', Buffer.from(jwtSecret).toString('base64'));
        const { payload } = await jwtVerify(token, jwtSecret);
        console.log(' payload:', payload);

        if (!isJWTPayload(payload)) {
            set.status = 403;
            throw new Error('Invalid token structure');
        }

        return {
            user: payload as JWTPayload
        };
    });
