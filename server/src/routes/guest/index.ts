import Elysia from 'elysia';
import { roomRoutes } from './room';
import { roomTypeRoutes } from './roomtype';

export const guestRoutes = new Elysia({ prefix: '/guest' })
  .use(roomRoutes)
  .use(roomTypeRoutes);
