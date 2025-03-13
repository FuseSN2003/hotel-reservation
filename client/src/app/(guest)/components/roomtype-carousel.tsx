import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { RoomType } from '@/lib/frontdesk/type';
import Image from 'next/image';

interface RoomTypeCarouselProps {
  allroomtypes: RoomType[];
}

export function RoomTypeCarousel({ allroomtypes }: RoomTypeCarouselProps) {
  return (
    <Carousel
      className="w-11/12"
      opts={{
        loop: true,
      }}
    >
      <CarouselContent className="-ml-1">
        {allroomtypes?.map((type, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1 h-full">
              <Card className="shadow-md mb-3 rounded-3xl text-sm h-full">
                <CardContent className="p-0">
                  <div className="flex h-full flex-col w-full ">
                    <div className="flex relative bg-white flex-grow w-full h-44 overflow-hidden rounded-t-3xl">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                          type.picture_path || '/'
                        }`}
                        layout="fill"
                        className="object-cover"
                        alt={`Picture of ${type.name}`}
                      />
                    </div>

                    <div className="flex flex-col p-4 ">
                      <h1 className="text-center font-bold text-xl">
                        {type.name}
                      </h1>

                      <p className="text-start indent-8">{type.detail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
