import React from 'react';
import {
   TableSticky,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
} from '@/components/ui/table';
import Reservation_detail_modal from './reservation-detail-modal';

export type Reservation = {
   reservations_id: string;
   customer_id: string;
   first_name: string;
   last_name: string;
   address: string;
   email: string;
   phone_number: string;
   sub_district: string | null;
   district: string | null;
   province: string | null;
   postcode: string | null;
   room_number: string;
   price: number;
   room_id: string;
   check_in: Date;
   check_out: Date;
   display_color: string;
   transaction_status: string;
   createAt: string;
   current_status: string;
   types_name: string;
   capacity: number;
   detail: string;
   picture_path: string;
   price_per_night: number;
   special_request: string;
};

export type Room = {
   id: string;
   number: string;
   current_status: string;
   detail: string;
   picture_path: string;
   price: number;
   capacity: number;
};

export type vacantRoomOfDay = {
   [key: string]: number[];
};

export type allRooms = {
   [key: string]: Room[];
};

interface ReservationTableProps {
   selectedYear: string;
   selectedMonth: number;
   roomsData: any;
   reservationData: Reservation[];
   daysArray: string[];
   check_in: (id: string) => void;
   check_out: (id: string) => void;
}

export default function ReservationTable({
   selectedYear,
   selectedMonth,
   roomsData,
   reservationData,
   daysArray,
   check_in,
   check_out,
}: ReservationTableProps) {
   const checkAvailableRooms = (day: number, roomType: string) => {
      const thisColDate = new Date(
         `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(
            day
         ).padStart(2, '0')}`
      );
      const ThisTypeReservation = reservationData.filter(
         (reservation) =>
            reservation.types_name === roomType &&
            new Date(reservation.check_in) <= thisColDate &&
            new Date(reservation.check_out) >= thisColDate
      );

      const ThisTypeRoom = roomsData[roomType].filter(
         (room: Room) =>
            room.current_status === 'vacant' ||
            room.current_status === 'occupied' ||
            room.current_status === 'departing'
      );
      const availableRooms = ThisTypeRoom.length - ThisTypeReservation.length;
      return availableRooms;
   };
   return (
      <TableSticky className="table-fixed mt-3 w-full relative">
         <TableHeader className="sticky top-0 bg-white border">
            <TableRow className="border">
               <TableHead className="w-28 text-center border-b text-white bg-blue-600">
                  <b>Rooms Types</b>
               </TableHead>

               {daysArray.map((date, index) => (
                  <TableHead
                     key={`date-${index}`}
                     className="text-center border text-black w-10"
                  >
                     <b>{date}</b>
                     <br />{' '}
                     {index + 1 < 10 ? (
                        <>{'0' + (index + 1)}</>
                     ) : (
                        <> {index + 1}</>
                     )}
                  </TableHead>
               ))}
            </TableRow>
         </TableHeader>
         <TableBody>
            {Object.entries(roomsData as allRooms).map(
               ([roomTypes, rooms]: [string, Room[]], index) => {
                  return (
                     <React.Fragment key={`roomTypes-${index}`}>
                        <TableRow key={`room-type-row-${roomTypes}`}>
                           <TableCell className="w-28 text-center border text-black font-bold">
                              {roomTypes}
                           </TableCell>

                           {Array.from({ length: daysArray.length }).map(
                              (_, i) => (
                                 <TableCell
                                    key={`room-type-${roomTypes}-${i}`}
                                    className="text-center border"
                                 >
                                    {checkAvailableRooms(i + 1, roomTypes) ===
                                    0 ? (
                                       <p
                                          className="bg-gray-600
                                        text-white py-1 rounded-md text-center"
                                       >
                                          {checkAvailableRooms(
                                             i + 1,
                                             roomTypes
                                          )}
                                       </p>
                                    ) : (
                                       <p className="bg-green-600 text-white py-1 rounded-md text-center">
                                          {checkAvailableRooms(
                                             i + 1,
                                             roomTypes
                                          )}
                                       </p>
                                    )}
                                 </TableCell>
                              )
                           )}
                        </TableRow>
                        {rooms.map((room: Room) => {
                           const thisRoomReservations = reservationData.filter(
                              (reservation) => reservation.room_id === room.id
                           );

                           return (
                              <TableRow key={`room-row-${room.id}`}>
                                 <TableCell
                                    key={`room-cell-${room.id}`}
                                    className="w-28 text-start border text-black"
                                 >
                                    {room.current_status === 'vacant' ? (
                                       <div className="flex items-center">
                                          <p className="p-2 bg-green-500 mr-2 rounded-md"></p>
                                          <span>{' ' + room.number}</span>
                                       </div>
                                    ) : room.current_status === 'occupied' ? (
                                       <div className="flex items-center">
                                          <p className="p-2 bg-amber-500 mr-2 rounded-md"></p>
                                          <span>{' ' + room.number}</span>
                                       </div>
                                    ) : room.current_status === 'departing' ? (
                                       <div className="flex items-center">
                                          <p className="p-2 bg-sky-500 mr-2 rounded-md"></p>
                                          <span>{' ' + room.number}</span>
                                       </div>
                                    ) : (
                                       <div className="flex items-center">
                                          <p className="p-2 bg-gray-500 mr-2 rounded-md"></p>
                                          <span>{' ' + room.number}</span>
                                       </div>
                                    )}
                                 </TableCell>
                                 {(() => {
                                    const cells = [];
                                    for (let i = 0; i < daysArray.length; i++) {
                                       const thisColDays = i + 1;
                                       const thisColDate = new Date(
                                          `${selectedYear}-${String(
                                             selectedMonth
                                          ).padStart(2, '0')}-${String(
                                             thisColDays
                                          ).padStart(2, '0')}`
                                       );

                                       const thisReservation =
                                          thisRoomReservations.find(
                                             (reservation) =>
                                                new Date(
                                                   reservation.check_in
                                                ) <= thisColDate &&
                                                new Date(
                                                   reservation.check_out
                                                ) >= thisColDate
                                          );

                                       if (thisReservation) {
                                          let endSpan = 1;
                                          const checkOutDate = new Date(
                                             thisReservation.check_out
                                          );

                                          if (checkOutDate >= thisColDate) {
                                             const timeDiff =
                                                checkOutDate.getTime() -
                                                thisColDate.getTime();
                                             const dayDiff = Math.ceil(
                                                timeDiff / (1000 * 3600 * 24)
                                             );
                                             endSpan = Math.min(
                                                dayDiff + 1,
                                                daysArray.length - i
                                             );
                                          }

                                          cells.push(
                                             <TableCell
                                                key={`reservation-cell-${thisReservation.reservations_id}-${i}`}
                                                className="border p-0"
                                                colSpan={endSpan}
                                             >
                                                <Reservation_detail_modal
                                                   thisReservation={
                                                      thisReservation
                                                   }
                                                   check_in={check_in}
                                                   check_out={check_out}
                                                />
                                             </TableCell>
                                          );

                                          i = i + endSpan - 1;
                                       } else {
                                          cells.push(
                                             <TableCell
                                                key={`empty-cell-${room.id}-${i}`}
                                                className="w-40 text-start border "
                                             ></TableCell>
                                          );
                                       }
                                    }
                                    return cells;
                                 })()}
                              </TableRow>
                           );
                        })}
                     </React.Fragment>
                  );
               }
            )}
         </TableBody>
      </TableSticky>
   );
}
