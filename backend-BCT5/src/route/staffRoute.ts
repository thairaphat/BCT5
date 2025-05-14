import { Elysia, t } from 'elysia';
import { createActivity } from '../controller/staff/createActivities';
import { editActivity } from '../controller/staff/editActivities';
import { closeActivity } from '../controller/staff/closeActivities';
import { cancelActivity } from '../controller/staff/cancelActivities';
import { getAllActivities, getActivityById } from '../controller/staff/getActivities';
import type { CustomContext } from '../type/context';
export const staffRoute = new Elysia()
  // ดึงข้อมูลกิจกรรมทั้งหมด
   .get('/activities', async ({ query, set }) => {
    const status = query.status?.split(',') || ['open', 'closed', 'cancelled'];

    const result = await getAllActivities(status);

    if (!result.success) {
      set.status = 500;
      return result;
    }

    return result;
  })
  .get('/activities/:id', async ({ params, set }) => {
    const id = Number(params.id);

    if (isNaN(id)) {
      set.status = 400;
      return { success: false, message: 'Invalid activity ID' };
    }

    const result = await getActivityById(id);
    if (!result.success) {
      set.status = 404;
    }

    return result;
  })

  // สร้างกิจกรรมใหม่
  .post('/activities', async ({ body, user }) => {
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
      activity_type: t.String(),
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
      activity_type: t.String(),
      reg_deadline: t.String(),
      max_participants: t.Number(),
      volunteer_hours: t.Number(),
      volunteer_points: t.Number()
    })
  })

  // ปิดกิจกรรม
  .patch('/activities/:id/close', async ({ params, user }) => {
    if (!user || user.role !== 'staff') {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการปิดกิจกรรม'
      };
    }

    const activity_id = parseInt(params.id);
    return await closeActivity(activity_id, user.id);
  }, {
    params: t.Object({
      id: t.String()
    })
  })

  // ยกเลิกกิจกรรม
  .patch('/activities/:id/cancel', async ({ params, body, user }) => {
    if (!user || user.role !== 'staff') {
      return {
        success: false,
        message: 'ไม่มีสิทธิ์ในการยกเลิกกิจกรรม'
      };
    }

    const activity_id = parseInt(params.id);
    const { reason } = body;

    return await cancelActivity(activity_id, user.id, reason);
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      reason: t.String()
    })
  });