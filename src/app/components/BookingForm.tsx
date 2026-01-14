import { motion } from "framer-motion";
import { User, Mail, FileText, MessageSquare } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/Label";

interface BookingFormData {
  fullName: string;
  email: string;
  reason: string;
  notes: string;
}

interface BookingFormProps {
  formData: BookingFormData;
  onFormChange: (data: Partial<BookingFormData>) => void;
  errors: Partial<Record<keyof BookingFormData, string>>;
}

const APPOINTMENT_REASONS = [
  "Initial Consultation",
  "Follow-up Visit",
  "General Checkup",
  "Specific Concern",
  "Second Opinion",
  "Other"
];

export function BookingForm({ formData, onFormChange, errors }: BookingFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Your Information
      </h3>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          Full Name <span className="text-accent">*</span>
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => onFormChange({ fullName: e.target.value })}
          className={`bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 rounded-xl h-12 ${errors.fullName ? 'border-destructive' : ''}`}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            id="fullName-error"
            className="text-xs text-destructive"
          >
            {errors.fullName}
          </motion.p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          Email Address <span className="text-accent">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => onFormChange({ email: e.target.value })}
          className={`bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 rounded-xl h-12 ${errors.email ? 'border-destructive' : ''}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            id="email-error"
            className="text-xs text-destructive"
          >
            {errors.email}
          </motion.p>
        )}
      </div>

      {/* Reason for Appointment */}
      <div className="space-y-2">
        <Label htmlFor="reason" className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Reason for Appointment
        </Label>
        <Select value={formData.reason} onValueChange={(value) => onFormChange({ reason: value })}>
          <SelectTrigger id="reason" className="bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 rounded-xl h-12">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            {APPOINTMENT_REASONS.map((reason) => (
              <SelectItem key={reason} value={reason}>
                {reason}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          Additional Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="Any additional information you'd like us to know..."
          value={formData.notes}
          onChange={(e) => onFormChange({ notes: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 rounded-xl min-h-[100px] resize-none"
          rows={4}
        />
      </div>
    </motion.div>
  );
}
