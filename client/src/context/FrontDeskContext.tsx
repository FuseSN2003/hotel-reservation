'use client';

import { allRooms, Room } from '@/lib/frontdesk/type';
import {
  thisYear,
  thisMonthNumber,
  arrayMonth,
  arrayYear,
  YearPerPage,
  startYear,
  dayNames,
  endYear,
} from '@/lib/frontdesk/all-date-function';
import { createContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  UseAllRoom,
  UseAllType,
  UseReservation,
} from '@/hooks/frontdesk/use-reservation';

export const FrontDesk = createContext({} as any);

export default function FrontDeskContextProvide({
  children,
}: {
  children: React.ReactNode;
}) {
  const [roomsDataSearch, setRoomsDataSearch] = useState<allRooms>();
  const [roomsDataFilter, setRoomsDataFilter] = useState<allRooms>();

  const [stateShowAll, setStateShowAll] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roomType, setRoomType] = useState('all');

  const [selectedYear, setSelectedYear] = useState(thisYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(thisMonthNumber);
  const [startYearIndex, setStartYearIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date(`${selectedYear}-${selectedMonth}-01`)
  );
  const [numberOfDays, setNumberOfDays] = useState(
    new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate()
  );

  const [daysArray, setDayArray] = useState(
    Array.from({ length: numberOfDays }, (_, i) => {
      const date = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i + 1
      );
      return dayNames[date.getDay()];
    })
  );

  const {
    data: roomsData,
    isLoading: roomsLoading,
    isError: roomsError,
  } = UseAllRoom();

  const {
    data: roomsTypeData,
    isLoading: roomsTypeLoading,
    isError: roomsTypeError,
  } = UseAllType();

  const {
    data: reservationData,
    isLoading: reservationLoading,
    isError: reservationError,
  } = UseReservation(selectedYear, selectedMonth.toString(), searchCustomer);

  const changeSelectedYear = (value: string) => {
    if (value === 'prev' || value === 'next') return;
    setSelectedYear(value);
  };

  const changeSelectedMonth = (value: any) => {
    if (value === 'prev') {
      if (selectedMonth === 1) {
        if (parseInt(selectedYear) === startYear) return;
        setSelectedYear((parseInt(selectedYear) - 1).toString());
        setSelectedMonth(12);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else if (value === 'next') {
      if (selectedMonth === 12) {
        if (parseInt(selectedYear) === endYear) return;
        setSelectedYear((parseInt(selectedYear) + 1).toString());
        setSelectedMonth(1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    } else {
      setSelectedMonth(parseInt(value));
    }
  };

  const prevYearSet = () => {
    if (startYearIndex > 0) {
      setStartYearIndex(startYearIndex - YearPerPage);
    }
  };

  const nextYearSet = () => {
    if (startYearIndex + YearPerPage < arrayYear.length) {
      setStartYearIndex(startYearIndex + YearPerPage);
    }
  };

  useEffect(() => {
    const date = new Date(`${selectedYear}-${selectedMonth}-01`);
    setSelectedDate(date);

    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    setNumberOfDays(daysInMonth);

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
      return dayNames[currentDate.getDay()];
    });
    setDayArray(days);
  }, [selectedYear, selectedMonth]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchInput === '') {
      setSearchCustomer('');
      queryClient.invalidateQueries({
        queryKey: ['reservations'],
      });
      setStateShowAll(false);
    }
  }, [searchInput]);

  const onSearch = () => {
    queryClient.invalidateQueries({
      queryKey: ['reservations'],
    });
  };

  useEffect(() => {
    if (!reservationData || !roomsData) return;
    const roomTypeFilter = Object.entries(roomsData as allRooms).map(
      ([key, value]: [string, Room[]]) => {
        if (
          reservationData?.some((reservation) => reservation.types_name === key)
        ) {
          return {
            [key]: value.filter((room: Room) => {
              return reservationData?.some(
                (reservation) => reservation.room_id === room.id
              );
            }),
          };
        }
        return { [key]: [] };
      }
    );

    const filteredRoom = roomTypeFilter.reduce(
      (acc, cur) => ({ ...acc, ...cur }),
      {}
    );
    setRoomsDataSearch(filteredRoom);
    if (searchCustomer !== '') {
      setStateShowAll(true);
    }
  }, [reservationData]);

  useEffect(() => {
    if (stateShowAll) {
      setRoomsDataFilter(roomsDataSearch);
    } else {
      setRoomsDataFilter(roomsData);
    }
  });

  return (
    <FrontDesk.Provider
      value={{
        roomType,
        setRoomType,
        roomsDataSearch,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        startYearIndex,
        setStartYearIndex,
        selectedDate,
        setSelectedDate,
        numberOfDays,
        setNumberOfDays,
        daysArray,
        setDayArray,
        changeSelectedYear,
        changeSelectedMonth,
        prevYearSet,
        nextYearSet,
        arrayMonth,
        arrayYear,
        YearPerPage,
        searchCustomer,
        setSearchCustomer,
        stateShowAll,
        setStateShowAll,
        onSearch,
        roomsDataFilter,
        setRoomsDataFilter,
        setSearchInput,
        searchInput,
        setRoomsDataSearch,
        roomsData,
        roomsLoading,
        roomsError,
        roomsTypeData,
        roomsTypeLoading,
        roomsTypeError,
        reservationData,
        reservationLoading,
        reservationError,
      }}
    >
      {children}
    </FrontDesk.Provider>
  );
}
