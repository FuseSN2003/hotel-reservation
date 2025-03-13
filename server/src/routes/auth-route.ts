import { sql } from '@/libs/db';
import { lucia } from '@/libs/lucia';
import { loginSchema } from '@/libs/validation';
import Elysia from 'elysia';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/login', async ({ set, cookie, body, headers }) => {
    const validate = loginSchema.safeParse(body);

    if (!validate.success) {
      set.status = 400;
      return {
        status: 'error',
        message: validate.error.errors[0].message,
      };
    }

    const { username, password } = validate.data;

    const [user] =
      await sql`SELECT * FROM employees WHERE LOWER(username)=LOWER(${username})`;

    if (!user) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Invalid username or password',
      };
    }

    const validPassword = await Bun.password.verify(
      password,
      user.password,
      'bcrypt'
    );

    if (!validPassword) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Invalid username or password',
      };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });

    return {
      status: 'success',
      message: 'Login successful',
    };
  })
  .get('/logout', async ({ cookie, set }) => {
    const sessionId = cookie['auth_session'].value;

    if (!sessionId) {
      set.status = 400;
      return {
        status: 'error',
        message: 'User not logged in',
      };
    }

    await lucia.invalidateSession(sessionId);
    const sessionCookie = lucia.createBlankSessionCookie();

    cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });

    return {
      status: 'success',
      message: 'Logout successful',
    };
  })
  .get('/check-user', async ({ cookie }) => {
    const sessionId = cookie['auth_session'].value;

    if (!sessionId) {
      return {
        status: 'error',
        message: 'User not logged in',
      };
    }

    const { user } = await lucia.validateSession(sessionId);

    if (!user) {
      return {
        status: 'success',
        message: 'User not logged in',
        user: null,
      };
    }

    return {
      status: 'success',
      message: 'User logged in',
      user,
    };
  });
