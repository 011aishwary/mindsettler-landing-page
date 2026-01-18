import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import StatCard from '../../../components/ui/StatCard'
import {CalendarCheck2 , Hourglass ,  TriangleAlert} from 'lucide-react'
import { getRecentAppointmentList } from '../../../../../lib/actions/appointment.actions'
import { getContactMessages } from '../../../../../lib/actions/contact.actions'
import {DataTable} from '@/app/components/Tables/DataTable'
import {columns, contactColumns} from '@/app/components/Tables/columns'



const AdminPanel = async () => {
    
    const appointments = await getRecentAppointmentList()
    const contactMessages = await getContactMessages()

  return (
    <div className='min-h-screen w-full bg-[#f8f9fa]'>
        <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-Primary-purple/80 border-b border-gray-200 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
                <Link href={"/"} className='cursor-pointer transform hover:scale-105 transition-transform duration-200'>
                    <Image 
                        src={"/Mindsettler_logoFinal.png"} 
                        alt="MindSettler Logo" 
                        width={140} 
                        height={45}
                        className="w-32 sm:w-40 h-auto"
                    />
                </Link>
                <div className="flex items-center space-x-4">
                    <div className="hidden sm:block">
                        <p className="text-md text-blueGray font-bold">Hello, Admin</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-pink4 flex items-center justify-center border border-Primary-purple/20">
                         <span className="text-Primary-purple text-sm font-bold">P</span>
                    </div>
                </div>
            </div>
        </header>

        <main className="flex flex-col space-y-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
            <section className="w-full space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Dashboard Overview
                </h1>
                <p className="text-gray-500 text-sm sm:text-base font-medium">
                    Welcome back! Here's what's happening with your appointments today.
                </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                <div className="transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-in-out">
                    <StatCard
                        type="appointments"
                        count={appointments.scheduledCount}
                        countcs={'text-emerald-700'}
                        label="Scheduled Appointments"
                        icon={<CalendarCheck2 size={24} className="text-emerald-600"/>}
                    />
                </div>
                <div className="transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-in-out">
                    <StatCard
                        type="pending"
                        count={appointments.pendingCount}
                        countcs={'text-blue-700'}
                        label="Pending Requests"
                        icon={<Hourglass size={24} className="text-blue-600"/>}
                    />
                </div>
                <div className="transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-in-out">
                    <StatCard
                        type="cancelled"
                        count={appointments.cancelledCount}
                        countcs={'text-rose-700'}
                        label="Cancelled Appointments"
                        icon={<TriangleAlert size={24} className="text-rose-600"/>}
                    />
                </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 overflow-hidden hover:shadow-md transition-shadow duration-300">
                 <div className="p-4 sm:p-6 border-b border-gray-100 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                 </div>
                 <div className="overflow-x-auto px-8">
                    <DataTable columns={columns} data= {appointments.documents} />
                 </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 overflow-hidden hover:shadow-md transition-shadow duration-300">
                 <div className="p-4 sm:p-6 border-b border-gray-100 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Contact Us Messages</h2>
                 </div>
                 <div className="overflow-x-auto px-8">
                    <DataTable columns={contactColumns} data={contactMessages} />
                 </div>
            </section>
        </main>
      
    </div>
  )
}

export default AdminPanel
