import { Elysia, t } from 'elysia';
import pool from '../connect/db';
import { authMiddleware } from '../middleware/authMiddleware';
import type { CustomContext } from '../type/context';
import { getStudentDashboard, getStudentActivityHistory, getStudentActivityDetail } from '../controller/student/activityHistoryController';
import { filterActivitiesByType, getMyRegisteredActivities } from '../controller/student/studentController'
export const studentRoute = new Elysia()

  .use(authMiddleware) // แนบ middleware ตรวจ JWT

  .get('/student/profile', async ({ user }: CustomContext) => {
    if (user.role !== 'student') {
      return { success: false, message: 'Access denied' };
    }

   const result = await pool.query(
      `SELECT 
        u.id_user, u.student_id, u.role, u.status,
        d.id_user_details, d.first_name, d.last_name, d.email,
        d.volunteer_hours, d.volunteer_points, d.faculty_id, d.department_id,
        f.faculty_name, dp.department_name
      FROM users u
      JOIN user_details d ON u.id_user_details = d.id_user_details
      LEFT JOIN faculty f ON d.faculty_id = f.faculty_id
      LEFT JOIN department dp ON d.department_id = dp.department_id
      WHERE u.id_user = $1`,
      [user.id]
    );

    if (result.rowCount === 0) {
      return { success: false, message: 'Profile not found' };
    }

    return {
      success: true,
      profile: result.rows[0]
    };
  })
  
  // เพิ่ม route สำหรับ dashboard ของนักศึกษา
  .get('/student/dashboard', async ({ user }: CustomContext) => {
    if (user.role !== 'student') {
      return { success: false, message: 'Access denied' };
    }
    
    return await getStudentDashboard(parseInt(user.id));
  })
  .get('/student/activities/filter/:type', async ({ params, user, set }: CustomContext) => {
    if (user.role !== 'student') {
      set.status = 403;
      return { success: false, message: 'Access denied' };
    }

    return await filterActivitiesByType({ params, user, set });
  }, {
    params: t.Object({
      type: t.String()
    })
  })
  
  // เพิ่ม route สำหรับประวัติกิจกรรมของนักศึกษา
  .get('/student/activity-history', async ({ user }: CustomContext) => {
    if (user.role !== 'student') {
      return { success: false, message: 'Access denied' };
    }
    
    return await getStudentActivityHistory(parseInt(user.id));
  })

.get('/student/registered-activities', async (ctx: CustomContext) => {
  if (ctx.user.role !== 'student') {
    ctx.set.status = 403;
    return { success: false, message: 'Access denied' };
  }

  return await getMyRegisteredActivities(ctx);
})
  // เพิ่ม route สำหรับดูรายละเอียดกิจกรรมที่ลงทะเบียน
  .get('/student/activity/:id', async ({ params, user }: CustomContext) => {
    if (user.role !== 'student') {
      return { success: false, message: 'Access denied' };
    }
    
    const activity_id = parseInt(params.id);
    return await getStudentActivityDetail(parseInt(user.id), activity_id);
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  
  // ดึงกิจกรรมที่กำลังเปิดรับสมัคร
  .get('/student/available-activities', async ({ user }: CustomContext) => {
    if (user.role !== 'student') {
      return { success: false, message: 'Access denied' };
    }
    
    try {
      // ดึงกิจกรรมที่เปิดรับสมัคร และนักศึกษายังไม่ได้ลงทะเบียน
      const result = await pool.query(
        `SELECT a.id, a.name, a.activity_type, a.reg_deadline, a.status, a.max_participants,
                a.created_at, a.created_by,
                ad.description, ad.location, ad.start_date, ad.end_date,
                ad.volunteer_hours, ad.volunteer_points,
                (SELECT COUNT(*) FROM registrations WHERE activity_id = a.id) as registered_count
         FROM activities a
         JOIN activity_details ad ON a.id = ad.id_activity_details
         WHERE a.status = 'open'
           AND a.reg_deadline >= CURRENT_DATE
           AND a.id NOT IN (
             SELECT activity_id FROM registrations WHERE user_id = $1
           )
         ORDER BY a.reg_deadline ASC`,
        [user.id]
      );
      
      return {
        success: true,
        activities: result.rows
      };
    } catch (error) {
      console.error('Error fetching available activities:', error);
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมที่เปิดรับสมัคร',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  })
  
  // ดึงสถิติจิตอาสา (ชั่วโมงและคะแนน) ของนักศึกษา
  .get('/student/volunteer-stats', async ({ user }: CustomContext) => {
    if (user.role !== 'student') {
      return { success: false, message: 'Access denied' };
    }
    
    try {
      // ดึงข้อมูลสถิติจิตอาสาจาก user_details
      const userDetailsResult = await pool.query(
        `SELECT volunteer_hours, volunteer_points
         FROM user_details ud
         JOIN users u ON u.id_user_details = ud.id_user_details
         WHERE u.id_user = $1`,
        [user.id]
      );
      
      // ดึงข้อมูลจาก registrations
      const registrationsResult = await pool.query(
        `SELECT 
           SUM(CASE WHEN r.status = 'attended' THEN r.hours_earned ELSE 0 END) as total_hours_earned,
           SUM(CASE WHEN r.status = 'attended' THEN r.points_earned ELSE 0 END) as total_points_earned,
           COUNT(CASE WHEN r.status = 'attended' THEN 1 END) as completed_activities
         FROM registrations r
         WHERE r.user_id = $1`,
        [user.id]
      );
      
      
      // ดึงข้อมูลประเภทกิจกรรมและชั่วโมง/คะแนนตามประเภท
      const activityTypeStats = await pool.query(
        `SELECT a.activity_type,
           COUNT(r.registration_id) as activity_count,
           SUM(r.hours_earned) as hours,
           SUM(r.points_earned) as points
         FROM registrations r
         JOIN activities a ON r.activity_id = a.id
         WHERE r.user_id = $1 AND r.status = 'attended'
         GROUP BY a.activity_type
         ORDER BY activity_count DESC`,
        [user.id]
      );
      
      
      return {
        success: true,
        userStats: userDetailsResult.rows[0] || { volunteer_hours: 0, volunteer_points: 0 },
        activityStats: registrationsResult.rows[0] || { 
          total_hours_earned: 0, 
          total_points_earned: 0, 
          completed_activities: 0 
        },
        activityTypeBreakdown: activityTypeStats.rows
      };
    } catch (error) {
      console.error('Error fetching volunteer stats:', error);
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติจิตอาสา',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  });

  