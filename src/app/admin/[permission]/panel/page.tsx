import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import StatCard from '../../../components/ui/StatCard'
import {CalendarCheck2 , Hourglass ,  TriangleAlert} from 'lucide-react'
import { getRecentAppointmentList } from '../../../../../lib/actions/appointment.actions'
import {DataTable} from '@/app/components/Tables/DataTable'
import {columns, Payment} from '@/app/components/Tables/columns'



const AdminPanel = async () => {
    
    const appointments = await getRecentAppointmentList()
  return (
    <div className='mx-auto bg-[#f1f1f1] **: pb-10 max-w-7xl flex flex-col space-y-14'>
        <header className="sticky bg-Primary-purple   z-20  flex w-screen items-center justify-between  bg-dark-200 px-[5%] py-2 shadow-lg xl:px-12">
            <Link href={"/"} className='cursor-pointer'>
            <Image src={"/Mindsettler_logoFinal.png"} alt="MindSettler Logo" width={150} height={50}/>
            </Link>
            <h2 className="">Admin Dashboard</h2>
        </header>

        <main className=" flex flex-col items-center space-y-6 px-[5%] pb-12 xl:space-y-12 xl:px-12">
            <section className="w-full space-y-2">
                <h1 className="text-2xl text-purple2 md:text-3xl font-bold">Welcome 👋 </h1>
                <p className="text-purple3/70 text-sm">Start the day with managing new appointments </p>
            </section>

            <section className="flex w-full flex-col justify-between gap-5 sm:flex-row xl:gap-10">
                <StatCard
                type="appointments"
                count={appointments.scheduledCount}
                countcs={'text-teal-950'}
                label="Schedduled Appointments"
                icon={<CalendarCheck2 size={24} className="text-Primary-purple"/>}
                />
                <StatCard
                type="pending"
                count={appointments.pendingCount}
                countcs={'text-slate-800'}
                label="Pending Appointments"
                icon={<Hourglass size={24} className="text-blue-400"/>}
                />
                <StatCard
                type="cancelled"
                count={appointments.cancelledCount}
                countcs={'text-red-700'}
                label="Cancelled Appointments"
                icon={<TriangleAlert size={24} className="text-red-400"/>}
                />
            </section>

            <DataTable columns={columns} data= {appointments.documents} />
            {/* <DataTable  columns={columns} data= {data} /> */}
        </main>
      
    </div>
  )
}

export default AdminPanel
