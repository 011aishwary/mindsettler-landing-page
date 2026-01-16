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
import { createAppointment, getRecentAppointmentList, updateAppointment } from "../../../../lib/actions/appointment.actions"
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
import GradientQRCode from "../Qrcodegenerator"
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
// const MOCK_BOOKED_APPOINTMENTS: Appointments[] = [
//     { id: "1", date: "2026-01-15", time: "09:00", fullName: "John Doe", email: "john@example.com", reason: "Checkup", notes: "" },
//     { id: "2", date: "2026-01-15", time: "10:30", fullName: "Jane Smith", email: "jane@example.com", reason: "Follow-up", notes: "" },
//     { id: "3", date: "2026-01-16", time: "14:00", fullName: "Bob Wilson", email: "bob@example.com", reason: "Consultation", notes: "" },
// ];

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
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    // Fetch booked appointments on mount
    // useEffect(() => {
    //     const fetchAppointments = async () => {
    //         setIsLoading(true);
    //         try {
    //             // Simulate API call - replace with actual Appwrite/Supabase fetch
    //             await new Promise((resolve) => setTimeout(resolve, 1000));
    //             // setAppointments(MOCK_BOOKED_APPOINTMENTS);
    //         } catch (error) {
    //             console.error("Failed to fetch appointments:", error);
    //             toast({
    //                 title: "Error",
    //                 description: "Failed to load appointments. Please refresh the page.",
    //                 variant: "destructive",
    //             });
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchAppointments();
    // }, []);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getRecentAppointmentList();
                console.log("Fetched appointments:", response.documents);

                setAppointments(response.documents as Appointment[]);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setIsLoading(false);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // Get booked dates for calendar
    const bookedDates = useMemo(() => {
        return appointments.map((apt) => apt.schedule);
    }, [appointments]);

    // Get booked time slots for selected date
    const bookedSlots = useMemo(() => {
        if (!selectedDate) return [];
        const dateString = format(selectedDate, "yyyy-MM-dd");
        return appointments
            .filter((apt) => {
                // Convert schedule Date to string, then extract date portion
                const scheduleString = apt.schedule instanceof Date
                    ? format(apt.schedule, "yyyy-MM-dd'T'HH:mm:ss")
                    : apt.schedule;
                const aptDate = scheduleString.split("T")[0];
                return aptDate === dateString;
            })
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
                if (!selectedDate) {
                    toast({
                        title: "Error",
                        description: "Please select a date for your appointment.",
                        variant: "destructive",
                    });
                    return;
                }

                if (!selectedTime) {
                    toast({
                        title: "Error",
                        description: "Please select a time for your appointment.",
                        variant: "destructive",
                    });
                    return;
                }

                const appointment = {
                    ...values,
                    userId,
                    patient: patientId,
                    patname: patient.name,
                    //   primaryPhysician: values.primaryPhysician,
                    schedule: selectedDate,
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
                        const mailData = { "email": email, "name": name, "date": date, "time": time, "mode": mode, status: type };
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
                if (!selectedDate) {
                    toast({
                        title: "Error",
                        description: "Please select a date for your appointment.",
                        variant: "destructive",
                    });
                    return;
                }

                if (!selectedTime) {
                    toast({
                        title: "Error",
                        description: "Please select a time for your appointment.",
                        variant: "destructive",
                    });
                    return;
                }

                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        schedule: selectedDate,
                        time: selectedTime,
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                        reason: values.reason || "",
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
                    const date = selectedDate ? format(selectedDate, " dd, mm, yyyy") : "";
                    const time = selectedTime ;
                    const mode = paymentType;
                    const name = patientData.name;
                    const mailData = { "email": email, "name": name, "date": date, "time": time, "mode": mode, status: type };
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

                {type !== "cancel" && (
                    <>
                        <div className="w-full">
                            <div className="min-h-screen gradient-surface py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
                                <div className="max-w-7xl mx-auto">
                                    {/* Header */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className={`text-center ${isAdminRoute ? "hidden" : "block"} mb-8 sm:mb-12`}
                                    >
                                        <motion.div
                                            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary shadow-primary mb-4"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <CalendarDays className="w-7 h-7 sm:w-8 sm:h-8 text-Primary-purple" />
                                        </motion.div>
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                                            Book Your Appointment
                                        </h1>
                                        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-4">
                                            Select a convenient date and time for your visit. We'll confirm your booking via email.
                                        </p>
                                    </motion.div>

                                    {/* Main Content Grid - Fully Responsive */}
                                    <div className="flex flex-col lg:flex-row justify-center gap-4 sm:gap-6 lg:gap-8 mx-auto relative">
                                        {/* Calendar Section */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1, duration: 0.5 }}
                                            className="w-full sm:w-80 md:w-96 lg:w-96 mx-auto lg:mx-0"
                                            whileHover={{ y: -4 }}
                                            // transition={{ type: "spring", stiffness: 200 }}
                                        >
                                            <motion.div
                                                className="gradient-card rounded-2xl p-4 sm:p-6 shadow-card border border-border/50 h-full"
                                                whileHover={{ boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)" }}
                                                transition={{ duration: 0.3 , type: "spring", stiffness: 200 }}
                                            >
                                                <BookingCalendar
                                                    selectedDate={selectedDate}
                                                    onSelectDate={handleDateSelect}
                                                    bookedDates={bookedDates.map(date => format(date, "yyyy-MM-dd"))}
                                                    isLoading={isLoading}
                                                />
                                            </motion.div>
                                        </motion.div>

                                        {/* Time Slots Section */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2, duration: 0.5 }}
                                            className="w-full sm:w-80 md:w-96 lg:w-96 mx-auto lg:mx-0"
                                            whileHover={{ y: -4 }}
                                        >
                                            <motion.div
                                                className="gradient-card rounded-2xl p-4 sm:p-6 shadow-card border border-border/50 h-full"
                                                whileHover={{ boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)" }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <TimeSlotPicker
                                                    selectedTime={selectedTime}
                                                    onSelectTime={setSelectedTime}
                                                    bookedSlots={bookedSlots}
                                                    selectedDate={selectedDate}
                                                    isLoading={isLoading}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    </div>

                                    {/* Form & Summary Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="w-full mt-8 sm:mt-12"
                                    >
                                        {/* Summary & Submit */}
                                        <motion.div
                                            className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6"
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

                                            {/* Reason & Notes Fields */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.35, duration: 0.5 }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                                                whileHover={{ y: -2 }}
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.01 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <CustomFormField
                                                        fieldtype={FormFeildType.TEXTAREA}
                                                        control={form.control}
                                                        name="reason"
                                                        label="Appointment reason *"
                                                        placeholder="Annual montly check-up"
                                                        disabled={type === "schedule"}
                                                    />
                                                </motion.div>

                                                <motion.div
                                                    whileHover={{ scale: 1.01 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <CustomFormField
                                                        fieldtype={FormFeildType.TEXTAREA}
                                                        control={form.control}
                                                        name="note"
                                                        label="Comments/notes"
                                                        placeholder="Prefer afternoon appointments, if possible"
                                                        disabled={type === "schedule"}
                                                    />
                                                </motion.div>
                                            </motion.div>

                                            {/* Payment Section */}
                                            {!isAdminRoute && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4, duration: 0.5 }}
                                                    className="space-y-4 sm:space-y-6 p-4 sm:p-6 rounded-xl gradient-card border border-border/50"
                                                    whileHover={{ boxShadow: "0 15px 30px rgba(168, 85, 247, 0.1)" }}
                                                >
                                                    {/* Payment Type Select */}
                                                    <motion.div
                                                        whileHover={{ scale: 1.01 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        <CustomFormField
                                                            fieldtype={FormFeildType.SELECT}
                                                            control={form.control}
                                                            name="paymentType"
                                                            label="Payment Type *"
                                                            placeholder="Offline/Online"
                                                        >
                                                            {["Offline", "Online"].map((idType, i) =>
                                                            (
                                                                <SelectItem
                                                                    key={idType + i}
                                                                    value={idType}
                                                                    className="text-purple3 flex cursor-pointer items-center gap-2 relative !important hover:bg-purple-100/50 transition-colors"
                                                                    onClick={() => setPaymentType(idType)}
                                                                >
                                                                    {idType}
                                                                </SelectItem>
                                                            ))}
                                                        </CustomFormField>
                                                    </motion.div>

                                                    {/* QR Code Section */}
                                                    {paymentType && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            transition={{ duration: 0.4 }}
                                                            className="flex flex-col gap-4 text-center items-center justify-center w-full p-4 sm:p-8 bg-gradient-to-br from-white/60 via-white/40 to-purple-50/40 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl"
                                                        >
                                                            <motion.h3
                                                                className="text-sm sm:text-base font-semibold text-purple3"
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                Pay the fees <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹1000</span> to schedule appointment
                                                            </motion.h3>

                                                            <motion.div
                                                                whileHover={{ scale: 1.08, rotate: 2 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                                className="relative"
                                                            >
                                                                {/* Outer Glow Effect */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl rounded-3xl -z-10"></div>

                                                                {/* QR Code Container */}
                                                                <div className="relative p-6 sm:p-8 bg-gradient-to-br from-white via-purple-50/20 to-white rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden flex items-center justify-center backdrop-blur-sm">
                                                                    {/* Background Gradient Overlay */}
                                                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-purple-300/10 rounded-3xl pointer-events-none"></div>

                                                                    <div className="relative w-max flex items-center justify-center">
                                                                        {/* QR Code Wrapper with Gradient Filter */}


                                                                        {/* Logo Overlay in Center */}
                                                                        <GradientQRCode />
                                                                        <motion.div
                                                                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                                            whileHover={{ scale: 1.15, rotate: 5 }}
                                                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                                        >
                                                                            {/* <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                                                                                
                                                                                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-purple-100 rounded-full shadow-xl border-3 border-white/80 backdrop-blur-sm"></div>
                                                                                
                                                                            </div> */}
                                                                        </motion.div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>

                                                            <motion.p
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.2 }}
                                                                className="text-xs sm:text-sm text-muted-foreground mt-2"
                                                            >
                                                                Scan with any UPI app
                                                            </motion.p>
                                                        </motion.div>
                                                    )}

                                                    {/* Payment Proof Upload */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1, duration: 0.4 }}
                                                        whileHover={{ scale: 1.01 }}
                                                    >
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
                                                    </motion.div>
                                                </motion.div>
                                            )}

                                            {/* Submit Button */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.45, duration: 0.5 }}
                                                className="w-full"
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.02, y: -3 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    <Button
                                                        type="submit"
                                                        className={`w-full h-12 sm:h-14 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${submitStatus === "success"
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
                                                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                                                        <Loader2 className="w-4 sm:w-5 h-4 sm:h-5" />
                                                                    </motion.div>
                                                                    <span className="hidden sm:inline">Booking...</span>
                                                                </motion.div>
                                                            ) : submitStatus === "success" ? (
                                                                <motion.div
                                                                    key="success"
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                                                                    <span className="hidden sm:inline">Appointment Confirmed!</span>
                                                                    <span className="sm:hidden">Confirmed!</span>
                                                                </motion.div>
                                                            ) : submitStatus === "error" ? (
                                                                <motion.div
                                                                    key="error"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5" />
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
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>

                                    {/* Footer Note */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="text-center text-xs sm:text-sm text-muted-foreground mt-8 sm:mt-12 px-4"
                                    >
                                        Need to reschedule?{' '}
                                        <motion.a
                                            href="mailto:support@example.com"
                                            className="text-primary hover:underline font-semibold"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Contact us
                                        </motion.a>
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {type === "cancel" && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-2xl mx-auto"
                        >
                            <motion.div
                                className="space-y-6 p-4 sm:p-8 rounded-xl gradient-card border border-border/50"
                                whileHover={{ boxShadow: "0 20px 40px rgba(168, 85, 247, 0.1)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Cancel Appointment</h2>
                                    <p className="text-sm text-muted-foreground">Please let us know the reason for cancellation</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <CustomFormField
                                        fieldtype={FormFeildType.TEXTAREA}
                                        control={form.control}
                                        name="cancellationReason"
                                        label="Reason for cancellation"
                                        placeholder="Urgent meeting came up"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    whileHover={{ scale: 1.02, y: -3 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full"
                                >
                                    <Button
                                        type="submit"
                                        onClick={() => console.log("Cancel Appointment clicked")}
                                        className={`w-full h-12 sm:h-14 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${submitStatus === "success"
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
                                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                                        <Loader2 className="w-4 sm:w-5 h-4 sm:h-5" />
                                                    </motion.div>
                                                    <span className="hidden sm:inline">Processing...</span>
                                                </motion.div>
                                            ) : submitStatus === "success" ? (
                                                <motion.div
                                                    key="success"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                                                    <span className="hidden sm:inline">Appointment Cancelled</span>
                                                    <span className="sm:hidden">Cancelled</span>
                                                </motion.div>
                                            ) : submitStatus === "error" ? (
                                                <motion.div
                                                    key="error"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5" />
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
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </>
                )}

            </form>
        </Form>
    );
};


export default AppointmentForm