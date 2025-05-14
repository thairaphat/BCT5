import { Elysia } from "elysia";
import { testConnection } from "./connect/db";
import { loginRoute } from "./route/LoginRoute";
import { registerRoute } from "./route/register";
import { authMiddleware } from './middleware/authMiddleware';
async function startApp() {
  try {
    
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("Failed to connect to database. Please check your configuration.");
      process.exit(1);
    }
    
   
    const app = new Elysia()
      .get("/", () => "Hello Elysia")
      .use(loginRoute)
      .use(registerRoute)
      .use(authMiddleware)
      .listen(3000);
      
    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
    );
    
  } catch (error) {
    console.error("Error starting application:", error);
    process.exit(1);
  }
}

startApp();
