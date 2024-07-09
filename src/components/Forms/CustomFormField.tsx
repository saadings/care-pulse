"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldType } from "@/enums/form";
import Image from "next/image";
import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import { E164Number } from "libphonenumber-js/core";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomProps<T extends FieldValues> {
  fieldType: FieldType;
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (
    field: ControllerRenderProps<T, FieldPath<T>>,
  ) => React.ReactNode;
}

const RenderField = <T extends FieldValues>({
  field,
  props,
}: {
  field: ControllerRenderProps<T, FieldPath<T>>;
  props: CustomProps<T>;
}) => {
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    label,
    name,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
    disabled,
    children,
  } = props;

  switch (fieldType) {
    case FieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt || "icon"}
              width={24}
              height={24}
              className="ml-2"
            />
          )}

          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );

    case FieldType.TEXT_AREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="shad-textArea"
            disabled={disabled}
          />
        </FormControl>
      );

    case FieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );

    case FieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calender"
            className="ml-2"
          />

          <FormControl>
            <ReactDatePicker
              placeholderText={placeholder}
              showTimeSelect={showTimeSelect ?? false}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              timeInputLabel="Time:"
              dateFormat={dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker"
              endDate={new Date()}
            />
          </FormControl>
        </div>
      );

    case FieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue
                  placeholder={placeholder}
                  className="text-dark-500"
                />
              </SelectTrigger>
            </FormControl>

            <SelectContent className="shad-select-content">
              {children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    case FieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              className={`${field.value && "bg-green-500"}`}
            />
            <Label htmlFor={name} className="checkbox-label">
              {label}
            </Label>
          </div>
        </FormControl>
      );

    default:
      break;
  }
};

const CustomFormField = <T extends FieldValues>(props: CustomProps<T>) => {
  const { fieldType, control, name, label, placeholder, iconSrc, iconAlt } =
    props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
