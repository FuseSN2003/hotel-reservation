import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteEmployeeModalProps {
  employeeId: string;
}

export default function DeleteEmployeeModal({ employeeId }: DeleteEmployeeModalProps) {
  const router = useRouter();

  const handleDeleteRoom = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/employees/${employeeId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
  
      const data = await res.json();
  
      if (data.status === "success") {
        toast.success(data.message);
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("An error occurred.");
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
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDeleteRoom}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}