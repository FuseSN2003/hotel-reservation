'use client';

import { getBackendURL } from '@/lib/getBackendURL';
import { useQuery } from '@tanstack/react-query';

const FetchAllRoomTypes = async () => {
   const res = await fetch(
      `${getBackendURL()}/guest/rooms/room-types`,
      {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
         },
      }
   );
   const data = await res.json();
   const rooms = data.data;
   return rooms;
};

export const UseAllRoomTypes = () => {
   return useQuery({
      queryKey: ['guest_roomTypes'],
      queryFn: () => FetchAllRoomTypes(),
   });
};
