import { sql } from '@/libs/db';
import { middleware } from '@/middleware';
import Elysia from 'elysia';

export const dashboardRoutes = new Elysia({ prefix: '/dashboard' })
    .use(middleware)
    .get('/', async ({ user }) => {
        if (!user) {
            return {
                status: 'error',
                message: 'Unauthorized',
            };
        }

        if (user.role !== 'administrator') {
            return {
                status: 'error',
                message: 'Forbidden',
            };
        }

        const year = new Date().getFullYear();

        const [totalBooking] = await sql`SELECT COUNT(*) FROM reservations`;
        const [totalRevenue] = await sql`SELECT SUM(price) FROM reservations`;
        const [totalGuest] =
            await sql`SELECT COUNT(customer_id) FROM reservations`;
        const [availableRoom] =
            await sql`SELECT COUNT(*) FROM rooms WHERE current_status = 'vacant'`;
        const [soldOutRoom] =
            await sql`SELECT COUNT(*) FROM rooms WHERE current_status = 'occupied'`;
        const [offMarketRoom] =
            await sql`SELECT COUNT(*) FROM rooms WHERE current_status = 'off_market'`;
        const revenuePerMonth = await sql`SELECT month, sum
            FROM ( SELECT TO_CHAR("created_at", 'Month') AS month, SUM(price) FROM reservations
            WHERE TO_CHAR(reservations."created_at", 'YYYY')=${year}
            GROUP BY month) monthAndRevenue
            ORDER BY to_date(month, 'Month');`;

        return {
            status: 'success',
            data: {
                totalBooking: totalBooking.count,
                totalRevenue: totalRevenue.sum,
                totalGuest: totalGuest.count,
                availableRoom: availableRoom.count,
                soldOutRoom: soldOutRoom.count,
                offMarketRoom: offMarketRoom.count,
                revenuePerMonth,
            },
        };
    });
