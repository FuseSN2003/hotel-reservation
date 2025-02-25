import { sql } from '@/libs/db';
import Elysia, { t } from 'elysia';
import { SearchReservationSchema } from '@/libs/validation';

export const reservationRoute = new Elysia({ prefix: '/reservations' }).get(
    '/',
    async ({ query, set }) => {
        query: t.Object({
            year: t.String(),
            month: t.String(),
            fullname: t.String(),
        });
        const validateData = SearchReservationSchema.safeParse(query);

        if (!validateData.success) {
            set.status = 400;
            return {
                status: 'error',
                message: validateData.error.errors[0].message,
            };
        }

        const { year, month, fullname } = validateData.data;

        if (!fullname) {
            const reservations = await sql`SELECT
                    reservations.id AS reservations_id,
                    customer_id,
                    customer_details.first_name,
                    customer_details.last_name,
                    customer_details.address,
                    customer_details.email,
                    customer_details.phone_number,
                    customer_details.sub_district,
                    customer_details.district,
                    customer_details.province,
                    customer_details.postcode,
                    rooms."number" AS room_number,
                    reservations.price,
                    reservations.room_id,
                    customer_details.special_request  AS special_request,
                    check_in,
                    check_out,
                    display_color,
                    transaction_status,
                    created_at,
                    current_status,
                    room_types.name AS types_name,
                    room_types.capacity,
                    room_types.detail,
                    room_types.picture_path,
                    room_types.price AS price_per_night ,
                    room_types.id AS type_id
                    FROM
                    rooms
                    INNER JOIN reservations ON rooms.id = reservations.room_id
                    INNER JOIN room_types ON rooms.type_id = room_types.id
                    INNER JOIN customer_details ON reservations.customer_id = customer_details.ID 
                    WHERE (check_in <= ${
                        query.year + '-' + query.month + '-31'
                    } AND check_out >= ${
                query.year + '-' + query.month + '-01'
            }) AND reservations.transaction_status = 'complete'
                    ORDER BY rooms."number" ASC 
                    `;

            return {
                status: 'success',
                data: reservations,
            };
        } else {
            const reservations = await sql`SELECT
            reservations.id AS reservations_id,
            customer_id,
            customer_details.first_name,
            customer_details.last_name,
            customer_details.address,
            customer_details.email,
            customer_details.phone_number,
            customer_details.sub_district,
            customer_details.district,
            customer_details.province,
            customer_details.postcode,
            rooms."number" AS room_number,
            reservations.price,
            reservations.room_id,
            customer_details.special_request  AS special_request,
            check_in,
            check_out,
            display_color,
            transaction_status,
            created_at,
            current_status,
            room_types."name" AS types_name,
            room_types.capacity,
            room_types.detail,
            room_types.picture_path,
            room_types.price AS price_per_night ,
                 room_types.id AS type_id
            FROM
            rooms
            INNER JOIN reservations ON rooms."id" = reservations.room_id
            INNER JOIN room_types ON rooms.type_id = room_types."id"
            INNER JOIN customer_details ON reservations.customer_id = customer_details.ID 
            WHERE (check_in <= ${
                query.year + '-' + query.month + '-31'
            } AND check_out >= ${
                query.year + '-' + query.month + '-01'
            }) AND reservations.transaction_status = 'complete'  AND SIMILARITY(customer_details.first_name || ' ' || customer_details.last_name, ${fullname}) > 0.2
            ORDER BY rooms."number" ASC 
            `;

            return {
                status: 'success',
                data: reservations,
            };
        }
    }
);
