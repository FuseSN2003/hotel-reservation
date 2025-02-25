"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { roomStatus } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { SearchInput } from "../SearchInput";
import AddRoomModal from "./AddRoomModal";
import AddRoomTypeModal from "./AddRoomTypeModal";

export function RoomTopSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleFilterStatus = (status: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("status", status);

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-between">
      <SearchInput placeholder="Room number"/>
      <div className="flex gap-2">
        <AddRoomModal />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter status <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {roomStatus.map((status, idx) => (
              <DropdownMenuCheckboxItem
                onClick={() => handleFilterStatus(status)}
                key={idx}
                checked={
                  searchParams.has("status") &&
                  searchParams.get("status") === status
                }
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function RoomTypeTopSection() {
  return (
    <div className="flex justify-between">
      <SearchInput placeholder="Room type"/>
      <div className="flex gap-2">
        <AddRoomTypeModal />
      </div>
    </div>
  );
}
