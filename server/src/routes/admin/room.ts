import { sql } from '@/libs/db';
import { createAndUpdateRoomSchema } from '@/libs/validation';
import { middleware } from '@/middleware';
import Elysia, { t } from 'elysia';

export const roomRoutes = new Elysia({ prefix: '/rooms' })
  .use(middleware)
  .post('/', async ({ set, body, user }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const validation = createAndUpdateRoomSchema.safeParse(body);

    if (!validation.success) {
      set.status = 400;
      const error = validation.error.issues[0].message;
      return {
        status: 'error',
        message: error,
      };
    }

    const { number, type_id } = validation.data;

    const [res] = await sql`INSERT INTO rooms(number, type_id) 
                            VALUES (${number}, ${type_id})
                            RETURNING rooms.id`;

    set.status = 201;

    return {
      status: 'success',
      message: 'You have already a created new room.',
      room_id: res.id,
    };
  })
  .get('/', async ({ user, set, query }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const q = query.q || '';
    const status = query.status || '';

    const [currentStatus] = await sql`SELECT enum_range(null::current_status);`;

    let res;
    if (!currentStatus.enum_range.includes(status)) {
      res = await sql`
            SELECT rooms.id, rooms.number, rooms.current_status, room_types.name AS room_type, room_types.price, room_types.picture_path
            FROM rooms
            INNER JOIN room_types
            ON rooms.type_id = room_types.id
            WHERE rooms.number LIKE ${`%${q}%`}
            ORDER BY rooms.number ASC`;
    } else {
      res = await sql`
            SELECT rooms.id, rooms.number, rooms.current_status, room_types.name AS room_type, room_types.price, room_types.picture_path
            FROM rooms
            INNER JOIN room_types
            ON rooms.type_id = room_types.id
            WHERE rooms.number LIKE ${`%${q}%`}
            AND rooms.current_status = ${status}
            ORDER BY rooms.number ASC`;
    }

    return {
      status: 'success',
      data: res,
    };
  })
  .get('/:id', async ({ params, set, user }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const { id } = params;

    const [res] =
      await sql`SELECT rooms.number, rooms.current_status, room_types.name AS room_type, room_types.price 
                        FROM rooms
                        INNER JOIN room_types
                        ON rooms.type_id = room_types.id
                        WHERE rooms.id = ${id}`;

    if (!res) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Room not found.',
      };
    }

    return {
      status: 'success',
      data: res,
    };
  })
  .put('/:id', async ({ params, set, body, user }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const { id } = params;

    const validation = createAndUpdateRoomSchema.safeParse(body);

    if (!validation.success) {
      set.status = 400;
      const error = validation.error.issues[0].message;
      return {
        status: 'error',
        message: error,
      };
    }

    const { number, type_id } = validation.data;

    const [res] = await sql`SELECT * FROM rooms WHERE id=${id}`;

    if (!res) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Room not found.',
      };
    }

    await sql`
            UPDATE rooms
            SET number=${number}, type_id=${type_id} 
            WHERE id=${id}
        `;

    return {
      status: 'success',
      message: 'Update successfully.',
    };
  })
  .delete('/:id', async ({ set, params, user }) => {
    if (!user) {
      set.status = 401;
      return {
        status: 'error',
        message: 'Unauthorized',
      };
    }

    if (user.role !== 'administrator') {
      set.status = 403;
      return {
        status: 'error',
        message: 'Forbidden',
      };
    }

    const { id } = params;

    const reservation = await sql`SELECT * FROM reservations 
                                WHERE room_id=${id}
                                AND check_out > NOW()`;

    if (reservation.length !== 0) {
      set.status = 400;
      return {
        status: 'error',
        message: 'There are some guests who use this room.',
      };
    }

    const [res] = await sql`SELECT * FROM rooms WHERE id=${id}`;

    if (!res) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Room not found.',
      };
    }

    await sql`DELETE FROM rooms
                WHERE id=${id}`;

    return {
      status: 'success',
      message: 'Your room have been removed.',
    };
  })
  .patch(
    '/status',
    async ({ user, set, body }) => {
      if (!user) {
        set.status = 401;
        return {
          status: 'error',
          message: 'Unauthorized',
        };
      }

      if (user.role !== 'administrator') {
        set.status = 403;
        return {
          status: 'error',
          message: 'Forbidden',
        };
      }

      const { id } = body;

      const status = body.status.replace(' ', '_');

      const [currentStatus] =
        await sql`SELECT enum_range(null::current_status);`;

      if (!currentStatus.enum_range.includes(status)) {
        set.status = 400;
        return {
          status: 'error',
          message: 'Invalid status.',
        };
      }

      const [res] = await sql`SELECT * FROM rooms WHERE id=${id}`;

      if (!res) {
        set.status = 404;
        return {
          status: 'error',
          message: 'Room not found.',
        };
      }

      await sql`
            UPDATE rooms
            SET current_status=${status}
            WHERE id=${id}
        `;

      return {
        status: 'success',
        message: 'Update successfully.',
      };
    },
    {
      body: t.Object({
        id: t.String(),
        status: t.String(),
      }),
    }
  );
