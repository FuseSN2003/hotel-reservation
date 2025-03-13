'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { getBackendURL } from '@/lib/getBackendURL';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export const usePostPoneMutation = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async ({
         reservationID,
         currentCheckout,
         newCheckOut,
         roomTypeId,
         email
      }: {
         reservationID: string;
         currentCheckout: string;
         newCheckOut: string;
         roomTypeId: string;
         email: string;
      }) => {
         const res = await fetch(
            `${getBackendURL()}/frontdesk/postpone/`,
            {
               body: JSON.stringify({
                  reservationID,
                  currentCheckout,
                  newCheckOut
               }),
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
               },
            }
         );

         if ( res.status == 200 ) {
            const passToStripeData = await res.json();
            const {reservationId, totalPrice} = passToStripeData.data;

            const stripe = await stripePromise;
            const response = await fetch(
               `${getBackendURL()}/stripe/checkout`,
               {
                 method: "POST",
                 headers: {
                   "Content-Type": "application/json",
                 },
                 body: JSON.stringify({
                   roomTypeId,
                   totalPrice,
                   personalInformation : { email },
                   reservationId,
                 }),
               }
             );
             const data = await response.json();
            const sessionId = data.data.session_id;

            stripe!.redirectToCheckout({ sessionId });
         }

         const data = await res.json();
         if (!res.ok) {
            throw new Error(data.message || 'Failed to postpone reservation');
         }
         return data;
      },
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: ['rooms'],
         });
         queryClient.invalidateQueries({
            queryKey: ['reservations'],
         });
         queryClient.invalidateQueries({
            queryKey: ['roomTypes'],
         });

         toast.success(data.message);
      },
      onError: (error: any) => {
         toast.error(error.message);
      },
   });
};
