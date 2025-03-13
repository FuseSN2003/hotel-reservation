import { ReservationContext } from '@/context/ReservationContext';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';

export default function ConclusionBar() {
  const { information, setState } = useContext(ReservationContext);
  const { roomType, stayNight } = information;
  return (
    <div
      className="fixed bottom-0 bg-white
                      w-full h-28 border-t-2 border-gray-400 flex items-center p-4 justify-around
                      z-40"
    >
      <div className="w-1/2">
        <p className="font-bold">
          {roomType.name}:
          <span className="text-xl font-black text-primary">
            {' '}
            {stayNight} nights
          </span>
        </p>
        <p className="font-bold">
          total:
          <span className="text-xl font-black text-primary">
            {' '}
            {roomType.total_price} Bath
          </span>
        </p>
      </div>

      <Button
        className=" bg-primary rounded-lg  hover:bg-gray-800 active:bg-gray-800
                          py-6 hover:bg-primary-hover 
                          font-bold text-white"
        type="submit"
        onClick={() => setState(2)}
      >
        Change room type
      </Button>
    </div>
  );
}
