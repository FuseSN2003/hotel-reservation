import Elysia from 'elysia';
import { checkInRoute } from './check-in';
import { checkOutRoute } from './check-out';
import { reservationRoute } from './reservation';
import { allRoomsRoute, allRoomTypeRoute } from './all-room';
import { postPoneRoute } from './postpone';

export const frontdeskRoute = new Elysia({ prefix: '/frontdesk' })
  .use(checkInRoute)
  .use(checkOutRoute)
  .use(reservationRoute)
  .use(allRoomsRoute)
  .use(allRoomTypeRoute)
  .use(postPoneRoute);
