'use client';

import { Card } from '@/components/ui/card';

import PersonalInformationForm from './personal-information-form';
import StepHeader from './header';
import RoomCard from './room-card';
import { ReservationContext } from '@/context/ReservationContext';
import { useContext } from 'react';

export default function Step3() {
  const title = 'Personal Information';
  const { information } = useContext(ReservationContext);
  const roomType = information.roomType;

  const step = 3;

  return (
    <>
      <div className="w-full flex justify-center mt-5 mb-5">
        <Card className="w-full shadow-md border-primary shadow-primary m-0 p-8">
          <StepHeader title={title} step={step} />

          <PersonalInformationForm />
        </Card>
      </div>

      <div className="opacity-0 h-1 overflow-hidden">
        <RoomCard type={roomType} />
      </div>

      <div className="h-28"></div>
    </>
  );
}
