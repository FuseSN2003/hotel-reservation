import { headers } from "next/headers";
import RoomTableClient from "./RoomTableClient";
import { Room } from "@/lib/type";
import { getBackendURL } from "@/lib/getBackendURL";

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
      getBackendURL()
    }/admin/rooms?${searchParams.toString()}`,
    {
      headers: headers(),
      cache: "no-store",
    }
  );

  return res.json();
}

interface RoomTableProps {
  query: string;
  status: string;
}

export default async function RoomTable({ query, status }: RoomTableProps) {
  const result = await getRooms(query, status);

  if (result.status === "success") {
    return <RoomTableClient rooms={result.data} />;
  } else {
    return <div>{result.message}</div>;
  }
}
