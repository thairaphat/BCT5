import pool from '../../connect/db';

interface RoleToggleRequest {
  id_user: number;
}

// ฟังก์ชันสำหรับ ban ผู้ใช้
export const banUser = async (id_user: number) => {
  if (!id_user) {
    return { success: false, message: 'Missing user ID', status: 400 };
  }

  await pool.query('UPDATE users SET status = $1 WHERE id_user = $2', ['banned', id_user]);

  return { success: true, message: 'User has been banned' };
};

// ฟังก์ชันสำหรับ unban ผู้ใช้
export const unbanUser = async (id_user: number) => {
  if (!id_user) {
    return { success: false, message: 'Missing user ID', status: 400 };
  }

  await pool.query('UPDATE users SET status = $1 WHERE id_user = $2', ['active', id_user]);

  return { success: true, message: 'User has been unbanned' };
};

// ฟังก์ชันสำหรับ toggle role
export const toggleUserRole = async (id_user: number) => {
  if (!id_user) {
    return { success: false, message: 'Missing user ID', status: 400 };
  }

  const result = await pool.query('SELECT role FROM users WHERE id_user = $1', [id_user]);

  if (result.rowCount === 0) {
    return { success: false, message: 'User not found', status: 404 };
  }

  const currentRole = result.rows[0].role;
  let newRole = '';
  if (currentRole === 'student') {
    newRole = 'staff';
  } else if (currentRole === 'staff') {
    newRole = 'student';
  } else {
    return { success: false, message: `Cannot toggle role '${currentRole}'`, status: 400 };
  }

  await pool.query('UPDATE users SET role = $1 WHERE id_user = $2', [newRole, id_user]);

  return {
    success: true,
    message: `Role changed from '${currentRole}' to '${newRole}'`,
    newRole
  };
};