import { Elysia } from "elysia";
import { testConnection } from "./connect/db";
import cors from "@elysiajs/cors";
import { loginRoute } from "./route/LoginRoute";
import { registerRoute } from "./route/register";
import { authMiddleware } from './middleware/authMiddleware';
import type { CustomContext } from './type/context';
import { adminRoute } from './route/adminRoute';
import { studentRoute } from './route/studentRoute';
import { staffRoute } from './route/staffRoute';
import { notificationRoutes } from './route/notificationRoutes';
import { routes as activityRoutes } from './route/activityRoutes';

async function startApp() {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error(" Failed to connect to database. Please check your configuration.");
      process.exit(1);
    }

  const app = new Elysia()
  // .use(cors({
  //       origin: "http://localhost:5173",  // กำหนด frontend origin ที่อนุญาต
  //       methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //       credentials: true // ถ้าใช้ cookie หรือ auth
  // }))
  // .use(adminRoute)
  // .use(loginRoute)
  // .use(registerRoute)
  // .use(studentRoute) 
  // .use(activityRoutes)
    .use(cors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true                
      }))
  .group('/api', app => {
    return app
      .use(adminRoute)
      .use(loginRoute)
      .use(registerRoute)
      .use(staffRoute) 
      .use(studentRoute) 
      .use(activityRoutes)
      .use(notificationRoutes)
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