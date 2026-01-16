import { motion } from "framer-motion";
import { Calendar, Clock, User, Mail, FileText, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface BookingSummaryProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  fullName: string;
  email: string;
  reason: string;
}

export function BookingSummary({ selectedDate, selectedTime, fullName, email, reason }: BookingSummaryProps) {
  const hasSelection = selectedDate && selectedTime;

  if (!hasSelection) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="gradient-card rounded-2xl p-6 shadow-card border border-border/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Appointment Summary</h3>
      </div>

      <div className="space-y-3">
        {/* Date & Time */}
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary">
            <Calendar className="w-5 h-5 text-Primary-purple" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date & Time</p>
            <p className="font-medium text-foreground">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>
            <div className="flex items-center gap-1 text-primary">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{selectedTime}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        {(fullName || email) && (
          <div className="space-y-2 p-3 bg-secondary/50 rounded-xl">
            {fullName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">{fullName}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-foreground">{email}</span>
              </div>
            )}
            {reason && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Reason:</span>
                <span className="font-medium text-foreground">{reason}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
