import { Elysia } from "elysia";
import { testConnection } from "./connect/db";
import { loginRoute } from "./route/LoginRoute";
import { registerRoute } from "./route/register";
import { authMiddleware } from './middleware/authMiddleware';
import type { CustomContext } from './type/context';
import { adminController } from './controller/admin/adminController';
import { studentRoute } from './route/studentRoute';
async function startApp() {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error(" Failed to connect to database. Please check your configuration.");
      process.exit(1);
    }

    const app = new Elysia()
     .use(adminController)
  .use(loginRoute)
  .use(registerRoute)
   .use(studentRoute) 
  .group('/api', app => {
    return app
      .use(authMiddleware)
      .get('/profile', ({ user }: CustomContext) => {
        return `hello, user ${user.id}`;
      });
  });

app.listen(3000);

    console.log(`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
  } catch (error) {
    console.error(" Error starting application:", error);
    process.exit(1);
  }
}

startApp();