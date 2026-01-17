"use server";
import { ID, Query } from "node-appwrite";
import { formatDateTime, parseStringify } from "../utils";
import { APPOINTMENTS_COLLECTION_ID, DATABASE_ID, databases, messaging, storage } from "../appwrite.config";
import { CreateAppointmentParams, UpdateAppointmentParams } from "../../types"
import { revalidatePath } from "next/cache";
import { InputFile } from "node-appwrite/file";
import { input } from "framer-motion/client";
import fs from "fs";
import path from "path";

export const createAppointment = async ({ paymentProof, ...appointment }: CreateAppointmentParams) => {
  try {
    console.log("Creating appointment with data:", paymentProof);
    let file;
    if (paymentProof) {
      

      const buffer = Buffer.from(
        await paymentProof.arrayBuffer()
      );

      // Create Appwrite InputFile
      const inputFIle = InputFile.fromBuffer(
        buffer,
        // paymentProof[0].name,
        paymentProof.name,
        // "image/png"
      );



      // Optional: Additional check via filename extension (fallback)
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const fileExtension = inputFIle.name.toLowerCase().substring(inputFIle.name.lastIndexOf('.'));
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Invalid file extension. Only image files are allowed.');
      }
      console.log("Uploading payment proof file...", paymentProof.name);
      file = await storage.createFile(process.env.NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFIle);
      console.log("Uploaded file ID:", file.$id);
    }
    console.log("Registering appointment...", DATABASE_ID, APPOINTMENTS_COLLECTION_ID, appointment, ID.unique());
    const newAppontment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENTS_COLLECTION_ID!,
      ID.unique(),
      {
        userId: appointment.userId,
        patient: appointment.patient,
        patname: appointment.patname,
        time: appointment.time,
        // primaryPhysician: string;
        reason: appointment.reason,
        schedule: appointment.schedule,
        status: appointment.status,
        note: appointment.note,
        paymentType: appointment.paymentType,
        // paymentProof: appointment.paymentProof,
        paymentProof: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${process.env.PROJECT_ID}`
      },
      // appointment

    );
    return parseStringify(newAppontment);


  } catch (error) {
    console.log("Error registering patient:", error);
    throw error;
  }
}

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENTS_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.log("Error fetching appointment:", error);
    throw error;
  }
}

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENTS_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    // const scheduledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "scheduled");

    // const pendingAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "pending");

    // const cancelledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "cancelled");

    // const data = {
    //   totalCount: appointments.total,
    //   scheduledCount: scheduledAppointments.length,
    //   pendingCount: pendingAppointments.length,
    //   cancelledCount: cancelledAppointments.length,
    //   documents: appointments.documents,
    // };

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as any[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};

//  UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  // timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENTS_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    // const smsMessage = `Greetings from MindSettler. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} ` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.reason}`}.`;
    // await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

// GET APPOINTMENT
// export const getAppointment = async (appointmentId: string) => {
//   try {
//     const appointment = await databases.getDocument(
//       DATABASE_ID!,
//       APPOINTMENT_COLLECTION_ID!,
//       appointmentId
//     );

//     return parseStringify(appointment);
//   } catch (error) {
//     console.error(
//       "An error occurred while retrieving the existing patient:",
//       error
//     );
//   }
// }
