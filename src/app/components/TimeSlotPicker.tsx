import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "../../../lib/utils";

interface TimeSlotPickerProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  bookedSlots: string[];
  selectedDate: Date | null;
  isLoading?: boolean;
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", 
  "11:00", "11:30", "12:00", "14:00", 
  "14:30", "15:00", "15:30", "16:00", 
  "16:30", "17:00"
];

export function TimeSlotPicker({ selectedTime, onSelectTime, bookedSlots, selectedDate, isLoading }: TimeSlotPickerProps) {
  if (!selectedDate) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Select a date to view available times</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-foreground">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Available Times</h3>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <AnimatePresence mode="popLayout">
          {TIME_SLOTS.map((time, index) => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = selectedTime === time;

            return (
              <motion.button
              type="button"
                key={time}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => !isBooked && onSelectTime(time)}
                disabled={isBooked || isLoading}
                className={cn(
                  "py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  isBooked && "bg-muted/50 text-muted-foreground/40 cursor-not-allowed line-through",
                  !isBooked && !isSelected && "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md",
                  isSelected && "gradient-primary text-primary-foreground shadow-primary"
                )}
                aria-label={`${time} ${isBooked ? "(unavailable)" : ""}`}
                aria-disabled={isBooked}
              >
                {time}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-secondary" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded gradient-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-muted/50" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}
