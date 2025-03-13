import { sql } from '@/libs/db';
import Elysia from 'elysia';

export const customerRoutes = new Elysia({ prefix: '/customers' }).get(
  '/',
  async () => {
    const customers = await sql`SELECT
                                	FIRST_NAME,
                                	LAST_NAME,
                                	ADDRESS,
                                	PROVINCE,
                                	DISTRICT,
                                	SUB_DISTRICT,
                                	POSTAL_CODE,
                                	PHONE_NUMBER,
                                	EMAIL
                                FROM
                                	CUSTOMER_DETAILS
                                	INNER JOIN (
                                		SELECT
                                			PROVINCES.ID,
                                			PROVINCES.NAME_EN AS PROVINCE
                                		FROM
                                			PROVINCES
                                	) PROVINCES ON CUSTOMER_DETAILS.PROVINCE_ID = PROVINCES.ID
                                	INNER JOIN (
                                		SELECT
                                			ID,
                                			NAME_EN AS DISTRICT
                                		FROM
                                			DISTRICTS
                                	) DISTRICTS ON CUSTOMER_DETAILS.DISTRICT_ID = DISTRICTS.ID
                                	INNER JOIN (
                                		SELECT
                                			ID,
                                			NAME_EN AS SUB_DISTRICT
                                		FROM
                                			SUB_DISTRICTS
                                	) SUB_DISTRICTS ON CUSTOMER_DETAILS.SUB_DISTRICT_ID = SUB_DISTRICTS.ID;`;
    return {
      status: 'success',
      data: customers,
    };
  }
);
