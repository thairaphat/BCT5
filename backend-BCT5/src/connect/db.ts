import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

// โหลด environment variables
dotenv.config();

// สร้าง Pool สำหรับการเชื่อมต่อ
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// ฟังก์ชันพื้นฐานสำหรับรันคิวรี่
export const query = async <T = any>(
  text: string, 
  params: any[] = []
): Promise<QueryResult<T>> => {
  try {
    return await pool.query<T>(text, params);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// ตรวจสอบการเชื่อมต่อฐานข้อมูล (มีประโยชน์สำหรับการตรวจสอบเมื่อเริ่มแอปพลิเคชัน)
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('Database connection successful:');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

export default pool;