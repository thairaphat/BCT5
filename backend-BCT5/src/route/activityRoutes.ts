import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/authMiddleware';

// import controller
import { joinActivity, getStudentActivities } from '../controller/student/joinActivityController';
import { 
  getActivityParticipants, 
  approveParticipant, 
  rejectParticipant,
  recordAttendance,
  getRejectionHistory
} from '../controller/staff/manageParticipantsController';

// import controller ใหม่สำหรับประวัติกิจกรรม
import {
  getStudentActivityHistory,
  getStudentActivityDetail,
  getStudentDashboard,
} from '../controller/student/activityHistoryController';

// Student routes
const studentRoutes = new Elysia()
  .use(authMiddleware)
  .post('/join-activity/:activityId', async ({ params, user, set }) => {
    if (!user || !['student', 'staff'].includes(user.role)) {
      set.status = 403;
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }

    const activity_id = parseInt(params.activityId);
    return await joinActivity(parseInt(user.id), activity_id);
  }, {
    params: t.Object({
      activityId: t.String()
    })
  })
  .get('/my-activities', async ({ user }) => {
    if (!user) {
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }
    
    return await getStudentActivities(parseInt(user.id));
  })
  // เพิ่มเส้นทางใหม่เพื่อแสดงประวัติกิจกรรมอย่างละเอียด
  .get('/activity-history', async ({ user }) => {
    if (!user) {
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }
    
    return await getStudentActivityHistory(parseInt(user.id));
  })
  // เพิ่มเส้นทางสำหรับดูรายละเอียดกิจกรรมที่นักศึกษาลงทะเบียน
  .get('/activity-detail/:activityId', async ({ params, user }) => {
    if (!user) {
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }
    
    const activity_id = parseInt(params.activityId);
    return await getStudentActivityDetail(parseInt(user.id), activity_id);
  }, {
    params: t.Object({
      activityId: t.String()
    })
  })
  // เพิ่มเส้นทางสำหรับแดชบอร์ดนักศึกษา
  .get('/dashboard', async ({ user }) => {
    if (!user) {
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }
    
    return await getStudentDashboard(parseInt(user.id));
  });
  

// Staff routes
const staffRoutes = new Elysia()
  .use(authMiddleware)
  .get('/rejection-history/:registrationId', async ({ params, user, set }) => {
    if (!user || user.role !== 'staff') {
      set.status = 403;
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }

    const registration_id = parseInt(params.registrationId);
    return await getRejectionHistory(registration_id);
  }, {
    params: t.Object({
      registrationId: t.String()
    })
  })
  .get('/activity-participants/:activityId', async ({ params, user, set }) => {
    if (!user || user.role !== 'staff') {
      set.status = 403;
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }

    const activity_id = parseInt(params.activityId);
    return await getActivityParticipants(activity_id);
  }, {
    params: t.Object({
      activityId: t.String()
    })
  })
  .post('/approve-participant/:registrationId', async ({ params, user, set }) => {
    if (!user || user.role !== 'staff') {
      set.status = 403;
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }

    const registration_id = parseInt(params.registrationId);
    return await approveParticipant(registration_id, parseInt(user.id));
  }, {
    params: t.Object({
      registrationId: t.String()
    })
  })
  .post('/reject-participant/:registrationId', async ({ params, body, user, set }) => {
    if (!user || user.role !== 'staff') {
      set.status = 403;
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }

    const registration_id = parseInt(params.registrationId);
    const { reason } = body as { reason: string };
    
    if (!reason || reason.trim() === '') {
      return {
        success: false,
        message: 'กรุณาระบุเหตุผลในการปฏิเสธ'
      };
    }
    
    return await rejectParticipant(registration_id, parseInt(user.id), reason);
  }, {
    params: t.Object({
      registrationId: t.String()
    }),
    body: t.Object({
      reason: t.String()
    })
  })
  .post('/record-attendance/:registrationId', async ({ params, body, user, set }) => {
    if (!user || user.role !== 'staff') {
      set.status = 403;
      return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
    }

    const registration_id = parseInt(params.registrationId);
    const { hours_earned, points_earned, feedback } = body as { 
      hours_earned: number, 
      points_earned: number, 
      feedback?: string 
    };
    
    return await recordAttendance(registration_id, hours_earned, points_earned, feedback || '');
  }, {
    params: t.Object({
      registrationId: t.String()
    }),
    body: t.Object({
      hours_earned: t.Number(),
      points_earned: t.Number(),
      feedback: t.Optional(t.String())
    })
  });

// Export combined routes
export const routes = new Elysia()
  .group('/student', app => app.use(studentRoutes))
  .group('/staff', app => app.use(staffRoutes));