'use client';

import AllRoomTable from '@/components/frontdesk/AllRoomTable';
import FrontdeskHeader from '@/components/frontdesk/FrontDeskHeader';
import ReservationTable from '@/components/frontdesk/ReservationTable';
import SkeletonHeader from '@/components/frontdesk/SkeletonHeader';
import SkeletonTable from '@/components/frontdesk/SkeletonTable';
import { FrontDesk } from '@/context/FrontDeskContext';
import { useContext } from 'react';

export default function Child() {
  const {
    roomsLoading,
    roomsError,
    roomsTypeLoading,
    roomsTypeError,
    reservationLoading,
    reservationError,
  }: {
    roomsLoading: boolean;
    roomsError: boolean;
    roomsTypeLoading: boolean;
    roomsTypeError: boolean;
    reservationLoading: boolean;
    reservationError: boolean;
  } = useContext(FrontDesk);

  if (reservationError || roomsError || roomsTypeError) {
    return (
      <div>
        <p className="text-2xl font-bold text-red-600">
          Error something went wrong
        </p>
      </div>
    );
  }

  return (
    <div>
      <main className="p-3 ">
        {roomsLoading || roomsTypeLoading ? (
          <SkeletonHeader />
        ) : (
          <FrontdeskHeader />
        )}
        {reservationError || roomsError || roomsTypeError ? (
          <div className="w-full flex justify-center">
            <p className="text-2xl font-bold text-red-600">
              Error something went wrong
            </p>
          </div>
        ) : null}
        {reservationLoading || roomsLoading || roomsTypeLoading ? (
          <SkeletonTable />
        ) : (
          <div className="relative w-full ">
            <AllRoomTable />
            <ReservationTable />
          </div>
        )}
      </main>
    </div>
  );
}
