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
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = <T extends FieldValues>({
  field,
  props,
}: {
  field: ControllerRenderProps<T, FieldPath<T>>;
  props: CustomProps<T>;
}) => {
  const { fieldType, iconSrc, iconAlt, placeholder, label } = props;

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
