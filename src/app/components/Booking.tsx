"use client"
import React, { useEffect, useState  } from 'react'
import Image from 'next/image';
import {LucideHotel , Clock , Video} from "lucide-react"
import Link from 'next/link';
import FetchUser from './FetchUser';
export const fetchUserData = async () => {
  const userData = await FetchUser()
  console.log("User data fetched on home page.", userData);
  return userData;
};

const Booking = () => {
    const [user, setUser] = useState<any>(null)
    useEffect(() => {
        fetchUserData().then(setUser);
        if (user) {
          console.log("User data fetched on home page:", user);
          console.log("User email:", user.$id);
        }
      }, []);
    return (
        <div className='bg-cloudy-Apple min-h-fit h-scren w-screen py-10'>
            <div className=" relative top-0 pt-10 text-center  text-pink-600 font-medium tracking-wider uppercase text-sm mb-2">
                Sessions & Booking
            </div>
            <h2 className="text-3xl relative  text-center lg:text-5xl font-serif font-bold text-purple-900 mb-2 leading-tight">
                Begin Your Healing Journey
            </h2>
            <div className="text-purple3 relative  text-center max-w-[60vw] mx-auto mb-12 text-md font-medium leading-relaxed">
                Your first session is where clarity begins. Choose the format that feels most comfortable for you.
            </div>
            <div className="flex group/sessio lg:flex-row flex-col items-center justify-center gap-8">
                <div className="w-[30vw] overflow-hidden  max-sm:w-[90vw] relative bg-white hover:-translate-y-2 transition-all ease-in  h-fit py-8 px-8 flex flex-col justify-start items-start gap-4 border border-gray-200 shadow-lg rounded-2xl hover:shadow-2xl  duration-200">
                    <div className="absolute right-0 top-0 bg-purple5/20 w-24 h-24 rounded-tr-full spin-slow"></div>
                    <div className="bg-Primary-purple/20   p-3 rounded-3xl mb-2 hover:rotate-z-12 hover:scale-105 transition-all duration-200">
                        <Image
                            src="/assets/videocall.svg"
                            width={32}
                            height={32}
                            alt="Online Session"
                        />
                    </div>
                    <h2 className="text-Primary-purple font-semibold group-hover/sessio:text-Primary-pink text-xl ">
                        Online Sessions
                    </h2>
                    <p className="text-Primary-purple/70">
                        Connect from the comfort and privacy of your own space. Perfect for those with busy schedules or who prefer home settings.
                    </p>
                    <div className="flex text-sm gap-8 text-purple5">
                        <div className="flex gap-2 text-center">
                            <Image
                                src={"/assets/time_slot.svg"}
                                alt='time_slot'
                                width={16}
                                height={16}
                            />
                            <span className="">60 Minutes</span>
                        </div>
                        <div className="flex gap-2 text-center">
                            <Image
                                src={"/assets/videocall.svg"}
                                alt='time_slot'
                                width={16}
                                height={16}
                            />
                            <span className="">Video Call</span>
                        </div>
                    </div>
                    <Link href={`${user ? `/patient/${user.$id}/new-appointment` : '/Signup'}`}>
                    <button className='text-center flex items-center justify-center text-white px-4 rounded-full w-full py-2 bg-Primary-purple'>
                        <span className="relative ">
                            Book Online Session
                        </span>
                        <span className="calmLR relative ml-2"> → </span>
                    </button>
                    </Link>

                </div>
                <div className="w-[30vw] overflow-hidden max-sm:w-[90vw] relative bg-Primary-purple hover:-translate-y-3 transition-all ease-in  h-[-webkit-fill-available] py-8 px-8 flex flex-col justify-start items-start gap-4 border border-black shadow-sm rounded-2xl hover:shadow-2xl  duration-300">
                    <div className="absolute right-0 top-0 bg-pink2/20 w-24 h-24 rounded-tr-full spin-slow2"></div>
                    <div className="bg-purple5/20   p-3 rounded-3xl mb-2 hover:rotate-z-12 hover:scale-105 transition-all duration-200">
                        <LucideHotel className="w-8 h-8 text-white"/>
                    </div>
                    <h2 className="text-white font-semibold  text-xl ">
                        In-Studio Sessions
                    </h2>
                    <p className="text-white/70">
                        Experience our calm, welcoming studio space designed specifically for peaceful, focused conversations.                    </p>
                    <div className="flex text-sm gap-8 text-purple5">
                        <div className="flex gap-2 text-center">
                            <Clock className="w-4 h-4 text-white"/>
                            
                            <span className="">60 Minutes</span>
                        </div>
                        <div className="flex gap-2 text-center">
                            <Video className="w-4 h-4 text-white"/>
                            <span className="">In-Person</span>
                        </div>
                    </div>
                    <Link href={`${user ? `/patient/${user.$id}/new-appointment` : '/Signup'}`}>
                    <button className='text-center flex items-center justify-center text-white px-4 rounded-full w-full py-2 border-2 border-purple3/20 bg-purple5/10'>
                        <span className="relative ">
                            Book Offline Session
                        </span>
                        <span className="calmLR relative ml-2"> → </span>
                    </button>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Booking
