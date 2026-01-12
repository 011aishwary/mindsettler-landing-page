"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

// import { Doctors } from "@/constants";
import { formatDateTime } from "../../../../lib/utils";
import { Appointment } from "../../../../types/appwrite.types";
import { getPatient } from "../../../../lib/actions/patient.actions";



import { AppointmentModal } from "../../components/AppointmenModal";
import {StatusBadge} from "../../components/StatusBadge"
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
      // const patientName =await getPatient(appointment.patients);
      // const patientId = appointment.patients;
      // const pat = patientId.toString();
      // const patient = await getPatient(pat);
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
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
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
];