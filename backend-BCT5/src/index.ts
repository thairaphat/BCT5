import { Elysia } from 'elysia';
import { loginRoute } from './route/LoginRoute';

const app = new Elysia()
  .use(loginRoute)
  .listen(3000);

console.log('🚀 Server running at http://localhost:3000');
