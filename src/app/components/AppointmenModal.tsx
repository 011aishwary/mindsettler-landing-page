"use client";

import { useState } from "react";

import { Button } from "../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Appointment } from "../../../types/appwrite.types";

import AppointmentForm from "./forms/NewAppointment";

import "react-datepicker/dist/react-datepicker.css";

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
  
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-dark-500 flex-col items-center my-auto pb-8 md:scale-75  text-center mx-auto w-full sm:text-center text-Primary-purple sm:max-w-4xl">
        <DialogHeader className="mb space-y-3 ">
          <DialogTitle className="capitalize md:text-3xl">{type} Appointment</DialogTitle>
          <DialogDescription className="md:text-xl">
            Please fill in the following details to {type} appointment
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};