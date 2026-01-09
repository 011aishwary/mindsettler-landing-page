import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getAppointment } from '../../../../../../lib/actions/appointment.actions'
import { formatDateTime } from '../../../../../../lib/utils';
interface SearchParamProps {
    params: { userId: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}

const Success = async ({ params: { userId }, searchParams }: SearchParamProps) => {
    const appointmentId = searchParams?.appointmentId as string || "";
    const appointment = await getAppointment(appointmentId);
    console.log("Appointment Details:", appointment.documents[0].schedule);
    return (
        <div className="flex bg-white h-screen max-h-screen px=[5%]">

            <div className='flex flex-col justify-center items-center text-center mx-auto  gap-6'>
                <Link href='/Home' className='text-purple4 underline'>
                    <Image
                        src={"/Mindsettler_logo2.jpg"}
                        alt="success"
                        width={1000}
                        height={1000}
                        className="h-10 w-fit mx-auto"
                    />
                </Link>
                <section className='header mb-6 max-w-[400px] text-center text-2xl text-Primary-purple'>
                    Your <span className="text-Primary-pink">appointment request </span>has been successfully submitted!
                    <div className="text-xs mt-5 text-purple3">Thank you for choosing Mindsettler. We will notify you once your appointment is confirmed.</div>
                </section>
                <section className="text-purple2">
                    <p className="">Requested appointment details.</p>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold">Date & Time:</span>
                        <span>{formatDateTime(appointment.documents[0].schedule).dateTime}</span>

                    </div>
                </section>
            </div>
        </div>
    )
}

export default Success
