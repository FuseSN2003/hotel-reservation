'use client';

import { ReservationProvider } from '@/context/ReservationContext';

import { ReservationContext } from '@/context/ReservationContext';
import { removeReserveRecord } from '@/lib/delete-reserve';
import { useContext, useEffect } from 'react';
import ConclusionBar from './components/conclusion-bar';
import LandingPage from './components/landingPage';
import Step2 from './components/step-2-select-room';
import Step3 from './components/step-3-input-customer-detail';
import Step4 from './components/step-4-confimation';
import './landing.css';

export default function Page() {
   return (
      <>
         <ReservationProvider>
            <Child />
         </ReservationProvider>
      </>
   );
}

function Child() {
   const { information, state, setState } = useContext(ReservationContext);
   const { reservationId } = information;

   // 5 minutes
   const timer = 5 * 60 * 1000;

   let userTimeout = setTimeout(() => {
      if (state != 1) {
         if (reservationId) {
            removeReserveRecord(reservationId);
         }

         alert('You have been inactive for 5 minutes. Please start over.');
         setState(1);
      }
   }, timer);

   const resetTimer = () => {
      clearTimeout(userTimeout);

      userTimeout = setTimeout(() => {
         if (state != 1) {
            if (reservationId) {
               removeReserveRecord(reservationId);
            }

            alert('You have been inactive for 5 minutes. Please start over.');
            setState(1);
         }
      }, timer);
   };

   const events = ['mousemove', 'keydown'];

   events.forEach((event) => {
      if(typeof window !== "undefined") {
         window.addEventListener(event, () => {
            resetTimer();
         });
      }
   });

   useEffect(() => {
      document.documentElement.scrollTop = 0;
   }, [state]);

   return (
      <>
         {state == 1 && (
            <div id="page1">
               <LandingPage />
            </div>
         )}

         {state == 2 && (
            <div id="page2">
               <Step2 />
            </div>
         )}

         {state == 3 && (
            <div id="page3" className="w-full mx-auto max-w-fit p-4">
               <Step3 />
            </div>
         )}

         {state == 4 && (
            <div id="page4" className="w-full mx-auto max-w-fit p-4">
               <Step4 />
            </div>
         )}

         {state == 3 || state == 4 ? <ConclusionBar /> : ''}
      </>
   );
}
