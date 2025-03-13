import { sql } from '@/libs/db';
import Elysia from 'elysia';
import { reservationType } from '@/libs/type';

export const checkInRoute = new Elysia({ prefix: '/check-in' }).patch(
  '/:id',
  async ({ params: { id }, set }) => {
    const queryReservation =
      await sql`SELECT * FROM reservations WHERE id=${id}`;

    if (queryReservation.count === 0) {
      set.status = 404;
      return {
        status: 'error',
        message: 'Reservation not found',
      };
    }
    const thisReservation = queryReservation[0] as reservationType;

    if (thisReservation.transaction_status == 'preserve') {
      set.status = 400;
      return {
        status: 'error',
        message: 'Can not check in, reservation is preserved',
      };
    }

    const currentDate = new Date();
    const checkInDate = new Date(thisReservation.check_in);
    const checkOutDate = new Date(thisReservation.check_out);

    if (currentDate < checkInDate) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Can not check in, reservation is not started yet',
      };
    }
    if (currentDate > checkOutDate) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Can not check in, reservation is already finished',
      };
    }

    await sql`
            UPDATE rooms
            SET current_status ='occupied'
            WHERE id=${thisReservation.room_id}
        `;

    return {
      status: 'success',
      message: 'Check in success',
    };
  }
);
