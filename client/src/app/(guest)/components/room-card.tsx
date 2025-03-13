'use client';

import { RoomType } from '@/components/interface/RoomType';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReservationContext } from '@/context/ReservationContext';
import { useContext } from 'react';
import Image from 'next/image';

type Props = {
  type: RoomType;
  clickHandler?: (type: RoomType) => void;
};

export default function RoomCard({ type, clickHandler }: Props) {
  const { state } = useContext(ReservationContext);
  return (
    <Card className="shadow-md mb-3 rounded-3xl h-fit overflow-hidden text-sm md:h-full">
      <CardContent className="p-0 md:h-full">
        <div className="flex h-full">
          <div className="relative bg-black w-1/2 ">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                type.picture_path || '/'
              }`}
              layout="fill"
              unoptimized
              className="object-cover rounded-l-xl"
              alt={`Picture of ${type.type_name}`}
            />
          </div>

          <div className="m-2  w-1/2 flex flex-col justify-between gap-4 h-full py-8 px-2">
            <h1 className="text-center font-bold md:text-2xl text-base">
              {type.name}
            </h1>

            <p className="text-start indent-8">{type.detail}</p>

            {clickHandler && state != 4 && (
              <div>
                <div className="my-4">
                  <p className="text-start font-bold">
                    <span>cost / night:</span>
                    <span className="text-primary ">
                      &nbsp;{type.price} bath
                    </span>
                  </p>

                  <p className="text-start font-bold">
                    <span>total:</span>

                    <span className="text-primary">
                      &nbsp;{type.total_price} bath
                    </span>
                  </p>
                </div>
                <Button
                  variant="reservation"
                  className=" bg-primary w-full rounded-lg  hover:bg-gray-800 active:bg-gray-800 p-4 hover:bg-primary-hover font-bold text-white"
                  onClick={() => clickHandler(type)}
                >
                  Selected
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
