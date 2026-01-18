"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { formatDateTime } from "../../../../lib/utils";
import { Appointment, DiaryEntry, ContactMessage } from "../../../../types/appwrite.types";
import { getPatient } from "../../../../lib/actions/patient.actions";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button1";

import { AppointmentModal } from "../../components/AppointmenModal";
import { PatientDiaryModal } from "../PatientDiaryModal";
import {StatusBadge} from "../../components/StatusBadge"
import Link from "next/link";
const fetchPatient = async (userId: string): Promise<string> => {
  try {
    const patient = await getPatient(userId);
    return patient.$id;
  } catch (error) {
    console.error("Error fetching patient name:", error);
    return "Unknown Patient";
  }
}

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell:  ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.patname}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <span className="flex min-w-[100px] gap-1">

          {formatDateTime(appointment.schedule).dateOnly}
        <p className="text-14-regular ">
          {appointment.time}
        </p>
        </span>
      );
    },
  },
  {
    accessorKey: "diary",
    header: "Detail",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <PatientDiaryModal 
          userId={appointment.userId} 
          patientName={appointment.patname} 
        />
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.patient}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "paymentProof",
    header: "Payment Proof",
    cell: ({ row }) => {
      const appointment = row.original;
      return(
        
        <Link href={`${appointment.paymentProof?.toString()}&mode=admin`} target="_blank" >

        
        <p className="text-14-regular bg-gradient-sky px-2 text text-center py-2 rounded-xl ">Proof Image</p>
        </Link>
      ) 
    },

  }
  
];

export const diaryColumns: ColumnDef<DiaryEntry>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <p className="text-14-medium">{row.original.title}</p>,
  },
  {
    accessorKey: "entry_date",
    header: "Date",
    cell: ({ row }) => (
      <p className="text-14-medium">{formatDateTime(row.original.entry_date).dateTime}</p>
    ),
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const entry = row.original;
      if (entry.privacy === "shared") {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="shad-primary-btn">View Content</Button>
            </DialogTrigger>
            <DialogContent className="shad-dialog sm:max-w-md bg-black/30 border-dark-500 text-black">
              <DialogHeader>
                <DialogTitle className="text-18-bold bg-Primary-purple">{entry.title}</DialogTitle>
                <DialogDescription className="text-14-regular text-black">
                  Shared on {formatDateTime(entry.entry_date).dateTime}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 p-4 rounded-md bg-black/40 max-h-[60vh] overflow-y-auto">
                <p className="whitespace-pre-wrap text-16-regular text-black">{entry.content}</p>
              </div>
            </DialogContent>
          </Dialog>
        );
      }
      return null;
    },
  },
];

export const contactColumns: ColumnDef<ContactMessage>[] = [
  {
    header: "Date",
    cell: ({ row }) => (
      <p className="text-14-medium">{formatDateTime(row.original.$createdAt).dateTime}</p>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <p className="text-14-medium">{row.original.name}</p>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <p className="text-14-medium">{row.original.email}</p>,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const msg = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-xs h-8 px-2 border-primary-500 text-Primary-purple hover:bg-primary-500 hover:text-Primary-pink">View Message</Button>
          </DialogTrigger>
          <DialogContent className="shad-dialog sm:max-w-md !bg-white !border-gray-200 !text-black">
            <DialogHeader>
              <DialogTitle className="text-18-bold !text-black">Message from {msg.name}</DialogTitle>
              <DialogDescription className="text-14-regular !text-gray-600">
                Received on {formatDateTime(msg.$createdAt).dateTime}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 p-4 rounded-md !bg-gray-50 max-h-[60vh] overflow-y-auto !border !border-gray-200">
              <p className="whitespace-pre-wrap text-16-regular !text-gray-800">{msg.message}</p>
              <div className="mt-4 pt-4 border-t !border-gray-200">
                <p className="text-12-regular !text-gray-500">Response Email: {msg.email}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];