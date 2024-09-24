import { sql } from '@/libs/db';
import { GetVacantRoomsSchema } from '@/libs/validation';
import Elysia, { t } from 'elysia';

export const roomRoutes = new Elysia({ prefix: '/rooms' })
    .get(
        '/vacant-rooms',
        async ({ query }) => {
            const roomTypes = await sql`SELECT id FROM room_types`;
            const uniqueRooms = [];

            const { check_in, check_out } = query;
            const diffDate =
                new Date(check_out).getDate() - new Date(check_in).getDate();

            for (const roomType of roomTypes) {
                const res = await sql`
                        SELECT
                        room_types."name",
                        ${diffDate} * room_types.price AS price,
                        room_types.detail,
                        room_types.id AS type_id,
                        room_types.picture_path
                      FROM
                        rooms
                        LEFT JOIN room_types ON rooms.type_id = room_types."id" 
                      WHERE
                        (
                        SELECT
                          reservations."id" 
                        FROM
                          reservations
                        WHERE
                          reservations.room_id = rooms."id" 
                          AND (
                            ( ( ( ${check_out} ) > reservations.check_in ) AND ( ( ${check_in} ) < reservations.check_out ) ) 
                            OR ( ( ( ${check_in} ) < reservations.check_out ) AND ( ( ${check_out} ) > reservations.check_in ) ) 
                            OR ( ( ( ${check_in} ) > reservations.check_in ) AND ( ( ${check_out} ) < reservations.check_out ) ) 
                            OR ( ( ( ${check_out} ) > reservations.check_out ) AND ( ( ${check_in} ) < reservations.check_in ) ) 
                          ) 
                          LIMIT 1 
                        ) IS NULL 
                        AND rooms.type_id = ${roomType.id}
                      ORDER BY
                        rooms."number" ASC
                        LIMIT 1;
                        
                          `;
                uniqueRooms.push(...res);
            }
            return {
                status: 'success',
                data: uniqueRooms,
            };
        },
        {
            query: t.Object({
                check_in: t.Date(),
                check_out: t.Date(),
            }),
        }
    )
    .post('/preserve', async ({ body, set }) => {
        const validation = GetVacantRoomsSchema.safeParse(body);
        if (!validation.success) {
            return {
                status: 'error',
                message: validation.error.message,
            };
        }

        const { check_in, check_out, type_id } =
            validation.data;
        // available "room_id": "2f1a9a38-f851-4f87-abba-d473737c5475",
        // not available "room_id": "0b494479-d63e-47bc-adae-62438b44f02f",

        const diffDate = new Date(check_out).getDate() - new Date(check_in).getDate();

        const [room] = await sql`
                                SELECT
                                  rooms."id" AS room_id,
                                  ${diffDate} * room_types.price AS price
                                FROM
                                  rooms
                                  LEFT JOIN room_types ON rooms.type_id = room_types."id" 
                                WHERE
                                  (
                                  SELECT
                                    reservations."id" 
                                  FROM
                                    reservations
                                  WHERE
                                    reservations.room_id = rooms."id" 
                                    AND (
                                      ( ( ( ${check_out} ) > reservations.check_in ) AND ( ( ${check_in} ) < reservations.check_out ) ) 
                                      OR ( ( ( ${check_in} ) < reservations.check_out ) AND ( ( ${check_out} ) > reservations.check_in ) ) 
                                      OR ( ( ( ${check_in} ) > reservations.check_in ) AND ( ( ${check_out} ) < reservations.check_out ) ) 
                                      OR ( ( ( ${check_out} ) > reservations.check_out ) AND ( ( ${check_in} ) < reservations.check_in ) ) 
                                    ) 
                                    LIMIT 1 
                                  ) IS NULL 
                                  AND rooms.type_id = ${type_id}
                                ORDER BY
                                  rooms."number" ASC
                                  LIMIT 1;`;

        if (!room) {
            return {
                status: 'error',
                message: 'Sorry last room just be purchased second ago.',
            };
        }
        
        const colors = ["#496989", '#58A399', '#A8CD9F', '#E2F4C5' ];

        await sql`
            INSERT INTO reservations (room_id, check_in, check_out, price, display_color)
            VALUES (${room.room_id}, ${check_in}, ${check_out}, ${room.price}, ${colors[Math.random() * colors.length]});
        `;

        return {
          status: 'success',
          message: 'Room has been preserve',
        }
    });
