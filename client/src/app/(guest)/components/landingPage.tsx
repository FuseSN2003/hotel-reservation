import GuestNav from '@/components/guest/GuestNavbar';
import React from 'react';
import Image from 'next/image';
import landingpic from '@/assets/landingpic.jpg';
import pool from '@/assets/pool.jpg';
import fitness from '@/assets/fitness.jpg';
import spa from '@/assets/spa.jpg';
import rooftop from '@/assets/rooftop.jpg';
import Step1 from './step-1-select-date';
import { RoomTypeCarousel } from './roomtype-carousel';
import GuestFooter from '@/components/guest/GuestFooter';
import { UseAllRoomTypes } from '@/hooks/guest/room-types';
import { FacilityCard } from './facility-card';

function LandingPage() {
  const { data, isLoading, isError } = UseAllRoomTypes();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <main>
      {' '}
      <header>
        <GuestNav scrollIntoView={scrollToSection} />
      </header>
      <section>
        <div className="w-full relative h-80 md:h-96">
          <Image
            src={landingpic}
            layout="fill"
            className="object-cover fade-transparent"
            alt={`Picture of Landing Page`}
          />
        </div>
        <div
          className="md:w-96 w-3/4
                relative 
                top-1/2 -translate-y-1/2
                left-1/2 -translate-x-1/2"
          id="reservation"
        >
          <Step1 />
        </div>
        <article className="w-full" id="about">
          <h1 className="text-3xl text-center font-bold lg:-mt-6">
            Welcome To Mof Hotel
          </h1>
          <p
            className="indent-8
                    text-lg
                    font-light
                    mx-4
                    mt-6"
          >
            {' '}
            is where comfort meets true relaxation! Inspired by the friendship
            of Mok, Ohm, and Fiw, Mof Hotel blends warmth and modern
            convenience, creating a space that feels like home. Located in the
            heart of the city, enjoy stylish rooms, delectable dining, and
            dedicated service from our friendly team. Become part of the Mof
            Hotel family and make unforgettable memories with us.
          </p>
        </article>
      </section>
      <section id="roomtype">
        <h1 className="text-3xl mb-4 mt-8 text-center font-bold">
          {'Our Rooms'}
        </h1>
        <div className="flex w-full justify-center pr-10 pl-10 items-center">
          {' '}
          <RoomTypeCarousel allroomtypes={data} />
        </div>
      </section>
      <section>
        <div className="mt-10  mx-4">
          <h1 className="text-3xl mb-4 text-center font-bold">
            {'Facilities'}
          </h1>
          <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-2 lg:grid-cols-4">
            <div className="col md:h-80" id="facility">
              <FacilityCard
                picture={pool}
                heading="Swimming Pool"
                description="Dive into relaxation at our crystal-clear pool, surrounded by stunning views and lush landscapes. The perfect spot for unwinding under the sun or enjoying a refreshing evening swim."
                direction="left"
              />
            </div>
            <div className="col  md:h-80">
              <FacilityCard
                picture={fitness}
                heading="Fitness Center"
                description="Stay active with our state-of-the-art fitness center, free weights, and space for yoga or stretching. Whether you're a fitness enthusiast or just looking for a quick workout, we've got you covered."
                direction="right"
              />
            </div>
            <div className="col  md:h-80">
              <FacilityCard
                picture={spa}
                heading="Spa and Wellness Center"
                description="Indulge in a rejuvenating experience at our spa, offering a variety of treatments to relax your mind and body. help you unwind and refresh."
                direction="left"
              />
            </div>
            <div className="col  md:h-80">
              <FacilityCard
                picture={rooftop}
                heading="Rooftop Lounge"
                description="Enjoy stunning panoramic views from our rooftop lounge. This cozy spot is ideal for sunset cocktails, stargazing, or simply unwinding with your favorite drink under the open sky."
                direction="right"
              />
            </div>
          </div>
        </div>

        <div className="flex my-3 lg:my-6 justify-center w-full">
          <button
            onClick={() => scrollToSection('reservation')}
            className="w-9/12 bg-blue-500 font-bold text-white p-2 rounded-lg mx-4
                  lg:w-96 lg:py-4 lg:text-lg"
          >
            Book Now!
          </button>
        </div>
      </section>
      <footer>
        {' '}
        <GuestFooter />
      </footer>
    </main>
  );
}

export default LandingPage;
