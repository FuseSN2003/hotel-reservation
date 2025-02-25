import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import { useQuery } from '@tanstack/react-query';
interface GuestNavProps {
   scrollIntoView: (id: any) => void;
}

function GuestNav({ scrollIntoView }: GuestNavProps) {
   const [isOpen, setIsOpen] = useState(false);
   const { data } = useQuery({
      queryKey: ['current-user'],
      queryFn: async () => {
         const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-user`,
            {
               method: 'GET',
               credentials: 'include',
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            }
         );
         const data = await res.json();

         if(!data.user) {
            localStorage.removeItem('token');
            return null;
         }

         return data.user;
      },
   });

   const toggleMenu = () => {
      setIsOpen(!isOpen);
   };

   return (
      <div>
         <nav className="bg-white border-b-2 border-gray-200 dark:bg-gray-900 dark:border-gray-700 ">
            <div className="flex flex-wrap items-center justify-between mx-1 p-1">
               <a
                  href="#"
                  className="flex items-center space-x-3 rtl:space-x-reverse"
               >
                  <Image
                     src={logo}
                     alt="Mof Hotel Logo"
                     width={60}
                     height={60}
                     unoptimized
                  />
                  <span className="self-center font-bold text-2xl whitespace-nowrap dark:text-white">
                     Mof Hotel
                  </span>
               </a>
               <button
                  type="button"
                  onClick={toggleMenu}
                  className="inline-flex items-center p-2 w-10 h-10 justify-center 
                  text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  aria-controls="navbar-dropdown"
                  aria-expanded={isOpen}
               >
                  <span className="sr-only">Open main menu</span>
                  <svg
                     className="w-5 h-5"
                     aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 17 14"
                  >
                     <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h15M1 7h15M1 13h15"
                     />
                  </svg>
               </button>
               <div
                  className={`${
                     isOpen ? 'block' : 'hidden'
                  } absolute top-16 left-0 
                     w-full z-30 md:block md:w-auto md:relative md:top-0 md:left-0`}
                  id="navbar-dropdown"
               >
                  <ul
                     className="flex flex-col text-lg font-medium p-4 m-0
                  mt-2 border border-gray-100 rounded-lg bg-gray-50
                  md:flex-row md:p-4 md:mt-0 md:gap-8 md:border-0
                  
                 "
                  >
                     <li>
                        <a
                           onClick={() => {
                              scrollIntoView('about');
                              toggleMenu();
                           }}
                           className="hover:cursor-pointer font-bold block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                        >
                           About
                        </a>
                     </li>
                     <li>
                        <a
                           onClick={() => {
                              scrollIntoView('roomtype');
                              toggleMenu();
                           }}
                           className="hover:cursor-pointer font-bold block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                        >
                           Our Rooms
                        </a>
                     </li>
                     <li>
                        <a
                           onClick={() => {
                              scrollIntoView('facility');
                              toggleMenu();
                           }}
                           className="hover:cursor-pointer font-bold block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                        >
                           Facility
                        </a>
                     </li>
                     {data?.role === 'administrator' && (
                        <li>
                           <a href="/admin">Dashboard</a>
                        </li>
                     )}
                     {data?.role === 'frontdesk' && (
                        <li>
                           <a href="/frontdesk">Front Desk</a>
                        </li>
                     )}
                  </ul>
               </div>
            </div>
         </nav>
      </div>
   );
}

export default GuestNav;
