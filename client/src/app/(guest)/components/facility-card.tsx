import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface FacilityCardProps {
  picture: StaticImageData;
  heading: string;
  description: string;
  direction: 'left' | 'right';
}

export function FacilityCard({
  picture,
  heading,
  description,
  direction,
}: FacilityCardProps) {
  return (
    <Card className="border shadow-md mb-3 rounded-3xl h-fit overflow-hidden text-sm md:h-full">
      <CardContent className="p-0 border-0 md:h-full">
        <div
          className={`h-full flex justify-center gap-4 border
                        ${
                          direction === 'right'
                            ? 'flex-row-reverse'
                            : 'flex-row'
                        } md:flex-row
                        lg:flex-col lg:items-center
                `}
        >
          <div
            className="relative bg-white 
                        w-1/2 lg:h-1/2 lg:w-full
                        overflow-hidden"
          >
            <Image
              src={picture}
              layout="fill"
              className={`${
                direction === 'right'
                  ? 'fade-transparent-left md:fade-transparent-right'
                  : 'fade-transparent-right md:fade-transparent-left'
              } object-cover`}
              alt={`Picture of `}
            />
          </div>

          <div
            className="m-2  w-1/2
                    flex flex-col
                    justify-around gap-4
                    h-full py-8 px-2 lg:w-full lg:h-1/2 lg:mt-0 lg:py-2"
          >
            <h1 className="text-center text-xl font-bold">{heading}</h1>

            <p className="text-start indent-8">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FacilityCard;
