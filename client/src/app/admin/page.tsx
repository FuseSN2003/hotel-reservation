import { getCurrentUser } from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardContent from './DashboardContent';
import DashboardSkeleton from './DashboardSkeleton';

interface DashboardData {
  totalBooking: number;
  totalRevenue: number;
  totalGuest: number;
  availableRoom: number;
  soldOutRoom: number;
  offMarketRoom: number;
  revenuePerMonth: { month: string; sum: number }[];
}

export default async function AdminPage() {
  const { user } = await getCurrentUser();

  if (!user || user.role !== 'administrator') {
    redirect('/');
  }

  return (
    <>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
