import React from "react"
import Image from "next/image"
import RegisterForm from "../../../components/forms/RegisterForm"
import { getUser } from "../../../../../lib/actions/patient.actions";
import { getPatient } from "../../../../../lib/actions/patient.actions";
import AppointmentForm from "../../../components/forms/NewAppointment";



const NewAppointment = async ({ params }: { params: Promise<{ userId: string }> }) => {
    const { userId } = await params;
    const user = await getUser(userId);
    const patient = await getPatient(userId);
    return (
        <>
            <div className="flex absolute  inset-0 h-screen overflow-visible  bg-white justify-center items-center min gap-10 w-screen ">
                <div className="flex flex-col mx-auto p-2 pb-10 mb-10 h-screen overflow-auto justify-center items-center self-center-safe relative lg:w-screen w-[65vw]">

                    <AppointmentForm type="create" patientId={patient.$id}  userId={userId} />
                    {/* <RegisterForm user={user} /> */}
                </div>


                {/* <div className="max-h-screen overflow-hidden">
                    <Image
                        src="/ScheduleAppointment.jpeg"
                        alt="loginimg"
                        width={500}
                        height={500}
                        className="h-screen w-auto hidden md:block object-cover"
                    />
                </div> */}
            </div>
        </>
    )
}

export default NewAppointment
