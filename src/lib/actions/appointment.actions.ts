"use server";

import { ID, Models, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite";
import { revalidatePath } from "next/cache";
import { FormType } from "@/enums/form";

export const createAppointment = async (
  appointment: CreateAppointmentParams,
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      ID.unique(),
      appointment,
    );

    return parseStringify<Models.Document>(newAppointment);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId,
    );

    return parseStringify<Models.Document>(appointment);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      [Query.orderDesc("$createdAt")],
    );

    const initialCount = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount += 1;
            break;
          case "pending":
            acc.pendingCount += 1;
            break;
          case "cancelled":
            acc.cancelledCount += 1;
            break;

          default:
            break;
        }

        return acc;
      },
      initialCount,
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify<{
      documents: Models.Document[];
      scheduledCount: number;
      pendingCount: number;
      cancelledCount: number;
      totalCount: number;
    }>(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId,
      appointment,
    );

    if (!updatedAppointment) throw new Error("Appointment not found");

    const smsMessage = `Hi, its CarePulse.
      ${type === FormType.SCHEDULE ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`}.
    `;

    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");

    return parseStringify<Models.Document>(updatedAppointment);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId],
    );

    return parseStringify<Models.Message>(message);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
