import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CalendarDays, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { BookingCalendar } from "./BookingCalendar"; 
import { TimeSlotPicker } from "./TimeSlotPicker";
import { BookingForm } from "./BookingForm";
import { BookingSummary } from "./BookingSummary";
import { Button } from "../components/ui/button1";
import { toast } from "../../../hooks/use-toast";

interface FormData {
  fullName: string;
  email: string;
  reason: string;
  notes: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  fullName: string;
  email: string;
  reason: string;
  notes: string;
}

// Mock data for demonstration - replace with actual API calls
const MOCK_BOOKED_APPOINTMENTS: Appointment[] = [
  { id: "1", date: "2026-01-15", time: "09:00", fullName: "John Doe", email: "john@example.com", reason: "Checkup", notes: "" },
  { id: "2", date: "2026-01-15", time: "10:30", fullName: "Jane Smith", email: "jane@example.com", reason: "Follow-up", notes: "" },
  { id: "3", date: "2026-01-16", time: "14:00", fullName: "Bob Wilson", email: "bob@example.com", reason: "Consultation", notes: "" },
];

export function AppointmentBooking() {
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
        setAppointments(MOCK_BOOKED_APPOINTMENTS);
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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    return (
      selectedDate &&
      selectedTime &&
      formData.fullName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
  }, [selectedDate, selectedTime, formData]);

  const handleSubmit = async () => {
    if (!validateForm() || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call - replace with actual Appwrite/Supabase create
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newAppointment: Appointment = {
        id: Date.now().toString(),
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        ...formData,
      };

      setAppointments((prev) => [...prev, newAppointment]);
      setSubmitStatus("success");

      toast({
        title: "Appointment Booked!",
        description: `Your appointment on ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime} has been confirmed.`,
      });

      // Reset form after success
      setTimeout(() => {
        setSelectedDate(null);
        setSelectedTime(null);
        setFormData({ fullName: "", email: "", reason: "", notes: "" });
        setSubmitStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Failed to book appointment:", error);
      setSubmitStatus("error");
      toast({
        title: "Booking Failed",
        description: "Unable to book your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-surface py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-primary mb-4">
            <CalendarDays className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Book Your Appointment
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select a convenient date and time for your visit. We'll confirm your booking via email.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 gradient-card rounded-2xl p-6 shadow-card border border-border/50 relative"
          >
            <BookingCalendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              bookedDates={bookedDates}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Time Slots Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="gradient-card rounded-2xl p-6 shadow-card border border-border/50"
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
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 gradient-card rounded-2xl p-6 shadow-card border border-border/50"
          >
            <BookingForm
              formData={formData}
              onFormChange={handleFormChange}
              errors={errors}
            />
          </motion.div>

          {/* Summary & Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
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

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`w-full h-14 rounded-xl text-base font-semibold transition-all duration-300 ${
                  submitStatus === "success"
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
                      Confirm Booking
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              {!isFormValid && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Please select a date, time, and fill in required fields
                </p>
              )}
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
  );
}
