import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FormControl } from "../ui/form";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

interface CalenderFieldProps<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  dateFormat: string;
  showTimeSelect: boolean;
  timeInputLabel: string;
}

const CalenderField = <T extends FieldValues>({
  field,
  dateFormat,
  showTimeSelect,
  timeInputLabel,
}: CalenderFieldProps<T>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            className={cn(
              "w-full justify-start font-normal",
              !field.value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="-ml-2 h-[20px] w-[20px] text-[#CDE9DF]" />
            <p className="px-3">
              {field.value ? (
                format(field.value, dateFormat ?? "PPP")
              ) : (
                <span className="text-dark-600">Pick a date</span>
              )}
            </p>
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-dark-500 p-0" align="start">
        <Calendar
          initialFocus
          mode="single"
          captionLayout="dropdown-buttons" //Also: dropdown | buttons
          fromYear={1945}
          toYear={2006}
          selected={field.value}
          onSelect={field.onChange}
          // numberOfMonths={2} //Add this line, if you want, can be 2 or more
          className="rounded-md bg-dark-400"
          // showTimeSelect={showTimeSelect}
          // timeInputLabel={timeInputLabel}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalenderField;
