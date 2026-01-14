"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { any, email, int, set, z } from "zod"
import Image from "next/image"
import { createUser, getPatient } from "../../../../lib/actions/patient.actions"
import { Button } from "../ui/Button"
import { Form, FormControl } from "../ui/Form"

import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { Dispatch, SetStateAction, useState } from "react"
import { getAppointmentSchema } from "../../../../lib/validation"
import { useRouter } from "next/navigation"
import { FormFeildType } from "@/app/Signup/page"
import { createAppointment, updateAppointment } from "../../../../lib/actions/appointment.actions"
import { Appointment } from "../../../../types/appwrite.types"
import { Status } from "../../../../types/appwrite.types"

import sendMail from "../MailSender"

import { SelectItem } from "../ui/select"
import FileUploader from "../ui/FileUploader"
import { useQRCode } from "next-qrcode";
import GoogleCalendarButton from "../GoogleCalendarButton"
import { usePathname } from "next/navigation"
import { AppointmentBooking } from "../AppointmentBooking"


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
  const { Canvas } = useQRCode();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("Offline")
  const [proof, setProof] = useState<File | null>(null);
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");


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
      paymentType: "Offline",
      paymentProof: undefined,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    console.log("Uploading payment proof:", values.paymentProof?.[0]);

    // let formData;

    // console.log("Payment proof set in state:", proof);

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
        // const field = await setProof(values.paymentProof?.[0] || null );
        const patient = await getPatient(userId);
        console.log("Fetched patient data:", proof);
        console.log("Creating appointment for patientId:", patientId);
        console.log('Raw schedule value:', values.schedule);
        console.log('Parsed date:', new Date(values.schedule));
        // console.log('file type:', formData);  // Removed: formData no longer exists  
        if ('paymentProof' in values && values.paymentProof) {
          // console.log('Payment proof file:', values.paymentProof[0]?.name);  // Example: Log file name if present
        }
        // const paymentFormData = new FormData();

        const appointment = {
          ...values,
          userId,
          patient: patientId,
          patname: patient.name,
          //   primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
          paymentType: paymentType,
          paymentProof: values.paymentProof ? values.paymentProof[0] : undefined,

        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patient/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      }
      else {

        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
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
        try {
          const patientData = await getPatient(userId);
          console.log("Fetched patient data for email:", patientData);
          const email = patientData.email;
          const dateObj = new Date(values.schedule);
          const date = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          const name = patientData.name;
          const mailData = { "email": email, "name": name, "date": date, "time": "10:30 AM", "mode": "Offline" };
          console.log("Mail data prepared:", mailData);
          const result = await sendMail(mailData);
          if (result.success) {
            console.log('Mail sent successfully!');
            // Add success logic, e.g., show a success message or redirect
          } else {
            console.error('Failed to send mail:', result.message);
            // Add error logic, e.g., show an error message
          }
        } catch (error) {
          console.error('Unexpected error:', error);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 relative h-[90vh] overflow-scroll items-center justify-center top-10 space-y-6">
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
          
            {/* 
            <CustomFormField
              fieldtype={FormFeildType.DATE_TIME_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="dd/mm/yyyy  -  h:mm aa"
            /> */}
            <div className="">
              <AppointmentBooking />
            </div>

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
            {!isAdminRoute && (

              <div className={` `}>


                <CustomFormField
                  fieldtype={FormFeildType.SELECT}
                  control={form.control}
                  name="paymentType"
                  label="Payment Type"
                  placeholder="Offline/Online"
                // iconSrc="/assets/id-card.svg"
                // iconAlt="id"
                >
                  {["Offline", "Online"].map((idType, i) =>
                  (
                    <SelectItem key={idType + i} value={idType} className="text-purple3 flex cursor-pointer items-center gap-2 relative !important" onClick={() => setPaymentType(idType)}>


                      {idType}

                    </SelectItem>
                  ))}
                </CustomFormField>

                {paymentType && (
                  <div className="flex flex-col gap-4 text-center items-center justify-center w-full">
                    <h3 className="text-purple3">Pay the fees <span className="font-bold" >1000 </span> Rupees to schedule Appointmen</h3>
                    <Canvas
                      text={'upi://pay?pa=8795157597@axl&pn=Aishwary%20%20Gupta&am=1.00&cu=INR&tn=PAYMENT_NOTE'} // The data/url you want to encode
                      options={{
                        level: 'M',
                        margin: 3,
                        scale: 4,
                        width: 200,
                        color: {
                          dark: '#29153f', // MindSettler Primary Color
                          light: '#ffffff', // Background Color
                        },
                      }}
                    />

                  </div>
                )}

                <CustomFormField
                  fieldtype={FormFeildType.SKELETON}
                  control={form.control}
                  name="paymentProof"
                  label="Upload the screenshot of payment proof"
                  renderSkeleton={(field) => (
                    <FormControl>
                      <FileUploader files={field.value} onChange={field.onChange} />
                    </FormControl>

                  )}
                />
              </div>)}

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