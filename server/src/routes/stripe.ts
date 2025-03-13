import { sql } from '@/libs/db';
import { EmailInformation, sendEmail } from '@/libs/email';
import { getDiffDate } from '@/libs/get-diff-date';
import { PaymentSchema } from '@/libs/validation';
import Elysia from 'elysia';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeRoutes = new Elysia({ prefix: '/stripe' })
  .post('/checkout', async ({ body, set }) => {
    const validation = PaymentSchema.safeParse(body);
    if (!validation.success) {
      set.status = 400;
      return {
        status: 'error',
        message: validation.error.message,
      };
    }
    const { roomTypeId, personalInformation, totalPrice, reservationId } =
      validation.data;

    const [roomType] = await sql`
      SELECT
        room_types.name
      FROM
        room_types
      WHERE
        room_types.id = ${roomTypeId};
    `;

    const { email } = personalInformation;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      line_items: [
        {
          price_data: {
            currency: 'thb',
            unit_amount: totalPrice * 100,
            product_data: {
              name: roomType.name,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&email=${email}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel?reservationId=${reservationId}`,
    });

    await sql`
    UPDATE reservations
    SET 
    stripe_session_id = ${session.id}
    WHERE id = ${reservationId};
    `;

    return {
      status: 'success',
      data: {
        session_id: session.id,
      },
    };
  })
  .onParse(async ({ request, headers }) => {
    if (headers['content-type'] === 'application/json; charset=utf-8') {
      const arrayBuffer = await Bun.readableStreamToArrayBuffer(request.body!);
      const rawBody = Buffer.from(arrayBuffer);
      return rawBody;
    }
  })
  .post('/webhook', async ({ body, headers }) => {
    const signature = headers['stripe-signature'];

    try {
      const event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        endpointSecret
      );

      switch (event.type) {
        case 'checkout.session.completed':
          const {
            id: sessionID,
            status,
            payment_method_types: paymentMethod,
            amount_total: cost,
          } = event.data.object;

          await sql`UPDATE reservations SET transaction_status = ${status} WHERE stripe_session_id = ${sessionID}`;

          const [{ checkIn, checkOut, roomType, email, name }] =
            await sql` SELECT
                        reservations.check_in AS "checkIn",
                        reservations.check_out AS "checkOut", 
                        room_types.NAME AS "roomType",
                        customer_details.email AS "email",
                        customer_details.first_name || ' ' || customer_details.last_name AS name
                    FROM
                        reservations 
                        INNER JOIN
                        customer_details
                        ON
                        customer_details."id" = reservations."customer_id"
                        INNER JOIN
                        rooms
                        ON
                        reservations."room_id" = rooms."id"
                        INNER JOIN
                        room_types
                        ON 
                        room_types."id" = rooms."type_id"
                    WHERE
                        reservations.stripe_session_id = ${sessionID}`;

          const nights = getDiffDate(checkIn, checkOut);

          const thbCost = `${cost / 100} bath`;

          const emailInformation: EmailInformation = {
            name,
            checkIn: new Date(checkIn).toDateString(),
            checkOut: new Date(checkOut).toDateString(),
            nights,
            roomType,
            cost: thbCost,
            paymentMethod,
            email,
          };

          sendEmail(emailInformation);
      }
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'Webhook Error',
      };
    }

    return {
      status: 'success',
    };
  });
