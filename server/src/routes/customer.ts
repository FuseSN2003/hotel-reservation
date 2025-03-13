import { sql } from '@/libs/db';
import Elysia, { t } from 'elysia';

export const app = new Elysia({ prefix: '/customers' }).post(
  '/',
  async ({ body, set }) => {
    await sql`
      INSERT INTO customer_detail(first_name, last_name, address, sub_district, district, post_number, phone_number, email, province_id)
      VALUES ()
    `;
  },
  {
    body: t.Object({
      first_name: t.String(),
      last_name: t.String(),
      address: t.String(),
      sub_district: t.String(),
      district: t.String(),
      post_number: t.String(),
      phone_number: t.String(),
      email: t.String(),
      province_id: t.String(),
    }),
  }
);
