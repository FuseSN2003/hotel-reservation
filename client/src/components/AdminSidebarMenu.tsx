"use client";

import { adminMenu } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminSidebarMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if(data.status === "success") {
        toast.success("Logged out successfully.");
        localStorage.removeItem("token");
        router.refresh();
        router.push("/");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("An error occurred.");
    }
  }

  return (
    <div className="flex flex-col gap-6 mt-20">
      {adminMenu.map((menu, idx) => (
        <Link
          className={cn(
            "text-foreground text-lg font-semibold flex items-center gap-2 hover:text-primary transition-colors", {
              "text-primary": pathname.split("/")[2] === menu.href.split("/")[2] && menu.href !== "/frontdesk",
            }
          )}
          href={menu.href}
          key={idx}
        >
          <menu.icon /> {menu.label}
        </Link>
      ))}
      <div onClick={handleLogout} className="hover:cursor-pointer text-destructive text-lg font-semibold flex items-center gap-2 hover:text-destructive transition-colors">
          <LogOut /> Logout
        </div>
    </div>
  );
}
