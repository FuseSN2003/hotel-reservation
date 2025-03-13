'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { RoomSchema, RoomValues } from '@/lib/validation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditRoomModalProps {
  roomId: string;
  roomNumber: string;
  roomTypeName: string;
}

export default function EditRoomModal({
  roomId,
  roomNumber,
  roomTypeName,
}: EditRoomModalProps) {
  const form = useForm<RoomValues>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      number: roomNumber,
      type_id: '',
    },
  });

  const [roomType, setRoomType] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEditRoom = async (values: RoomValues) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rooms/${roomId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();
      setIsLoading(false);

      if (data.status === 'success') {
        toast.success(data.message);
        router.refresh();
        setIsModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      setIsLoading(false);
      toast.error('An error occurred.');
    }
  };

  useEffect(() => {
    async function fetchTypeRoom() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/room-types`,
        {
          credentials: 'include',
        }
      );
      const data = await res.json();

      if (data.status === 'success') {
        setRoomType(data.data);
        form.setValue(
          'type_id',
          data.data.find(
            (type: { id: string; name: string }) => type.name === roomTypeName
          ).id
        );
      }
    }

    fetchTypeRoom();
  }, []);

  return (
    <>
      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="w-full max-w-xs">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Edit this room</DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => handleEditRoom(values))}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Room number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-wrap break-all">
                            <SelectValue placeholder="Room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roomType.length > 0 &&
                            roomType.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Edit'}
                </Button>
              </form>
            </Form>
            <Button
              className="w-full mt-2"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
