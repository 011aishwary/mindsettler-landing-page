"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { any, email, int, set, z } from "zod"
import Image from "next/image"
import { createUser, getPatient } from "../../../../lib/actions/patient.actions"
// import { Button } from "../ui/Button"
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
import { toast } from "../../../../hooks/use-toast"
import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, sub } from "date-fns";
import { CalendarDays, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { BookingCalendar } from "../BookingCalendar";
import { TimeSlotPicker } from "../TimeSlotPicker";
import { BookingForm } from "../BookingForm";
import { BookingSummary } from "../BookingSummary";
import { Button } from "../ui/button1";
import { time } from "console"
// import { toast } from "../../../hooks/use-toast";

interface FormData {
    fullName: string;
    email: string;
    reason: string;
    notes: string;
}
interface Appointments {
    id: string;
    date: string;
    time: string;
    fullName: string;
    email: string;
    reason: string;
    notes: string;
}
const MOCK_BOOKED_APPOINTMENTS: Appointments[] = [
    { id: "1", date: "2026-01-15", time: "09:00", fullName: "John Doe", email: "john@example.com", reason: "Checkup", notes: "" },
    { id: "2", date: "2026-01-15", time: "10:30", fullName: "Jane Smith", email: "jane@example.com", reason: "Follow-up", notes: "" },
    { id: "3", date: "2026-01-16", time: "14:00", fullName: "Bob Wilson", email: "bob@example.com", reason: "Consultation", notes: "" },
];

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
    // const [isLoading, setIsLoading] = useState(false);
    const [paymentType, setPaymentType] = useState("Offline")
    const [proof, setProof] = useState<File | null>(null);
    const pathname = usePathname();

    const isAdminRoute = pathname.startsWith("/admin");


    const AppointmentFormValidation = getAppointmentSchema(type);
    // new ones 
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        reason: "",
        notes: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    // Fetch booked appointments on mount
    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            try {
                // Simulate API call - replace with actual Appwrite/Supabase fetch
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // setAppointments(MOCK_BOOKED_APPOINTMENTS);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
                toast({
                    title: "Error",
                    description: "Failed to load appointments. Please refresh the page.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // Get booked dates for calendar
    const bookedDates = useMemo(() => {
        return appointments.map((apt) => apt.date);
    }, [appointments]);

    // Get booked time slots for selected date
    const bookedSlots = useMemo(() => {
        if (!selectedDate) return [];
        const dateString = format(selectedDate, "yyyy-MM-dd");
        return appointments
            .filter((apt) => apt.date === dateString)
            .map((apt) => apt.time);
    }, [selectedDate, appointments]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
    };

    const handleFormChange = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        // Clear errors for changed fields
        Object.keys(data).forEach((key) => {
            setErrors((prev) => ({ ...prev, [key]: undefined }));
        });
    };

  
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({

        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            //   primaryPhysician: appointment ? appointment?.primaryPhysician : "",
            schedule: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
            time: selectedTime ? selectedTime : "",
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
        console.log("Form default values:", form.getValues());
        if ((!selectedDate || !selectedTime) && type == "create") {
            toast({
                title: "Error",
                description: "Please select a date and time for the appointment.",
                variant: "destructive",
            });
            return;
        }

        console.log("Uploading payment proof:", values.paymentProof?.[0]);

        // let formData;

        // console.log("Payment proof set in state:", proof);
        setIsSubmitting(true);
        setSubmitStatus("idle");

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
                // console.log('Parsed date:', new Date(values.schedule));
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
                    schedule: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
                    time: selectedTime || "",
                    reason: values.reason!,
                    status: status as Status,
                    note: values.note,
                    paymentType: paymentType,
                    paymentProof: values.paymentProof ? values.paymentProof[0] : undefined,
                };
                // setAppointments((prev) => [...prev, appointment]);
                setSubmitStatus("success");
                toast({
                    title: "Appointment Booked!",
                    description: `Your appointment on ${selectedDate ? format(selectedDate, "MMMM d, yyyy") : "selected date"} at ${selectedTime || "selected time"} has been confirmed.`,
                });
                setTimeout(() => {
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setSubmitStatus("idle");
                }, 2000);


                const newAppointment = await createAppointment(appointment);

                if (newAppointment) {
                    form.reset();
                    try {
                        console.log("Attempting to send email notification...", type);
                        const patientData = await getPatient(userId);
                        console.log("Fetched patient data for email:", patientData);
                        const email = patientData.email;
                        const date = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
                        const time = selectedTime || "";
                        const mode = paymentType;
                        const name = patientData.name;
                        const mailData = { "email": email, "name": name, "date": date, "time": time, "mode": mode , status: type};
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
                    router.push(
                        `/patient/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
                    );
                }
            }
            else {
                if (!appointment) {
                    console.error("No appointment provided for update");
                    return;
                }

                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        schedule: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
                        time: selectedTime || "",
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                        reason: values.reason,
                        note: values.note,
                    },
                    type,
                    // timeZone: "UTC",
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
                    const date = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
                    const time = selectedTime || "";
                    const mode = paymentType;
                    const name = patientData.name;
                    const mailData = { "email": email, "name": name, "date": date, "time": time, "mode": mode , status: type};
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 relative h-[90vh] overflow-scroll justify-center top-10 space-y-6">
                {/* {type === "create" && (
                    <section className="text-Primary-purple space-y-2 relative ">
                        <h1 className="">New Appointment</h1>
                        <p className="text-purple3">
                            Request a new appointment in 10 seconds.
                        </p>
                    </section>
                )} */}

                {type !== "cancel" && (
                    <>
                        <div className="">
                            <div className="min-h-screen  gradient-surface py-8 px-4 sm:px-6 lg:px-8">
                                <div className="max-w-screen mx-auto">
                                    {/* Header */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`text-center ${isAdminRoute ? "hidden" : "inline"} mb-8`}
                                    >
                                        <div className="inline-flex items-center justify-center w-full h-16 rounded-2xl gradient-primary  shadow-primary mb-4">
                                            <CalendarDays className="w-8 h-8 text-Primary-purple text-center" />
                                        </div>
                                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                            Book Your Appointment
                                        </h1>
                                        <p className="text-muted-foreground max-w-md mx-auto">
                                            Select a convenient date and time for your visit. We'll confirm your booking via email.
                                        </p>
                                    </motion.div>

                                    {/* Main Content Grid */}
                                    <div className={`max-md:flex-col flex justify-center max-lg:  md:flex max-md:items-center  ${isAdminRoute ? "" : "w-screen"} mx-auto relative lg:gap-20 gap-6`}>
                                        {/* Calendar Section */}
                                        <div className="w-[30vw] max-md:w-[60vw] relative">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}

                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="lg:col-span-2 gradient-card  rounded-2xl p-6  shadow-card border border-border/50 relative"
                                            >
                                                <BookingCalendar
                                                    selectedDate={selectedDate}
                                                    onSelectDate={handleDateSelect}
                                                    bookedDates={bookedDates}
                                                    isLoading={isLoading}
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Time Slots Section */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="gradient-card rounded-2xl p-6 w-[30vw] max-md:w-[60vw]  relative shadow-card border border-border/50"
                                        >
                                            <TimeSlotPicker
                                                selectedTime={selectedTime}
                                                onSelectTime={setSelectedTime}
                                                bookedSlots={bookedSlots}
                                                selectedDate={selectedDate}
                                                isLoading={isLoading}
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Form & Summary Section */}
                                    <div className="flex justify-center relative  self-center gap-6 mt-6">


                                        {/* Summary & Submit */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="space-y-4 w-[60vw] max-md:w-[60vw] "
                                        >
                                            <AnimatePresence mode="wait">
                                                <BookingSummary
                                                    selectedDate={selectedDate}
                                                    selectedTime={selectedTime}
                                                    fullName={formData.fullName}
                                                    email={formData.email}
                                                    reason={formData.reason}
                                                />
                                            </AnimatePresence>
                                            <div
                                                className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
                                            >
                                                <CustomFormField
                                                    fieldtype={FormFeildType.TEXTAREA}
                                                    control={form.control}
                                                    name="reason"
                                                    label="Appointment reason *"
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
                                                        label="Payment Type *"
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
                                                        label="Upload the screenshot of payment proof *"
                                                        renderSkeleton={(field) => (
                                                            <FormControl>
                                                                <FileUploader files={field.value} onChange={field.onChange} />
                                                            </FormControl>

                                                        )}
                                                    />
                                                </div>)}


                                            {/* Submit Button */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <Button
                                                    // onClick={handleSubmit}
                                                    // disabled={!isFormValid || isSubmitting}
                                                    className={`w-full h-14 rounded-xl text-base font-semibold transition-all duration-300 ${submitStatus === "success"
                                                        ? "bg-success hover:bg-success text-success-foreground"
                                                        : "gradient-primary hover:opacity-90 text-primary-foreground shadow-primary"
                                                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {isSubmitting ? (
                                                            <motion.div
                                                                key="loading"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                                Booking...
                                                            </motion.div>
                                                        ) : submitStatus === "success" ? (
                                                            <motion.div
                                                                key="success"
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <CheckCircle className="w-5 h-5" />
                                                                Appointment Confirmed!
                                                            </motion.div>
                                                        ) : submitStatus === "error" ? (
                                                            <motion.div
                                                                key="error"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <AlertCircle className="w-5 h-5" />
                                                                Try Again
                                                            </motion.div>
                                                        ) : (
                                                            <motion.span
                                                                key="default"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                            >
                                                                {buttonLabel}
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </Button>

                                                {/* {!isFormValid && (
                                                    <p className="text-xs text-muted-foreground text-center mt-2">
                                                        Please select a date, time, and fill in required fields
                                                    </p>
                                                )} */}
                                            </motion.div>
                                        </motion.div>
                                    </div>

                                    {/* Footer Note */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="text-center text-sm text-muted-foreground mt-8"
                                    >
                                        Need to reschedule? Contact us at{" "}
                                        <a href="mailto:support@example.com" className="text-primary hover:underline">
                                            support@example.com
                                        </a>
                                    </motion.p>
                                </div>
                            </div>
                        </div>




                    </>
                )}

                {type === "cancel" && (
                    <>
                        <CustomFormField
                            fieldtype={FormFeildType.TEXTAREA}
                            control={form.control}
                            name="cancellationReason"
                            label="Reason for cancellation"
                            placeholder="Urgent meeting came up"
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                type="submit"
                                onClick={() => console.log("Cancel Appointment clicked")}
                                // disabled={!isFormValid || isSubmitting}
                                className={`w-full h-14 rounded-xl text-base font-semibold transition-all duration-300 ${submitStatus === "success"
                                    ? "bg-success hover:bg-success text-success-foreground"
                                    : "gradient-primary hover:opacity-90 text-primary-foreground shadow-primary"
                                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
                            >
                                <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Booking...
                                        </motion.div>
                                    ) : submitStatus === "success" ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Appointment Confirmed!
                                        </motion.div>
                                    ) : submitStatus === "error" ? (
                                        <motion.div
                                            key="error"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <AlertCircle className="w-5 h-5" />
                                            Try Again
                                        </motion.div>
                                    ) : (
                                        <motion.span
                                            key="default"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {buttonLabel}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Button>

                            {/* {!isFormValid && (
                                                    <p className="text-xs text-muted-foreground text-center mt-2">
                                                        Please select a date, time, and fill in required fields
                                                    </p>
                                                )} */}
                        </motion.div>


                    </>
                )}

            </form>
        </Form>
    );
};


export default AppointmentForm