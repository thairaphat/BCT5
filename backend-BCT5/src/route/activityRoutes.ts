import { Elysia } from 'elysia'
import db from '../connect/db' // การเชื่อมต่อฐานข้อมูล
import { authMiddleware } from '../middleware/authMiddleware'

const student = new Elysia()
    .use(authMiddleware) // ใช้ middleware
    .post('/join-activity/:activityId', async ({ params, user, set }) => {
        if (!user || user.role !== 'student') {
            set.status = 403
            return { error: 'Unauthorized' }
        }

        const { activityId } = params

        // ตรวจสอบจำนวนผู้เข้าร่วมปัจจุบันกับ max_participants
        const activity = await db.query(
            'SELECT max_participants, (SELECT COUNT(*) FROM registrations WHERE activity_id = ?) as current FROM activities WHERE id = ?',
            [activityId, activityId]
        )
        if (activity.rows[0].current >= activity.rows[0].max_participants) {
            set.status = 400
            return { error: 'Activity is full' }
        }

        // เพิ่มข้อมูลการสมัครของนิสิตลงใน registrations
        const currentDate = new Date().toISOString() // ใช้เวลาปัจจุบัน (07:12 PM +07, May 15, 2025)
        await db.query(
            'INSERT INTO registrations (user_id, activity_id, registration_date, status, created_at, updated_at) ' +
            'VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (user_id, activity_id) DO NOTHING',
            [user.id, activityId, currentDate, 'pending', currentDate, currentDate]
        )
        return { success: true, message: 'สมัครเข้าร่วมกิจกรรมสำเร็จ', activityId }
    })

const staff = new Elysia()
    .use(authMiddleware) // ใช้ middleware
    .get('/activity-participants/:activityId', async ({ params, user, set }) => {
        if (!user || user.role !== 'staff') {
            set.status = 403
            return { error: 'Unauthorized' }
        }

        const { activityId } = params
        const result = await db.query(
            'SELECT u.user_id, u.first_name, u.last_name, r.status, r.registration_date, r.attended_date, r.points_earned, r.hours_earned ' +
            'FROM user_details u JOIN registrations r ON u.user_id = r.user_id ' +
            'WHERE r.activity_id = ?',
            [activityId]
        )
        return { success: true, participants: result.rows }
    })

export const routes = new Elysia()
    .use(student)
    .use(staff)