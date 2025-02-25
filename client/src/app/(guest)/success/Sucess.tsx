"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface SuccessProps {
  email: string;
}

export default function Success({ email }: SuccessProps) {

  const queryClient = useQueryClient();
   useEffect(() => {
      queryClient.invalidateQueries({
         queryKey: ['rooms'],
      });
      queryClient.invalidateQueries({
         queryKey: ['reservations'],
      });
      queryClient.invalidateQueries({
         queryKey: ['roomTypes'],
      });
   });
   
  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-11/12 max-w-fit">
          <div
            className="flex flex-col
                        h-dvh
                        items-center justify-center
                        gap-8"
          >
            <Check className="w-96 h-96 text-green-400"/>
            <div className="text-center">
              <h1 className="text-xl font-bold">You are all set.</h1>
              <p>The reservation has send to your email address name <span className="font-black text-primary">{email}</span>,</p>
              <p>please check your email for more details.</p>
            </div>
            <Link href="/">
              <Button
                className=" bg-primary w-11/12 max-w-96 rounded-lg  hover:bg-gray-800 active:bg-gray-800
                            hover:bg-primary
                            my-4
                            font-bold text-white"
                type="button"
              >
                Back to booking
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
