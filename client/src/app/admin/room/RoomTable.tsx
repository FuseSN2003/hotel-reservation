import { headers } from "next/headers";
import RoomTableClient from "./RoomTableClient";
import { Room } from "@/lib/type";

async function getRooms(
  query: string,
  status: string
): Promise<
  { status: "error"; message: string } | { status: "success"; data: Room[] }
> {
  const searchParams = new URLSearchParams({
    q: query,
    status: status.replace(/\s+/g, '_'),
  });
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/admin/rooms?${searchParams.toString()}`,
    {
      headers: headers(),
    }
  );

  return res.json();
}

interface RoomTableProps {
  query: string;
  status: string;
}

export default async function RoomTable({ query, status }: RoomTableProps) {
  const data = await getRooms(query, status);

  if (data.status === "success") {
    return <RoomTableClient rooms={data.data} />;
  } else {
    return <div>{data.message}</div>;
  }
}
