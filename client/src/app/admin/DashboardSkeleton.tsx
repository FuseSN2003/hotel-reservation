import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="w-full grid grid-cols-3 gap-10">
          <Skeleton className="p-8 h-28" />
          <Skeleton className="p-8 h-28" />
          <Skeleton className="p-8 h-28" />
        </div>
        <Skeleton className="h-[450px]" />
        <Skeleton className="h-52" />
      </div>
    </>
  );
}
