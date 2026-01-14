"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function GoogleCalendarButton() {
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!(window as any).calendar || !buttonRef.current) return;

    (window as any).calendar.schedulingButton.load({
      url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3B94e27d5X58xbWsQ2SJoiEIceHfU1yk-P90IC3dhv5piD8qrop934j2enMpDH1xqW_ll9MI1x?gv=true",
      color: "#f1f1f1",
      label: "Book an appointment",
      target: buttonRef.current,
    });
  }, []);

  return (
    <>
      {/* Google Calendar CSS */}
      <link
        href="https://calendar.google.com/calendar/scheduling-button-script.css"
        rel="stylesheet"
      />

      {/* Google Calendar Script */}
      <Script
        src="https://calendar.google.com/calendar/scheduling-button-script.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).calendar && buttonRef.current) {
            (window as any).calendar.schedulingButton.load({
              url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3B94e27d5X58xbWsQ2SJoiEIceHfU1yk-P90IC3dhv5piD8qrop934j2enMpDH1xqW_ll9MI1x?gv=true",
              color: "#f1f1f1",
              label: "Book an appointment",
              target: buttonRef.current,
            });
          }
        }}
      />

      {/* Button target */}
      <div ref={buttonRef} />
    </>
  );
}
