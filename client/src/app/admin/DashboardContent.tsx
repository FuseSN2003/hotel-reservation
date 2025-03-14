import { formatCurrency } from '@/lib/utils';
import { BedSingle, Coins, NotepadText, UserRound } from 'lucide-react';
import { headers } from 'next/headers';
import React from 'react';
import RevenueChart from './RevenueChart';

interface DashboardData {
  totalBooking: number;
  totalRevenue: number;
  totalGuest: number;
  availableRoom: number;
  soldOutRoom: number;
  offMarketRoom: number;
  revenuePerMonth: { month: string; sum: number }[];
}

async function getDashboardData(): Promise<
  | { status: 'error'; message: string }
  | {
      status: 'success';
      data: DashboardData;
    }
> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/dashboard`, {
    headers: headers(),
    cache: 'no-store',
  });

  const data = await res.json();

  return data;
}

export default async function DashboardContent() {
  const result = await getDashboardData();
  return (
    <>
      {result.status === 'success' ? (
        <div className="flex flex-col gap-8">
          <div className="w-full grid grid-cols-3 gap-10">
            <div className="flex items-center bg-background p-8 border shadow gap-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-md">
                <NotepadText size={32} />
              </div>
              <div>
                <p className="font-bold text-xl">{result.data.totalBooking}</p>
                <p>total booking</p>
              </div>
            </div>
            <div className="flex items-center bg-background p-8 border shadow gap-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-md">
                <Coins size={32} />
              </div>
              <div>
                <p className="font-bold text-xl">
                  {formatCurrency(result.data.totalRevenue)}
                </p>
                <p>total revenue</p>
              </div>
            </div>
            <div className="flex items-center bg-background p-8 border shadow gap-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-md">
                <UserRound size={32} />
              </div>
              <div>
                <p className="font-bold text-xl">{result.data.totalGuest}</p>
                <p>total guest</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-background p-4 border shadow space-y-4">
            <h2 className="text-2xl font-bold">Reservation Stats</h2>
            <RevenueChart data={result.data.revenuePerMonth} />
          </div>
          <div className="w-full bg-background p-4 border shadow space-y-4">
            <h2 className="text-2xl font-bold">Today</h2>
            <div className="grid grid-cols-3 gap-10">
              <div className="flex items-center bg-background p-8 border shadow gap-4">
                <div className="bg-primary text-primary-foreground p-2 rounded-md">
                  <BedSingle size={32} />
                </div>
                <div>
                  <p className="font-bold text-xl">
                    {result.data.availableRoom}
                  </p>
                  <p>available room</p>
                </div>
              </div>
              <div className="flex items-center bg-background p-8 border shadow gap-4">
                <div className="bg-destructive text-primary-foreground p-2 rounded-md">
                  <BedSingle size={32} />
                </div>
                <div>
                  <p className="font-bold text-xl">{result.data.soldOutRoom}</p>
                  <p>sold out room</p>
                </div>
              </div>
              <div className="flex items-center bg-background p-8 border shadow gap-4">
                <div className="bg-gray-600 text-primary-foreground p-2 rounded-md">
                  <BedSingle size={32} />
                </div>
                <div>
                  <p className="font-bold text-xl">
                    {result.data.offMarketRoom}
                  </p>
                  <p>off market</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>{result.message}</p>
      )}
    </>
  );
}
