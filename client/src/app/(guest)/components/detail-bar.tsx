import { ReservationContext } from '@/context/ReservationContext';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';

export default function DetailBar({ changeRoomHandler }: any) {
   const { information } = useContext(ReservationContext);
   const stayNight =
      new Date(information.date_range.to).getDate() -
      new Date(information.date_range.from).getDate();

   return (
      <>
         <div className="w-1/2">
            <p className="font-bold">
               {information.type_name}:
               <span className="text-2xl font-black text-primary">
                  {' '}
                  {stayNight}
               </span>
            </p>
            <p className="font-bold">
               total:
               <span className="text-2xl font-black text-primary">
                  {' '}
                  {information.room_type.price}{' '}
               </span>
            </p>
         </div>

         <div
            className="fixed bottom-0 bg-white
w-full h-28 border-t-2 border-gray-400 flex items-center p-4 justify-around"
         >
            <Button
               className=" bg-primary rounded-lg  hover:bg-gray-800 active:bg-gray-800
    py-6 hover:bg-primary-hover 
    font-bold text-white"
               type="submit"
               onClick={() => changeRoomHandler()}
            >
               Change room type
            </Button>
         </div>
      </>
   );
}
