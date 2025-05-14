import pool from '../connect/db';

export const registerUser = async (
  student_id: string,
  password: string,
  firstname: string,
  lastname: string,
  email: string,
  faculty_id: number,
  department_id: number
) => {
  try {
    // ตรวจสอบว่า student_id มีอยู่แล้วหรือไม่
    const checkUserResult = await pool.query(
      'SELECT * FROM users WHERE student_id = $1 LIMIT 1',
      [student_id]
    );

    if (checkUserResult.rows.length > 0) {
      return { success: false, message: 'รหัสนักศึกษานี้มีในระบบแล้ว' };
    }

    // ตรวจสอบว่า email มีอยู่แล้วหรือไม่
    const checkEmailResult = await pool.query(
      'SELECT * FROM user_details WHERE email = $1 LIMIT 1',
      [email]
    );

    if (checkEmailResult.rows.length > 0) {
      return { success: false, message: 'อีเมลนี้มีในระบบแล้ว' };
    }

    // ตรวจสอบว่า faculty_id และ department_id มีอยู่จริงหรือไม่
    const checkFacultyResult = await pool.query(
      'SELECT * FROM faculty WHERE faculty_id = $1 AND status = $2',
      [faculty_id, 'active']
    );

    if (checkFacultyResult.rows.length === 0) {
      return { success: false, message: 'ไม่พบคณะที่เลือก' };
    }

    const checkDepartmentResult = await pool.query(
      'SELECT * FROM department WHERE department_id = $1 AND faculty_id = $2 AND status = $3',
      [department_id, faculty_id, 'active']
    );

    if (checkDepartmentResult.rows.length === 0) {
      return { success: false, message: 'ไม่พบภาควิชาที่เลือก หรือภาควิชาไม่ได้อยู่ในคณะที่เลือก' };
    }

    // เริ่ม transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. สร้าง user_details ก่อน
      const detailsResult = await client.query(
        `INSERT INTO user_details (first_name, last_name, email, faculty_id, department_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_user_details, first_name, last_name, email, faculty_id, department_id`,
        [firstname, lastname, email, faculty_id, department_id]
      );

      const userDetailsId = detailsResult.rows[0].id_user_details;

      // 2. จากนั้นสร้าง users และเชื่อมโยงกับ user_details
      const userResult = await client.query(
        `INSERT INTO users (student_id, password, role, status, id_user_details, created_at)
         VALUES ($1, $2, 'student', 'active', $3, CURRENT_TIMESTAMP)
         RETURNING id_user, student_id, role, status`,
        [student_id, password, userDetailsId]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'ลงทะเบียนสำเร็จ',
        redirectTo: '/login',
        user: {
          id: userResult.rows[0].id_user,
          student_id,
          firstname,
          lastname,
          email,
          role: 'student',
          status: 'active',
          faculty: checkFacultyResult.rows[0].faculty_name,
          department: checkDepartmentResult.rows[0].department_name
        }
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return { 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลคณะ
export const getFaculties = async () => {
  try {
    const result = await pool.query('SELECT faculty_id, faculty_code, faculty_name FROM faculty WHERE status = $1 ORDER BY faculty_name', ['active']);
    return {
      success: true,
      faculties: result.rows
    };
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคณะ',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลภาควิชาตามคณะ
export const getDepartmentsByFaculty = async (faculty_id: number) => {
  try {
    const result = await pool.query(
      'SELECT department_id, department_code, department_name FROM department WHERE faculty_id = $1 AND status = $2 ORDER BY department_name',
      [faculty_id, 'active']
    );
    return {
      success: true,
      departments: result.rows
    };
  } catch (error) {
    console.error('Error fetching departments:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลภาควิชา',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};