"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { int, set, z } from "zod"
import Image from "next/image"
import { createUser } from "../../../../lib/actions/patient.actions"
import { Button } from "../ui/Button"
import { Form, FormControl } from "../ui/Form"
import { Input } from "../ui/Input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import {getAppointmentSchema } from "../../../../lib/validation"
import { useRouter } from "next/navigation"
import { FormFeildType } from "@/app/Login/page"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { GenderOptions, PatientFormDefaultValues } from "../../../../constants"
import { RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/Label"
import { SelectItem } from "../ui/select"
import FileUploader from "../ui/FileUploader"
import { registerPatient } from "../../../../lib/actions/patient.actions";
import { is } from "zod/v4/locales"
import { User } from "lucide-react"
import App from "next/app"
import { createAppointment } from "../../../../lib/actions/appointment.actions"
import { get } from "http"



const AppointmentForm = ({
    userId, patientId, type
}: { userId: string; patientId: string; type: "create" | "cancel" | "schedule" }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    let buttonLabel;
    switch (type) {
        case 'cancel':
            buttonLabel = 'Cancel Appointment';
            break;
        case 'create':
            buttonLabel = 'Create Appointment';
            break;
        case 'schedule':
            buttonLabel = 'Schedule Appointment';
            break;
        default:
            break;
    }
    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            schedule: new Date(),
            note: "",
            reason: "",
            cancellationReason: "",

        },
    })


    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true);
        let status;
        switch (type) {
            case 'schedule':
                status = 'scheduled';
                break;
            case 'cancel':
                status = 'canceled';
                break;
        
            default:
                status = 'pending';
                break;
        }

        try {
            if(type==='create' && patientId){
                console.log("Creating appointment...");
                const appointmentData = {
                    userId,
                    patient: patientId,
                    reason: values.reason!,
                    schedule:new Date(values.schedule),
                    status: status as Status,
                    note: values.note,
                };
                const appointment = await createAppointment(appointmentData);
                if(appointment){ 
                    console.log("Created appointment...");
                    form.reset();
                    router.push(`/patient/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);}
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }





    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 relative flex h-[80vh] overflow-y-visible  my-10   mx-10 flex-col mb-10  md:max-w-[40vw] ">
                    <section className="flex flex-col items-start mb-5">
                        <h1 className="text-Primary-purple font-semibold">Welcome</h1>
                        <h2 className="text-purple4 text-sm">Book a session</h2>
                    </section>
                    <section className="flex flex-col items-start mb-5">

                        <h2 className="text-purple4 text-xl">New Appointment</h2>
                    </section>

                    {type !== "cancel" && (
                        <>
                            <CustomFormField
                                fieldtype={FormFeildType.DATE_TIME_PICKER}
                                control={form.control}
                                name="schedule"
                                label="Select Date and Time"
                                showTimeSelect
                                dateFormat="DD/MM/YYYY - h:mm aa"

                            />
                        </>
                    )}


                    <div className="flex flex-col gap-6 lg:flex-row ">
                        <CustomFormField
                            fieldtype={FormFeildType.TEXTAREA}
                            control={form.control}
                            name="reason"
                            label="Reason for Appointment"
                            placeholder="Enter the reason for your appointment"

                        />
                        <CustomFormField
                            fieldtype={FormFeildType.TEXTAREA}
                            control={form.control}
                            name="note"
                            label="Additional Notes"
                            placeholder="Enter any additional notes"

                        />



                    </div>
                    <div className="flex flex-col lg:flex-row gap-6">


                    </div>


                    {type === "cancel" && (
                        <CustomFormField
                            fieldtype={FormFeildType.TEXTAREA}
                            control={form.control}
                            name="cancellationReason"
                            label="Reason for Cancellation"
                            placeholder="Enter the reason for cancellation"
                        />
                    )}



                    <SubmitButton className={`${type === 'cancel'}?'bg-red-400' : ''`} isLoading={isLoading} > {buttonLabel} </SubmitButton>
                    <div className="h-40 w-full bg-white text-white ">
                        MindSettler all rights reserved.
                    </div>
                </form>
            </Form>
        </div>
    )

}


export default AppointmentForm