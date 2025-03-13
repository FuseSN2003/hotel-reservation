import ImagePlaceholder from "@/assets/image-square-placeholder.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getBackendURL } from "@/lib/getBackendURL";
import { AddRoomTypeSchema, AddRoomTypeValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddRoomTypeModal() {
  const form = useForm<AddRoomTypeValues>({
    resolver: zodResolver(AddRoomTypeSchema),
    defaultValues: {
      name: "",
      price: 0,
      capacity: 0,
      detail: "",
      image: undefined,
    },
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  const handleAddRoomType = async () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    setIsLoading(true);
    try {
      const res = await fetch(
        `${getBackendURL()}/admin/room-types`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
  
      const data = await res.json();
      setIsLoading(false);

      if (data.status === "success") {
        form.reset();
        toast.success(data.message);
        router.refresh();
        setIsModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      setIsLoading(false);
      toast.error("An error occurred.");
    }
  };

  return (
    <>
      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <DialogTrigger asChild>
          <Button>Add Room Type</Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Room Type</DialogTitle>
            <DialogDescription>Add a new room type</DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={form.handleSubmit(() => handleAddRoomType())}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <Label>{`Room's Picture`}</Label>
                  <Image
                    src={previewImage || ImagePlaceholder}
                    alt="Room type image"
                    width={0}
                    height={0}
                    className="w-full max-h-80 h-full"
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormControl>
                          <Button type="button" className="relative">
                            Choose file
                            <Input
                              {...fieldProps}
                              type="file"
                              accept="image/*"
                              className="opacity-0 absolute hover:cursor-pointer"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  onChange(file);
                                  setPreviewImage(URL.createObjectURL(file));
                                }
                              }}
                            />
                          </Button>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Type Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Type name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate / Night</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input placeholder="Capacity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="detail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Detail" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isLoading} type="submit" className="w-full">
                    {isLoading ? <Loader2 className="animate-spin"/> : "Add Room Type"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
