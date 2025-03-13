import { sql } from '@/libs/db';
import getVacantRoom from '@/libs/get-vacant-room';
import { getRandomColorToDB } from '@/libs/random-color';
import {
  ChangeRoomSchema,
  GetVacantRoomsSchema,
  NewCustomerSchema,
} from '@/libs/validation';
import Elysia from 'elysia';
import { z } from 'zod';

export const roomRoutes = new Elysia({ prefix: '/rooms' })
  .get('/vacant-rooms', async ({ query }) => {
    const roomTypes = await sql`SELECT id FROM room_types`;
    const uniqueRooms = [];

    if (!query.check_in || !query.check_out) {
      return {
        status: 'error',
        message: 'Check in and check out date is required',
      };
    }
    const { check_in, check_out } = query;
    for (const roomType of roomTypes) {
      const res = await getVacantRoom({
        type_id: roomType.id,
        check_in: new Date(check_in),
        check_out: new Date(check_out),
      });
      uniqueRooms.push(res);
    }
    return {
      status: 'success',
      data: uniqueRooms,
    };
  })
  .post('/preserve', async ({ body, set }) => {
    const validation = GetVacantRoomsSchema.safeParse(body);
    if (!validation.success) {
      return {
        status: 'error',
        message: validation.error.message,
      };
    }

    const { check_in, check_out, type_id } = validation.data;
    check_in.setHours(12, 0, 0);
    check_out.setHours(12, 0, 0);

    const room = await getVacantRoom({ type_id, check_in, check_out });

    if (!room) {
      set.status = 400;

      return {
        status: 'error',
        message: 'Sorry last room just be purchased second ago.',
      };
    }

    const randomColor = getRandomColorToDB();

    const [reservationId] = await sql`
            INSERT INTO reservations (room_id, check_in, check_out, price, display_color)
            VALUES (${room.room_id}, ${check_in}, ${check_out}, ${room.total_price}, ${randomColor})
            RETURNING id;
        `;

    return {
      status: 'success',
      message: 'Room has been preserve',
      reservationId: reservationId.id,
    };
  })
  .post('/change-type', async ({ body, set }) => {
    const validation = ChangeRoomSchema.safeParse(body);
    if (!validation.success) {
      set.status = 400;
      return {
        status: 'error',
        message: validation.error.message,
      };
    }

    const { check_in, check_out, type_id, reservation_id, total_price } =
      validation.data;

    check_in.setHours(12, 0, 0);
    check_out.setHours(12, 0, 0);

    const room = await getVacantRoom({ type_id, check_in, check_out });

    if (!room) {
      set.status = 400;

      return {
        status: 'error',
        message: 'Sorry last room just be purchased second ago.',
      };
    }

    await sql`UPDATE reservations SET room_id = (
                              SELECT
                                rooms."id" AS room_id
                              FROM
                                rooms
                                LEFT JOIN room_types ON rooms.type_id = room_types.id 
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
                                LIMIT 1),
                                price=${total_price}
                                WHERE id = ${reservation_id}`;

    return {
      status: 'success',
      message: 'Room has been changed',
    };
  })
  .delete('/preserve', async ({ body, set }) => {
    const validation = z
      .object({ reservation_id: z.string().uuid() })
      .safeParse(body);
    if (!validation.success) {
      set.status = 400;
      return {
        status: 'error',
        message: 'reservation id is not uuid.',
      };
    }

    const { reservation_id } = validation.data;

    await sql`DELETE FROM reservations WHERE id = ${reservation_id} and transaction_status = 'preserve'`;
    return {
      status: 'success',
      message: 'Preserve reservation has been removed.',
    };
  })
  .post('/customer', async ({ body, set }) => {
    const validation = NewCustomerSchema.safeParse(body);

    if (!validation.success) {
      set.status = 400;
      return {
        status: 'error',
        message: validation.error.message,
      };
    }

    const { personalInformation, reservationId } = validation.data;
    const {
      firstName,
      lastName,
      address,
      phoneNumber,
      email,
      subDistrict,
      district,
      province,
      postcode,
      specialRequests,
    } = personalInformation;

    const [customerID] = await sql`
        INSERT INTO customer_details (first_name, last_name, address, phone_number, email, sub_district, district, province, postcode, special_request)
        VALUES (${firstName}, ${lastName}, ${address}, ${phoneNumber}, ${email}, ${subDistrict}, ${district}, ${province}, ${postcode}, ${
          specialRequests || null
        })
        RETURNING id;
      `;

    await sql`
        UPDATE reservations
        SET 
        customer_id = ${customerID.id}
        WHERE id = ${reservationId};
      `;

    return {
      status: 'success',
      message: 'Customer detail has been added.',
    };
  });
