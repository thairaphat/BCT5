import { SignJWT } from 'jose';
import  pool  from '../connect/db';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback');
export const loginUser = async (student_id: string, password: string) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE student_id = $1 LIMIT 1',
    [student_id]
  );

  const user = result.rows[0];

  if (!user) {
    return { success: false, message: 'User not found' };
  }

  if (user.password !== password) {
    return { success: false, message: 'Incorrect password' };
  }
  


  

  const allowedRoles = ['student', 'admin', 'staff'];

if (!allowedRoles.includes(user.role)) {
  return {
    success: false,
    message: 'This role is not allowed to login.',
  };
}
let redirectPath = '/';
  switch (user.role) {
    case 'admin':
      redirectPath = '/admin/dashboard';
      break;
    case 'student':
      redirectPath = '/student/home';
      break;
    case 'staff':
      redirectPath = '/staff/home';
      break;
    default:
      redirectPath = '/';
  }


const token = await new SignJWT({
    id: user.id_user,
    role: user.role,
    student_id: user.student_id
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret);

  return {
    success: true,
    message: 'Login successful',
    role: user.role,
    redirect: redirectPath,
    token, 
    user: {
      id: user.id_user,
      student_id: user.student_id,
      role: user.role,
      status: user.status,
    }
  };
};