import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordMatchSchema, PasswordMatchValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ResetPasswordModalProps {
  employeeId: string;
}

export default function ResetPasswordModal({ employeeId }: ResetPasswordModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<PasswordMatchValues>({
    resolver: zodResolver(PasswordMatchSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    }
  })

  const handleResetPassword = async (values: PasswordMatchValues) => {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/reset-password/${employeeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      })
  
      const data = await res.json();
  
      if(data.status === "success") {
        form.reset();
        toast.success(data.message);
        setIsModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("An error occurred.")
    }
  }

  return (
    <>
      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Reset Password</DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              reset password
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => handleResetPassword(values))}
                className="flex flex-col gap-4"
              >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label>New password</Label>
                        <FormControl>
                          <Input placeholder="New password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Confirm new password</Label>
                        <FormControl>
                          <Input placeholder="Confirm new password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit">
                    Reset Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
