'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteRoomModalProps {
  roomTypeId: string;
}

export default function DeleteRoomTypeModal({
  roomTypeId,
}: DeleteRoomModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteRoom = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/room-types/${roomTypeId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await res.json();
      setIsLoading(false);

      if (data.status === 'success') {
        toast.success(data.message);
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch {
      setIsLoading(false);
      toast.error('An error occurred.');
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Delete
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this room type?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              disabled={isLoading}
              variant="destructive"
              onClick={handleDeleteRoom}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
