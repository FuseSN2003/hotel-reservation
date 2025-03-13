'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { RoomType } from '@/lib/type';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import DeleteRoomTypeModal from './DeleteRoomTypeModal';
import EditRoomTypeModal from './EditRoomTypeModal';

interface RoomTypeTableClientProps {
  roomTypes: RoomType[];
}

export default function RoomTypeTableClient({
  roomTypes,
}: RoomTypeTableClientProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Room Type</TableHead>
            <TableHead className="w-4/6">Detail</TableHead>
            <TableHead className="w-2/6">Price</TableHead>
            <TableHead className="w-2/6">Capacity</TableHead>
            <TableHead className="w-2/6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roomTypes.map((roomType) => (
            <TableRow key={roomType.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${roomType.picture_path}`}
                    alt={`${roomType.name}`}
                    className="w-48 aspect-video"
                    unoptimized
                    loading="lazy"
                  />
                </div>
              </TableCell>
              <TableCell className="break-all">
                {roomType.name}: {roomType.detail}
              </TableCell>
              <TableCell>{roomType.price}฿/night</TableCell>
              <TableCell>{roomType.capacity}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditRoomTypeModal roomType={roomType} />
                    <DeleteRoomTypeModal roomTypeId={roomType.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p>entires {roomTypes.length} types</p>
    </>
  );
}
