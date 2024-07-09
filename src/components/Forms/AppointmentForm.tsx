"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Doctors } from "@/constants";
import { FieldType, FormType } from "@/enums/form";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { cn } from "@/lib/utils";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectItem } from "../ui/select";
import { useToast } from "../ui/use-toast";
import CustomFormField from "./CustomFormField";
import SubmitButton from "./SubmitButton";

interface AppointmentFormProps {
  userId: string;
  patientId: string;
  type: FormType;
  appointment?: Appointment;
  setOpen: (open: boolean) => void;
}

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: AppointmentFormProps) => {
  const formSchema = getAppointmentSchema(type);
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment?.reason : "",
      note: appointment?.note || "",
      cancellationReason: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case FormType.SCHEDULE:
        status = "scheduled";
        break;

      case FormType.CANCEL:
        status = "cancelled";
        break;

      default:
        status = "pending";
        break;
    }

    try {
      if (type === FormType.CREATE && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason as string,
          note: values.note,
          status: status as Status,
        };

        const appointment = await createAppointment(appointmentData);

        toast({
          title: "Appointment created successfully.",
          description: "Your appointment has been created.",
        });

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`,
          );
        }
      } else {
        const appointmentUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }

        toast({
          title: "Appointment updated successfully.",
          description: "Your appointment has been updated.",
        });
      }
    } catch (error) {
      console.error(error);

      toast({
        title: "An error occurred.",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  let buttonLabel;

  switch (type) {
    case FormType.CANCEL:
      buttonLabel = "Cancel Appointment";
      break;

    case FormType.CREATE:
      buttonLabel = "Create Appointment";
      break;

    case FormType.SCHEDULE:
      buttonLabel = "Schedule Appointment";
      break;

    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type == FormType.CREATE && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}
        {type !== FormType.CANCEL && (
          <>
            <CustomFormField
              fieldType={FieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map(({ name, image }) => (
                <SelectItem
                  key={name}
                  value={name}
                  className="hover:bg-dark-500"
                >
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={image}
                      alt={name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />

                    <p>{name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              placeholder="Select a date"
              showTimeSelect
              dateFormat="MMMM/dd/yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FieldType.TEXT_AREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />

              <CustomFormField
                fieldType={FieldType.TEXT_AREA}
                control={form.control}
                name="note"
                label="Note"
                placeholder="Enter note"
              />
            </div>
          </>
        )}

        {type === FormType.CANCEL && (
          <CustomFormField
            fieldType={FieldType.TEXT_AREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={cn(
            type === FormType.CANCEL ? "shad-danger-btn" : "shad-primary-btn",
            "w-full",
          )}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
