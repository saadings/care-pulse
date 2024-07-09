"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { AppointmentModalType } from "@/enums/modal";
import AppointmentForm from "./Forms/AppointmentForm";
import { Appointment } from "@/types/appwrite";
import { FormType } from "@/enums/form";

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
}: {
  type: FormType;
  patientId: string;
  userId: string;
  appointment?: Appointment;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          // asChild
          className={cn(
            "capitalize",
            type === FormType.SCHEDULE && "text-green-500",
            type === FormType.CANCEL && "text-red-500",
          )}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} the appointment.
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          patientId={patientId}
          userId={userId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
