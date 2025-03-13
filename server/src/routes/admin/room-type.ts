import Elysia from 'elysia';
import { sql } from '@/libs/db';
import { unlink } from 'node:fs/promises';
import { uploadFile } from '@/libs/upload-file';
import { addRoomTypeSchema } from '@/libs/validation';
import { join } from 'path';
import { middleware } from '@/middleware';

export const roomTypeRoutes = new Elysia({ prefix: '/room-types' })
  .use(middleware)
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
    const q = query.q?.toLowerCase() || '';

    const roomTypes =
      await sql`SELECT * FROM room_types WHERE LOWER(name) LIKE ${`%${q}%`}`;

    return {
      status: 'success',
      data: roomTypes,
    };
  })
  .post('/', async ({ body, set, user }) => {
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

    const validateData = addRoomTypeSchema.safeParse(body);

    if (!validateData.success) {
      set.status = 400;
      return {
        status: 'error',
        message: validateData.error.errors[0].message,
      };
    }

    const { name, detail, capacity, price, image } = validateData.data;

    if (!image || image.size === 0) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Image is required',
      };
    }

    const [roomType] = await sql`SELECT * FROM room_types WHERE name=${name}`;

    if (roomType) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Room type already exists',
      };
    }

    const uploadResult = await uploadFile(image);

    if (uploadResult.status === 'error') {
      set.status = 400;
      return {
        status: 'error',
        message: uploadResult.message,
      };
    }

    await sql`
            INSERT INTO room_types (name, detail, capacity, price, picture_path)
            VALUES (${name}, ${detail}, ${capacity}, ${price}, ${uploadResult.url})
        `;

    return {
      status: 'success',
      message: 'Room type added successfully',
    };
  })
  .put('/:id', async ({ params: { id }, body, set, user }) => {
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

    const [roomType] = await sql`SELECT * FROM room_types WHERE id=${id}`;

    if (!roomType) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Room type not found',
      };
    }

    const validateData = addRoomTypeSchema.safeParse(body);

    if (!validateData.success) {
      return {
        status: 'error',
        message: validateData.error.errors[0].message,
      };
    }

    const { name, detail, capacity, price, image } = validateData.data;

    const [existingRoomType] =
      await sql`SELECT * FROM room_types WHERE name=${name} AND id!=${roomType.id}`;

    if (existingRoomType) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Room type already exists',
      };
    }

    let url = roomType.picture_path;
    if (image && image.size !== 0) {
      const uploadResult = await uploadFile(image);

      if (uploadResult.status === 'error') {
        set.status = 400;
        return uploadResult;
      }

      const path = join(
        '.',
        process.env.UPLOAD_FOLDER!,
        roomType.picture_path.split('/').pop()
      );
      await unlink(path);

      url = uploadResult.url;
    }

    await sql`
        UPDATE room_types
        SET name=${name}, detail=${detail}, capacity=${capacity}, price=${price}, picture_path=${url}
        WHERE id=${roomType.id}
        `;

    return {
      status: 'success',
      message: 'Room type updated successfully',
    };
  })
  .delete('/:id', async ({ params: { id }, set, user }) => {
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

    const [roomType] = await sql`SELECT * FROM room_types WHERE id=${id}`;

    if (!roomType) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Room type not found',
      };
    }

    await sql`DELETE FROM room_types WHERE id=${roomType.id}`;

    return {
      status: 'success',
      message: 'Room type deleted successfully',
    };
  });
