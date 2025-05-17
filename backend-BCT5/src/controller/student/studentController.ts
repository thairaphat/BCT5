import pool from '../../connect/db'
import type { CustomContext } from '../../type/context'

// ดูโปรไฟล์นิสิต
export async function getStudentProfile({ user, set }: CustomContext) {
  if (user.role !== 'student') {
    set.status = 403
    return { success: false, message: 'Access denied' }
  }

  const result = await pool.query(
    `SELECT 
      u.id_user, u.student_id, u.role, sc.status_name,
      d.id_user_details, d.first_name, d.last_name, d.email,
      d.volunteer_hours, d.volunteer_points, d.faculty_id, d.department_id
    FROM users u
    JOIN user_details d ON u.id_user_details = d.id_user_details
    JOIN status_check sc ON u.status_check_id = sc.id
    WHERE u.id_user = $1`,
    [user.id]
  )

  if (result.rowCount === 0) {
    set.status = 404
    return { success: false, message: 'Profile not found' }
  }

  return { success: true, profile: result.rows[0] }
}

// สมัครเข้าร่วมกิจกรรม
export async function joinActivity({ params, user, set }: CustomContext) {
  if (!user || user.role !== 'student') {
    set.status = 403
    return { error: 'Unauthorized' }
  }

  const { activityId } = params

  const activity = await pool.query(
    'SELECT max_participants, (SELECT COUNT(*) FROM registrations WHERE activity_id = $1) as current FROM activities WHERE id = $2',
    [activityId, activityId]
  )

  if (activity.rows[0].current >= activity.rows[0].max_participants) {
    set.status = 400
    return { error: 'Activity is full' }
  }

  const currentDate = new Date().toISOString()
  await pool.query(
    'INSERT INTO registrations (user_id, activity_id, registration_date, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
    [user.id, activityId, currentDate, 'pending', currentDate, currentDate]
  )
  return { success: true, message: 'สมัครเข้าร่วมกิจกรรมสำเร็จ', activityId }
}

// กรองกิจกรรมตามประเภท
export async function filterActivitiesByType({ params, user, set }: { params: Record<string, string>, user: any, set: any }) {
  if (!user || user.role !== 'student') {
    set.status = 403;
    return { error: 'Unauthorized' };
  }

  const { type } = params;

  const result = await pool.query(
    `SELECT 
       a.id, a.name, a.activity_type, 
       ad.description, ad.location, ad.start_date, ad.end_date, 
       a.reg_deadline, s.status_name as status, a.max_participants, 
       ad.volunteer_hours, ad.volunteer_points, a.created_by
     FROM activities a
     JOIN activity_details ad ON a.id_activity_details = ad.id_activity_details
     JOIN status_check s ON a.status_check_id = s.id
     WHERE a.activity_type = $1`,
    [type]
  );

  if (result.rowCount === 0) {
    set.status = 404;
    return { error: 'No activities found for this type' };
  }

  return { success: true, activities: result.rows };
}

export async function getMyRegisteredActivities({ user, set }: CustomContext) {
  if (!user || user.role !== 'student') {
    set.status = 403;
    return { error: 'Unauthorized' };
  }

  const result = await pool.query(
    `SELECT 
       a.id, a.name, a.activity_type, a.reg_deadline, s.status_name as status, a.max_participants, a.created_by,
       ad.description, ad.location, ad.start_date, ad.end_date,
       ad.volunteer_hours, ad.volunteer_points,
       r.status as registration_status, r.registration_date
     FROM registrations r
     JOIN activities a ON r.activity_id = a.id
     JOIN activity_details ad ON a.id_activity_details = ad.id_activity_details
     JOIN status_check s ON a.status_check_id = s.id
     WHERE r.user_id = $1`,
    [user.id]
  );

  if (result.rowCount === 0) {
    return { success: true, activities: [], message: 'You have no registered activities' };
  }

  return { success: true, activities: result.rows };
}