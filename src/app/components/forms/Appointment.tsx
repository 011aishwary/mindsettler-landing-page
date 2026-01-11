"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { int, set, z } from "zod"
import Image from "next/image"
import { createUser, getPatient } from "../../../../lib/actions/patient.actions"
import { Button } from "../ui/Button"
import { Form, FormControl } from "../ui/Form"
import { Input } from "../ui/Input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { Dispatch, SetStateAction, useState } from "react"
import {getAppointmentSchema } from "../../../../lib/validation"
import { useRouter } from "next/navigation"
import { FormFeildType } from "@/app/Login/page"
import { createAppointment, updateAppointment } from "../../../../lib/actions/appointment.actions"
import { Appointment } from "../../../../types/appwrite.types"
import { Status } from "../../../../types/appwrite.types"
import { Patient } from "../../../../types/appwrite.types"
import { get } from "http"


export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
    //   primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const patient= await getPatient(userId);
        console.log("Fetched patient data:", patient.name);
        console.log("Creating appointment for patientId:", patientId);
        console.log('Raw schedule value:', values.schedule);
        console.log('Parsed date:', new Date(values.schedule)); 
        const appointment = {
          userId,
          patients:  patient.name,
          patname:patient.name,
        //   primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            // primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 relative items-center justify-center top-10 space-y-6">
        {type === "create" && (
          <section className="text-Primary-purple space-y-2 relative ">
            <h1 className="">New Appointment</h1>
            <p className="text-purple3">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>

            <CustomFormField
              fieldtype={FormFeildType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
            >
              <CustomFormField
                fieldtype={FormFeildType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual montly check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldtype={FormFeildType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldtype={FormFeildType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};


export default AppointmentForm