import cors from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import postgres from 'postgres';
import { adminRoutes } from './routes/admin';
import { authRoutes } from './routes/auth-route';
import { crontab } from './routes/crontab';
import { fileRoute } from './routes/file-route';
import { frontdeskRoute } from './routes/frontdesk';
import { guestRoutes } from './routes/guest';
import { reservationRoute } from './routes/reservation';
import { stripeRoutes } from './routes/stripe';

const port = process.env.PORT || 3001;

export const app = new Elysia()
  .use(swagger())
  .onError(({ set, error, code }) => {
    if (error instanceof postgres.PostgresError && error.code == '23505') {
      if (error.constraint_name == 'room_number_key') {
        set.status = 400;
        return {
          status: 'error',
          message: 'This room number have already used.',
        };
      }
    }

    if (code === 'NOT_FOUND') {
      return new Response('Not Found :(');
    }
    console.error(error);
    return {
      status: 'error',
      message: 'Internal server error, please try again later',
    };
  })
  .use(adminRoutes)
  .use(frontdeskRoute)
  .use(fileRoute)
  .use(guestRoutes)
  .use(reservationRoute)
  .use(stripeRoutes)
  .use(crontab)
  .use(authRoutes)
  .use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  )
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
