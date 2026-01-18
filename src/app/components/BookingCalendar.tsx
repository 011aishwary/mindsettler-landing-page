import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { cn } from "../../../lib/utils";

interface BookingCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  bookedDates: string[];
  isLoading?: boolean;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function BookingCalendar({ selectedDate, onSelectDate, bookedDates, isLoading }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });
    
    // Add padding days for proper grid alignment
    const startPadding = start.getDay();
    const paddedDays: (Date | null)[] = Array(startPadding).fill(null);
    
    return [...paddedDays, ...daysInMonth];
  }, [currentMonth]);

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today);
  };

  const isDateFullyBooked = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    // Check if this date has all time slots booked (simplified - you'd check actual slots)
    return bookedDates.filter(d => d === dateString).length >= 8;
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
        type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-secondary-foreground" />
        </motion.button>
        
        <motion.h2 
          key={format(currentMonth, "MMMM-yyyy")}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-foreground"
        >
          {format(currentMonth, "MMMM yyyy")}
        </motion.h2>
        
        <motion.button
        type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-secondary-foreground" />
        </motion.button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode="popLayout">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const disabled = isDateDisabled(date) || isDateFullyBooked(date);
            const today = isToday(date);

            return (
              <motion.button
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => !disabled && onSelectDate(date)}
                disabled={disabled || isLoading}
                type="button"
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground/40",
                  disabled && "opacity-40 cursor-not-allowed",
                  !disabled && !isSelected && "hover:bg-purple4 hover:shadow-md",
                  isSelected && "gradient-accent text-Primary-purple  shadow-primary",
                  today && !isSelected && "ring ring-black/2 bg-purple5",
                  isDateFullyBooked(date) && "bg-red-500/10 text-red-600 border border-red-600",
                  isLoading && "animate-pulse"
                )}
                aria-label={format(date, "MMMM d, yyyy")}
                aria-selected={isSelected || false}
                aria-disabled={disabled}
              >
                {format(date, "d")}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
