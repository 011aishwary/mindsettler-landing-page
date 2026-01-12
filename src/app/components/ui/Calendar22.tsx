"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "../ui/Button"
import { Calendar } from "../ui/Calender"
import { Label } from "../ui/Label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/Popover"

export function Calendar22({ value, onChange }: { value?: Date; onChange?: (date: Date | undefined) => void }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  
  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    onChange?.(selectedDate)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* <Label htmlFor="date" className="px-1">
        Date of birth
      </Label> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 border-0 text-purple3 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 scale-75" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
