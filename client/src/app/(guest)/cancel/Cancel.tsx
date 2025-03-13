'use client';

import { Button } from '@/components/ui/button';
import { removeReserveRecord } from '@/lib/delete-reserve';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface CancelProps {
  reservationId: string;
}

export default function Cancel({ reservationId }: CancelProps) {
  const customerServiceEmail = 'mokmaard646@gmail.com';

  useEffect(() => {
    if (reservationId) {
      removeReserveRecord(reservationId);
    }
  }, []);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-11/12 max-w-fit">
          <div
            className="flex flex-col
                          h-dvh
                          items-center justify-center
                          gap-8"
          >
            <X className="w-96 h-96 text-red-400" />
            <div className="text-center">
              <h1 className="text-xl font-bold">
                Your reservation is already canceled.
              </h1>
              <p>
                Any problem please contact:{' '}
                <a
                  href={`mailto:${customerServiceEmail}`}
                  className="underline text-primary font-black"
                >
                  Customer Service Email.
                </a>
                .
              </p>
            </div>
            <Link href="/">
              <Button
                className=" bg-primary max-w-96 w-11/12 rounded-lg  hover:bg-gray-800 active:bg-gray-800
                            hover:bg-primary
                            my-4
                            font-bold text-white"
                type="button"
              >
                Back to booking
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
