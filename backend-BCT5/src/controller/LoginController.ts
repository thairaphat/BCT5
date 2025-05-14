import  pool  from '../connect/db';

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
  
  let redirectPath = '/';
  if (user.role === 'admin') {
    redirectPath = '/admin/dashboard';
  } else if (user.role === 'student') {
    redirectPath = '/student/home';
  }


  return {
    success: true,
    message: 'Login successful',
    role: user.rloe,
    user: {
      id: user.id_user,
      student_id: user.student_id,
      role: user.role,
      status: user.status,
    }
  };
};