import { RoomType } from '@/lib/type';
import { headers } from 'next/headers';
import RoomTypeTableClient from './RoomTypeTableClient';

async function getRoomTypes(
  query: string
): Promise<
  { status: 'error'; message: string } | { status: 'success'; data: RoomType[] }
> {
  const searchParams = new URLSearchParams({
    q: query,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/room-types?${searchParams.toString()}`,
    {
      headers: headers(),
      cache: 'no-store',
    }
  );

  return res.json();
}

interface RoomTypeTableProps {
  query: string;
}

export default async function RoomTypeTable({ query }: RoomTypeTableProps) {
  const result = await getRoomTypes(query);

  if (result.status === 'success') {
    return <RoomTypeTableClient roomTypes={result.data} />;
  } else {
    return <div>{result.message}</div>;
  }
}
