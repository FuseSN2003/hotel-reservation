'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Room } from '@/lib/type';
import { cn, roomStatus } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DeleteRoomModal from './DeleteRoomModal';
import EditRoomModal from './EditRoomModal';
import { toast } from 'sonner';

interface RoomTableProps {
  rooms: Room[];
}

export default function RoomTableClient({ rooms }: RoomTableProps) {
  const router = useRouter();

  const handleChangeStatus = async (status: string, roomId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rooms/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: status, id: roomId }),
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (data.status === 'success') {
        router.refresh();
      }
    } catch {
      toast.error('An error occurred.');
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Room Number</TableHead>
            <TableHead className="w-1/6">Room Type</TableHead>
            <TableHead className="w-1/6">Price</TableHead>
            <TableHead className="w-1/6">Status</TableHead>
            <TableHead className="w-1/6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Image
                    src={`http://localhost:3001${
                      room.picture_path ? room.picture_path : '/'
                    }`}
                    alt={`room-number-${room.number}`}
                    unoptimized
                    className="w-32 aspect-video"
                    priority
                  />
                  <span>{room.number}</span>
                </div>
              </TableCell>
              <TableCell>{room.room_type}</TableCell>
              <TableCell>Price: {room.price}฿/night</TableCell>
              <TableCell>
                <div className="inline-flex items-center">
                  <span
                    className={cn('px-2 py-1 rounded-full text-xs', {
                      'bg-green-400 text-green-800':
                        room.current_status === 'vacant',
                      'bg-red-400 text-red-800':
                        room.current_status === 'occupied',
                      'bg-blue-400 text-blue-800':
                        room.current_status === 'maintenance',
                      'bg-slate-400 text-slate-800':
                        room.current_status === 'off_market',
                      'bg-yellow-400 text-yellow-800':
                        room.current_status === 'departing',
                    })}
                  >
                    {room.current_status.replace('_', ' ')}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {roomStatus.map((status, idx) => (
                        <DropdownMenuItem
                          onClick={() => handleChangeStatus(status, room.id)}
                          key={idx}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditRoomModal
                      roomId={room.id}
                      roomNumber={room.number}
                      roomTypeName={room.room_type}
                    />
                    <DeleteRoomModal roomId={room.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p>Entires {rooms.length} rooms</p>
    </>
  );
}
