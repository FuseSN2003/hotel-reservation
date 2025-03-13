import React, { useContext } from 'react';
import {
   Table,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
} from '@/components/ui/table';
import { FrontDesk } from '@/context/front-desk';

import { allRooms, Room } from '@/lib/frontdesk/type';

export default function AllRoomTable() {
   const {
      roomsDataFilter,
      roomType,
      daysArray,
   }: {
      roomsDataFilter: allRooms;
      roomType: string;
      daysArray: string[];
   } = useContext(FrontDesk);

   if (!roomsDataFilter || !daysArray) return null;

   const roomsData = Object.fromEntries(
      Object.entries(roomsDataFilter as allRooms)?.filter(([key]) => {
         if (roomType === 'all') return true;
         return key === roomType;
      })
   );

   return (
      <Table className="table-fixed mt-3 w-full absolute z-10 border-2 border-gray-200">
         <TableHeader className="sticky top-0 bg-white border-2 border-gray-200 z-30">
            <TableRow className="border">
               <TableHead className="w-28 text-center border-2 border-gray-200 text-white bg-blue-600">
                  <b>Rooms Types</b>
               </TableHead>

               {daysArray.map((date: any, index: any) => (
                  <TableHead
                     key={`date-${index}`}
                     className="text-center  border-2 border-gray-200 text-black w-10"
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
            {Object.entries(roomsData as allRooms)?.map(
               ([roomTypes, rooms]: [string, Room[]], index) => {
                  return (
                     <React.Fragment key={`roomTypes-${index}`}>
                        <TableRow
                           key={`room-type-row-${roomTypes}`}
                           className="border-gray-200 border-2"
                        >
                           <TableCell className="w-28 text-center border-gray-200 text-white font-bold"></TableCell>

                           {Array.from({ length: daysArray.length }).map(
                              (_, i) => (
                                 <TableCell
                                    key={`room-type-${roomTypes}-${i}`}
                                    className="text-center border-gray-200 border-2"
                                 >
                                    {' '}
                                    <p
                                       className="bg-gray-600
                               text-white py-1 rounded-md text-center"
                                    >
                                       &nbsp;{' '}
                                    </p>
                                 </TableCell>
                              )
                           )}
                        </TableRow>
                        {rooms.map((room: Room) => {
                           return (
                              <TableRow
                                 key={`room-row-${room.id}`}
                                 className="relative h-12 border-gray-200 border-2"
                              >
                                 <TableCell
                                    key={`room-cell-${room.id}`}
                                    className="w-28 text-start border-gray-200 border-2 text-black"
                                 ></TableCell>
                                 {(() => {
                                    const cells = [];
                                    for (let i = 0; i < daysArray.length; i++) {
                                       cells.push(
                                          <TableCell
                                             key={`empty-cell-${room.id}-${i}`}
                                             className="w-40 text-start border-gray-200 border-2 "
                                          ></TableCell>
                                       );
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
      </Table>
   );
}
