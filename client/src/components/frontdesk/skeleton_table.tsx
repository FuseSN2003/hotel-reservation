import React from 'react';
import { Skeleton } from '../ui/skeleton';

function Skeleton_table() {
   return (
      <div>
         <Skeleton className="mt-3 h-9 w-full rounded-xl" />

         {Array.from({ length: 9 }).map((_, i) => (
            <div className="flex flex-row gap-5">
               <div className="basis-1/5">
                  {' '}
                  <Skeleton className="mt-3 h-9 w-full rounded-xl" />
               </div>
               <div className="basis-4/5">
                  {' '}
                  <Skeleton className="mt-3 h-9 w-full rounded-xl" />
               </div>
            </div>
         ))}
      </div>
   );
}

export default Skeleton_table;
