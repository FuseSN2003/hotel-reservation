"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReservationContext } from "@/context/ReservationContext";
import RoomCard from "./room-card";
import { loadStripe } from "@stripe/stripe-js";
import PersonalInformationForm from "./personal-information-form";
import StepHeader from "./header";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ArrowDown } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { getBackendURL } from "@/lib/getBackendURL";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function Step4() {
  const { information} = useContext(ReservationContext);
  const [open, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const title = "Review";
  const step = 4;

  const { roomType, personalInformation, reservationId } = information;
  const { type_id: roomTypeId } = roomType;
  const { email } = personalInformation;

  const checkOut = async () => {
    setIsLoading(true);

    const stripe = await stripePromise;
    const totalPrice = roomType.total_price;

    const response = await fetch(
      `${getBackendURL()}/stripe/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomTypeId,
          totalPrice,
          personalInformation : { email },
          reservationId,
        }),
      }
    );

    await fetch(`${getBackendURL()}/guest/rooms/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservationId,
        personalInformation
      }),
    });

    const data = await response.json();
    const sessionId = data.data.session_id;

    stripe!.redirectToCheckout({ sessionId });
  };

  return (
    <>

      <div className="flex flex-col gap-8">
  
        <Card
          className="shadow-md border-primary shadow-primary
                     mt-5 p-8 mx-auto
                     w-full"
        >
          <StepHeader title={title} step={step} />
  
          <Collapsible open={open} onOpenChange={setIsOpen} className="">
            <CollapsibleTrigger asChild>
              <Button className="hover:bg-primary-hover my-4">
                {open ? (
                  <ArrowDown className="h-4" />
                ) : (
                  <ArrowUp className="h-4" />
                )}
                User information
              </Button>
            </CollapsibleTrigger>
  
            <CollapsibleContent>
              <PersonalInformationForm />
            </CollapsibleContent>
          </Collapsible>
        </Card>
  
        <RoomCard type={roomType} />
  
        <Button
          className=" bg-orange-400 w-full rounded-lg
                      hover:bg-orange-200 active:bg-gray-800
                        py-6
                        font-bold text-white"
          type="button"
          onClick={() => checkOut()}
        >
          {
            isLoading ? 
            <div className="flex items-center gap-4">
              <LoaderCircle className="animate-spin" /> 
              Redirect to payment.
            </div>: "Make Payment"
          }
        </Button>
</div>

      <div className="h-28"></div>
    </>
  );
}
