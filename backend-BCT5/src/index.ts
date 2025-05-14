import { Elysia } from "elysia";
import { testConnection } from "./connect/db";
import { loginRoute } from "./route/LoginRoute";
import { registerRoute } from "./route/register";
// เชื่อมต่อและตรวจสอบฐานข้อมูลเมื่อเริ่มต้นแอปพลิเคชัน
async function startApp() {
  try {
    // ทดสอบการเชื่อมต่อฐานข้อมูล
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("Failed to connect to database. Please check your configuration.");
      process.exit(1);
    }
    
    // เริ่มเซิร์ฟเวอร์ Elysia
    const app = new Elysia()
      .get("/", () => "Hello Elysia")
      .use(loginRoute)
      .use(registerRoute)
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
