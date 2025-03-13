'use client';

import { useQuery } from '@tanstack/react-query';
import { Reservation, allRooms } from '@/lib/frontdesk/type';

const FetchAllRooms = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/frontdesk/all-room`
  );

  const data = await res.json();
  const rooms = data.data as allRooms;
  return rooms;
};

const FetchAllType = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/frontdesk/all-room-type`
  );

  const data = await res.json();
  const roomTypes = data.data as string[];
  return roomTypes;
};

const FetchReservationData = async (
  year: string,
  month: string,
  fullname: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/frontdesk/reservations?year=${year}&month=${month}&fullname=${fullname}
      `
  );

  const data = await res.json();
  const reservations = data.data as Reservation[];
  return reservations;
};

export const UseAllRoom = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: () => FetchAllRooms(),
  });
};

export const UseAllType = () => {
  return useQuery({
    queryKey: ['roomTypes'],
    queryFn: () => FetchAllType(),
  });
};

export const UseReservation = (
  year: string,
  month: string,
  fullname: string
) => {
  return useQuery({
    queryKey: ['reservations', year, month, fullname],
    queryFn: () => FetchReservationData(year, month, fullname),
  });
};
