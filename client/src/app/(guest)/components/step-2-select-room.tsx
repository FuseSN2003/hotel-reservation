'use client';
import { Card, CardContent } from '@/components/ui/card';
import { useContext, useEffect, useState } from 'react';
import { ReservationContext } from '@/context/ReservationContext';
import RoomCard from './room-card';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { RoomType } from '@/components/interface/RoomType';
import StepHeader from './header';

export default function Step2() {
  const { addInformation, information, state, setState } =
    useContext(ReservationContext);
  const [roomTypes, setRoomTypes] = useState([] as RoomType[]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { dateRange } = information;
  const title = 'Choose Room';
  const step = 2;
  const [disibleRoomType, setDisibleRoomType] = useState();

  //for preserve room and change room type.
  const clickHandler = async (type: any) => {
    const formData = new FormData();
    formData.append('type_id', type.type_id);
    formData.append('check_in', dateRange.from.toLocaleDateString());
    formData.append('check_out', dateRange.to.toLocaleDateString());

    if (!information.reservationId) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/guest/rooms/preserve`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const responseJson = await response.json();

      if (response.status !== 200) {
        setDisibleRoomType(type.type_id);
        alert(
          responseJson.message ||
            'Sorry last room just be purchased second ago.'
        );
        return;
      }

      const reservationId = responseJson.reservationId;

      addInformation({ reservationId });
    } else {
      formData.append('reservation_id', information.reservationId);
      formData.append('total_price', type.total_price);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/guest/rooms/change-type`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const responseJson = await response.json();

      if (response.status !== 200) {
        setDisibleRoomType(type.type_id);
        alert(
          responseJson.message ||
            'Sorry last room just be purchased second ago.'
        );
        return;
      }
    }

    addInformation({ roomType: type });

    setState(3);
  };

  useEffect(() => {
    // for retrieve data
    const getData = async () => {
      try {
        const checkIn = new Date(dateRange.from).toLocaleDateString();
        const checkOut = new Date(dateRange.to).toLocaleDateString();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/guest/rooms/vacant-rooms?check_in=${checkIn}&check_out=${checkOut}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();

        if (data.status != 'success' || data.data.length == 0) {
          setIsError(true);
          return;
        }
        setRoomTypes(data.data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
      }
    };

    if (state === 2) {
      getData();
    }
  }, []);

  return (
    <>
      {!isError && (
        <div className="flex justify-center mt-5 mb-5 w-full">
          <Card className="w-11/12 shadow-md border-primary shadow-primary m-0 md:p-8">
            <div className="p-8">
              <StepHeader title={title} step={step} />

              <h1>Stay night: {information.stayNight}</h1>
            </div>

            <CardContent className="flex justify-center m-0 pb-1 w-full">
              <div className="md:grid md:grid-cols-2 md:gap-4 w-full h-full">
                {!isLoading
                  ? roomTypes.map((type) => {
                      if (type?.type_id != disibleRoomType) {
                        return (
                          <RoomCard
                            key={type.type_id}
                            type={type}
                            clickHandler={clickHandler}
                          />
                        );
                      } else {
                        return '';
                      }
                    })
                  : Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className="w-full h-64 bg-gray-100"
                      />
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isError && (
        <div
          className="absolute top-1/2 -translate-y-1/2
                      p-4 left-1/2 -translate-x-1/2
                      flex flex-col gap-4"
        >
          <p className="text-center text-2xl">
            Sorry, there is no available room left from
            <br />
            <span className="text-primary font-bold">
              {' '}
              {format(new Date(dateRange.from), 'PPP')}
            </span>{' '}
            to
            <span className="text-primary font-bold">
              {' '}
              {format(new Date(dateRange.to), 'PPP')}
            </span>
          </p>

          <button
            onClick={() => setState(1)}
            className=" bg-primary w-full rounded-lg  hover:bg-gray-800 active:bg-gray-800
                      p-4 hover:bg-primary-hover 
                      font-bold text-white
                      border-2 border-gray-400"
          >
            {' '}
            Back to Step 1{' '}
          </button>
        </div>
      )}
    </>
  );
}
