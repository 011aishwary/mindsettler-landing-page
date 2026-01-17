"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getAppointment } from '../../../../../../lib/actions/appointment.actions'
import { formatDateTime } from '../../../../../../lib/utils';
import { useSearchParams } from 'next/navigation';
import {Appointment} from '../../../../../../types/appwrite.types';
import { Suspense } from 'react';


const Success =  () => {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointmentId') || '';
    console.log("Appointment ID from URL:", appointmentId);
    const [appointment, setAppointment] = useState<Appointment | null>(null);

    async function getData(appointmentId: string) {
        const id =   await getAppointment(appointmentId);
        console.log("Fetched appointment data:", id);
        setAppointment(id)
        return 
    }
    useEffect(() => {
        if (appointmentId) {
            getData(appointmentId);
        }
        console.log("Fetching data for appointment ID:", appointment);
    }, [appointmentId]);
    // getData(appointmentId);
    
    

    if (!appointmentId) return <div>Error: No appointment ID</div>;
    if (!appointment) return <div>Loading...</div>;

    return (
        <Suspense fallback={<div>Loading...</div>}>
           
       
        <div className="flex bg-gradient-sky h-screen max-h-screen px-[5%]">

            <div className='flex flex-col justify-center bg-Primary-purple py-6 px-8 rounded-2xl h-fit self-center items-center text-center mx-auto  gap-6'>
                <Link href='/' className='text-purple4 rounded-md backdrop-blur-md shadow-xs shadow-black/40 underline'>
                    <Image
                        src={"/Mindsettler_logoFinal.png"}
                        alt="success"
                        width={100}
                        height={100}
                        className="h-10 w-fit mx-auto"
                    />
                </Link>
                <section className='header mb-6 max-w-100 text-center text-2xl text-white'>
                    Your <span className="text-Primary-pink">Appointment request </span>has been successfully submitted!
                    <div className="text-xs mt-5 text-white">Thank you for choosing Mindsettler. We will notify you once your appointment is confirmed.</div>
                </section>
                <section className="text-white">
                    <p className="">Requested appointment details.</p>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold">Date & Time:</span>
                        <span>{formatDateTime(appointment.schedule).dateTime}</span>

                    </div>
                </section>
            </div>
        </div>
         </Suspense>
    )
}

export default Success
