import Elysia from 'elysia';
import { roomTypeRoutes } from './room-type';
import { employeeRoutes, resetPasswordRoutes } from './employee';
import { roomRoutes } from './room';
import { customerRoutes } from './customer';
import { dashboardRoutes } from './dashboard';

export const adminRoutes = new Elysia({ prefix: '/admin' })
  .use(roomTypeRoutes)
  .use(employeeRoutes)
  .use(resetPasswordRoutes)
  .use(roomRoutes)
  .use(dashboardRoutes)
  .use(customerRoutes);
