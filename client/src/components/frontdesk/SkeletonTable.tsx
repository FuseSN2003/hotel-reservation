import React from 'react';
import { Skeleton } from '../ui/skeleton';

function SkeletonTable() {
  return (
    <div>
      <Skeleton className="mt-3 h-20 w-full rounded-xl" />

      {Array.from({ length: 5 }).map((_, i) => (
        <div className="flex flex-row gap-5" key={i}>
          <div className="basis-1/5">
            {' '}
            <Skeleton className="mt-3 h-14 w-full rounded-xl" />
          </div>
          <div className="basis-4/5">
            {' '}
            <Skeleton className="mt-3 h-14 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonTable;
