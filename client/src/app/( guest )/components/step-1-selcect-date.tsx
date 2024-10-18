"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import {  useContext, useState } from "react";
import { ReservationContext } from "@/components/context/ReservationContext";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

type Props = {
  setState: ( state : number ) => void;
}

export default function FormBooking( props : Props ) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  const { addInformation } = useContext(ReservationContext);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(e: any) {
    e.preventDefault();
    addInformation({  dateRange });
    props.setState(2);
  }

  function displayCheckInCheckOut() {
    if (dateRange.from && dateRange.to === undefined) {
      return `${format(dateRange.from, "PPP")} / Check out`;
    } else if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "PPP")} / ${format(
        dateRange.to,
        "PPP"
      )}`;
    }

    return "Check in / Check out";
  }

  return (
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            `w-full pl-3 
                          md:h-20 md:text-lg
                          rounded-none
                          rounded-t-xl
                          text-left font-normal`,
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {displayCheckInCheckOut()}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" side="top">
                      <Calendar
                        className=""
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange as SelectRangeEventHandler}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormItem>
              <Button
                className="w-full
                               md:h-20 md:text-xl 
                               rounded-t-none rounded-b-xl"
                type="submit"
              >
                Booking
              </Button>
            </FormItem>
          </form>
        </Form>
  );
}
