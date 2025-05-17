// src/route/register.ts
import { Elysia, t } from 'elysia';
import { registerUser, getFaculties, getDepartmentsByFaculty } from '../controller/registerController';

export const registerRoute = new Elysia()
  // สำหรับลงทะเบียนผู้ใช้ใหม่
  .post('/register', async ({ body }) => {
    const { 
      student_id, 
      password, 
      first_name, 
      last_name, 
      email, 
      faculty_id, 
      department_id 
    } = body as { 
      student_id: string, 
      password: string, 
      first_name: string, 
      last_name: string, 
      email: string, 
      faculty_id: number, 
      department_id: number 
    };
    
    return await registerUser(
      student_id, 
      password, 
      first_name, 
      last_name, 
      email,
      faculty_id, 
      department_id
    );
  }, {
    body: t.Object({
      student_id: t.String(),
      password: t.String(),
      first_name: t.String(),
      last_name: t.String(),
      email: t.String(),
      faculty_id: t.Number(),
      department_id: t.Number()
    })
  })
  
  // สำหรับดึงข้อมูลคณะทั้งหมด
  .get('/faculties', async () => {
    return await getFaculties();
  })
  
  // สำหรับดึงข้อมูลภาควิชาตามคณะ
  .get('/departments/:faculty_id', async ({ params }) => {
    const faculty_id = parseInt(params.faculty_id);
    return await getDepartmentsByFaculty(faculty_id);
  }, {
    params: t.Object({
      faculty_id: t.String()
    })
  });