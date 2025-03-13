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
import { RoomSchema, RoomValues } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AddRoomModal() {
  const form = useForm<RoomValues>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      number: '',
      type_id: '',
    },
  });

  const [roomType, setRoomType] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddRoom = async (values: RoomValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rooms`,
        {
          method: 'POST',
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
        form.reset();
        toast.success(data.message);
        router.refresh();
        setModalIsOpen(false);
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
      }
    }

    fetchTypeRoom();
  }, []);

  return (
    <>
      <Dialog onOpenChange={setModalIsOpen} open={isModalOpen}>
        <DialogTrigger asChild>
          <Button>Add Room</Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-xs">
          <DialogHeader>
            <DialogTitle>Add Room</DialogTitle>
            <DialogDescription>Add a new room</DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => handleAddRoom(values))}
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
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Add Room'
                  )}
                </Button>
              </form>
            </Form>
            <Button
              className="w-full mt-2"
              variant="outline"
              onClick={() => setModalIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
