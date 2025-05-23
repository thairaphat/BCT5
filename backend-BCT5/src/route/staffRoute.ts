import { Elysia, t } from 'elysia';
import { createActivity } from '../controller/staff/createActivities';
import { editActivity } from '../controller/staff/editActivities';
import { closeActivity } from '../controller/staff/closeActivities';
import { cancelActivity } from '../controller/staff/cancelActivities';
import { getAllActivities, getActivityById } from '../controller/staff/getActivities';
import { deleteActivity } from "../controller/staff/deleteActivities";
import { User } from '../type/type';
import {staffAuthMiddleware} from '../middleware/staffAuthMiddleware'
type Context = {
  user: User;
};

export const staffRoute = new Elysia()
 .use(staffAuthMiddleware)

  // ดึงข้อมูลกิจกรรมทั้งหมด  
  .get('/activities', async ({ query }) => {
    const status = query.status ? query.status.split(',') : ['pending','approved','rejected','open', 'closed', 'cancelled'];
    return await getAllActivities(status);
  })

  // ดึงข้อมูลกิจกรรมตาม ID
  .get('/activities/:id', async ({ params }) => {
    const activity_id = parseInt(params.id);
    return await getActivityById(activity_id);
  }, {
    params: t.Object({
      id: t.String()
    })
  })

  // สร้างกิจกรรมใหม่
  .post('/activities', async ({ body, user }) => {
    console.log(body)
    if (!user || user.role !== 'staff') {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการสร้างกิจกรรม'
      };
    }

    const {
      name,
      description,
      location,
      start_date,
      end_date,
      activity_type,
      reg_deadline,
      max_participants,
      volunteer_hours,
      volunteer_points
    } = body;

    return await createActivity(
      name,
      description,
      location,
      start_date,
      end_date,
      activity_type,
      reg_deadline,
      max_participants,
      volunteer_hours,
      volunteer_points,
      user.id
    );
  }, {
    body: t.Object({
      name: t.String(),
      description: t.String(),
      location: t.String(),
      start_date: t.String(),
      end_date: t.String(),
      activity_type: t.Number(),
      reg_deadline: t.String(),
      max_participants: t.Number(),
      volunteer_hours: t.Number(),
      volunteer_points: t.Number()
    })
  })

  // แก้ไขกิจกรรม
  .put('/activities/:id', async ({ params, body, user }) => {
    if (!user || user.role !== 'staff') {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการแก้ไขกิจกรรม'
      };
    }

    const activity_id = parseInt(params.id);
    const {
      name,
      description,
      location,
      start_date,
      end_date,
      activity_type,
      reg_deadline,
      max_participants,
      volunteer_hours,
      volunteer_points
    } = body;

    return await editActivity(
      activity_id,
      name,
      description,
      location,
      start_date,
      end_date,
      activity_type,
      reg_deadline,
      max_participants,
      volunteer_hours,
      volunteer_points,
      user.id
    );
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      name: t.String(),
      description: t.String(),
      location: t.String(),
      start_date: t.String(),
      end_date: t.String(),
      activity_type: t.Number(),
      reg_deadline: t.String(),
      max_participants: t.Number(),
      volunteer_hours: t.Number(),
      volunteer_points: t.Number()
    })
  })

  // ปิดกิจกรรม
  .patch('/activities/:id/close', async ({ params, body, user }) => {
  if (!user || user.role !== 'staff') {
    return {
      success: false,
      message: 'ไม่มีสิทธิ์ในการปิดกิจกรรม'
    };
  }

  const activity_id = parseInt(params.id);
  const { staff_note } = body as { staff_note?: string };
  
  return await closeActivity(activity_id, user.id, staff_note || '');
    }, {
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        staff_note: t.Optional(t.String())
      })
  })
  // ยกเลิกกิจกรรม
 .patch('/activities/:id/cancel', async ({ params, body, user }) => {
    if (!user || user.role !== 'staff') {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการยกเลิกกิจกรรม'
      }
    }

    const activity_id = parseInt(params.id);
    const { reason } = body;

    if (!reason || reason.trim() === '') {
      return {
        success: false,
        message: 'กรุณาระบุเหตุผลในการยกเลิกกิจกรรม'
      };
    }

    return await cancelActivity(activity_id, user.id, reason);
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      reason: t.String()
    })
  })
  
  .delete('/activities/:id', async ({ params, user }) => {
    if (!user || user.role !== 'staff') {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการลบกิจกรรม'
      };
    }

    const activity_id = parseInt(params.id);
    return await deleteActivity(activity_id, user.id);
    }, {
      params: t.Object({
      id: t.String()
    })
  });
