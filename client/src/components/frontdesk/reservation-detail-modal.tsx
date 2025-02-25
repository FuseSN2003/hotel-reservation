'use client';
import React from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooterStart,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import {
   getDarkenColorClass,
   getLightenColorClass,
} from '@/lib/frontdesk/random-color';
import { Reservation } from '@/lib/frontdesk/type';
import { Badge } from '../ui/badge';
import { useCheckInMutation } from '@/hooks/frontdesk/check-in';
import { useCheckOutMutation } from '@/hooks/frontdesk/check-out';
import { PostponeModal } from './postpone-modal';
import { LoaderCircle } from 'lucide-react';

interface Reservation_detail_modalProps {
   thisReservation: Reservation;
   nextReservation: Reservation | undefined;
   isOverflowFromPreviousMonth: boolean;
   isOverflowToNextMonth: boolean;
}

export default function Reservation_detail_modal({
   thisReservation,
   isOverflowFromPreviousMonth,
   isOverflowToNextMonth,
   nextReservation,
}: Reservation_detail_modalProps) {
   const { mutate: checkInMutate, isPending: checkInIsPending } =
      useCheckInMutation();
   const { mutate: checkOutMutate, isPending: checkOutIsPending } =
      useCheckOutMutation();

   return (
      <Dialog>
         <DialogTrigger asChild>
            <div
               style={{
                  backgroundColor: getLightenColorClass(
                     thisReservation.display_color
                  ),
                  color: getDarkenColorClass(thisReservation.display_color),
                  padding: '0.35rem',
                  borderRadius: `${
                     isOverflowFromPreviousMonth
                        ? '0 0.6rem 0.6rem 0'
                        : isOverflowToNextMonth
                        ? '0.6rem 0 0 0.6rem'
                        : '0.6rem'
                  }`,
                  borderLeft: `${
                     isOverflowFromPreviousMonth ? '0' : '0.4rem'
                  } solid ${getDarkenColorClass(
                     thisReservation.display_color
                  )}`,
                  cursor: 'pointer',
                  opacity: 1,
                  transition: 'opacity 0.1s ease-in-out',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  margin: '0px',
                  position: 'relative',
                  left: `${isOverflowFromPreviousMonth ? '0' : '1.1rem'}`,
                  width: `${
                     isOverflowToNextMonth
                        ? 'calc(100% - 1rem)'
                        : isOverflowFromPreviousMonth
                        ? 'calc(100% + 1.5rem)'
                        : nextReservation
                        ? 'calc(100% + 0.1rem) '
                        : 'calc(100% - 2.8rem)'
                  }`,
               }}
               onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.6';
               }}
               onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
               }}
            >
               {thisReservation.first_name + ' ' + thisReservation.last_name}{' '}
            </div>
         </DialogTrigger>
         <DialogContent className="max-w-lg p-4">
            <DialogHeader>
               <DialogTitle>Reservation Details</DialogTitle>

               <DialogDescription>
                  Information about the reservation of{' '}
                  {thisReservation.first_name} {thisReservation.last_name}.
               </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
               <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${thisReservation.picture_path || '/'}`}
                  alt="room"
                  className="w-7/12 object-cover h-48 rounded-lg shadow-md"
               />
            </div>

            <div className="mt-0 grid grid-cols-2 gap-4">
               <div>
                  {' '}
                  <p className="break-words">
                     <strong>Name : </strong> {thisReservation.first_name}{' '}
                     {thisReservation.last_name}
                  </p>
                  <p className="break-words">
                     <strong>Tel : </strong>
                     {thisReservation.phone_number}
                  </p>
                  <p className="break-words">
                     <strong>Email : </strong>
                     {thisReservation.email}
                  </p>
                  <p className="break-words">
                     <strong>Address : </strong>
                  </p>
                  <p className="break-words">
                     {thisReservation.address +
                        ', ' +
                        thisReservation.sub_district +
                        ', ' +
                        thisReservation.district +
                        ', ' +
                        thisReservation.province +
                        ', ' +
                        thisReservation.postcode}
                  </p>
                  <p className="break-words">
                     <strong>Check-in :</strong>{' '}
                     {new Date(thisReservation.check_in).toLocaleDateString()}
                  </p>
                  <p className="break-words">
                     <strong>Check-out :</strong>{' '}
                     {new Date(thisReservation.check_out).toLocaleDateString()}
                  </p>
                  <p className="break-words">
                     <strong>Special Request :</strong>{' '}
                     {thisReservation?.special_request?.length > 0
                        ? thisReservation.special_request
                        : '-'}
                  </p>
               </div>
               <div>
                  <p className="break-words">
                     <strong>Room Number :</strong>{' '}
                     {thisReservation.room_number}
                  </p>
                  <p className="break-words">
                     <strong>Room Type: </strong> {thisReservation.types_name}
                  </p>
                  <p className="break-words">
                     <strong>Capacity :</strong> {thisReservation.capacity}
                  </p>
                  <div className="flex align-middle text-center">
                     <p className="break-words">
                        <strong>Room Status :&nbsp;</strong>
                     </p>
                     {thisReservation.current_status === 'occupied' ? (
                        <Badge className="bg-amber-600  hover:bg-amber-600 font-bold text-sm">
                           occupied
                        </Badge>
                     ) : (
                        <></>
                     )}
                     {thisReservation.current_status === 'vacant' ? (
                        <Badge className="bg-green-600 hover:bg-green-600 font-bold text-sm">
                           vacant
                        </Badge>
                     ) : (
                        <></>
                     )}
                     {thisReservation.current_status === 'departing' ? (
                        <Badge className="bg-sky-600 hover:bg-sky-600 font-bold text-sm">
                           departing
                        </Badge>
                     ) : (
                        <></>
                     )}
                     {thisReservation.current_status === 'maintenance' ? (
                        <Badge className="bg-gray-600 hover:bg-gray-600 font-bold text-sm">
                           maintenance
                        </Badge>
                     ) : (
                        <></>
                     )}
                     {thisReservation.current_status === 'off_market' ? (
                        <Badge className="bg-gray-600 hover:bg-gray-600 font-bold text-sm">
                           off market
                        </Badge>
                     ) : (
                        <></>
                     )}
                  </div>
               </div>
            </div>

            <DialogFooterStart className="flex justify-start mt-4">
               <Button
                  variant="default"
                  className="
                bg-green-600 border-0 text-white hover:bg-green-700 font-bold w-28 flex items-center justify-center"
                  disabled={
                     thisReservation.current_status === 'occupied' ||
                     thisReservation.current_status === 'departing' ||
                     thisReservation.current_status === 'maintenance' ||
                     thisReservation.current_status === 'off_market' ||
                     new Date(thisReservation.check_out) < new Date() ||
                     new Date(thisReservation.check_out).getDate() ===
                        new Date().getDate() ||
                     new Date(thisReservation.check_in).getDate() >
                        new Date().getDate()
                  }
                  onClick={() => checkInMutate(thisReservation.reservations_id)}
               >
                  {checkInIsPending ? (
                     <LoaderCircle className="animate-spin" />
                  ) : (
                     'Check-in'
                  )}
               </Button>
               <Button
                  variant="default"
                  className="bg-red-600 border-0 text-white hover:bg-red-700 font-bold w-28 flex items-center justify-center"
                  onClick={() =>
                     checkOutMutate(thisReservation.reservations_id)
                  }
                  disabled={
                     thisReservation.current_status === 'vacant' ||
                     thisReservation.current_status === 'maintenance' ||
                     thisReservation.current_status === 'off_market'
                     // new Date(thisReservation.check_out) < new Date() ||
                     // new Date(thisReservation.check_in).getDate() >=
                     //    new Date().getDate()
                  }
               >
                  {checkOutIsPending ? (
                     <LoaderCircle className="animate-spin" />
                  ) : (
                     'Check-out'
                  )}
               </Button>
               <PostponeModal thisReservation={thisReservation} />
            </DialogFooterStart>
         </DialogContent>
      </Dialog>
   );
}
