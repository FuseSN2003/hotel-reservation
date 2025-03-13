'use client';

import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <div className="text-2xl font-bold">
      {pathname.split('/')[2] !== undefined
        ? pathname.split('/')[2].toUpperCase()
        : 'DASHBOARD'}
    </div>
  );
}
