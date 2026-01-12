"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "../ui/Button"
import { Calendar  } from "../ui/Calender"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/Popover"


export default function Calendar24() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        {/* <Label htmlFor="date-picker" className="px-1 mt-1 text-Primary-purple">
          Date
        </Label> */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 text-purple3  m-1 border-0 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto scale-75 overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              classNames={{
                month: "bg-white p-4",
                weekday: "text-Primary-purple/80 px-2 border-b",
              }}
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3 m-1">
        
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30:00"
          className="bg-background  appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
