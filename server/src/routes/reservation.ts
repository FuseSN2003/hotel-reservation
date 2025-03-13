import { sql } from '@/libs/db';
import Elysia, { t } from 'elysia';

export const reservationRoute = new Elysia({ prefix: '/reservations' }).get(
  '/',
  async () => {
    const response = await sql`SELECT * FROM reservation`;

    return {
      status: 'success',
      data: response,
    };
  }
);
