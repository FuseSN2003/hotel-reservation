'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getBackendURL } from '@/lib/getBackendURL';

export const useCheckOutMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (id: string) => {
         const res = await fetch(
            `${getBackendURL()}/frontdesk/check-out/${id}`,
            {
               method: 'PATCH',
               headers: {
                  'Content-Type': 'application/json',
               },
            }
         );
         const data = await res.json();
         if (!res.ok) {
            throw new Error(data.message || 'Failed to check-in');
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
