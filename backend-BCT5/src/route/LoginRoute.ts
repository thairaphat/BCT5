import { Elysia } from 'elysia';
import { loginUser } from '../controller/LoginController';

export const loginRoute = new Elysia()
.post('/login', async ({ body }) => {
    const { student_id, password } = body as { student_id: string, password: string };
    return await loginUser(student_id, password);
  });