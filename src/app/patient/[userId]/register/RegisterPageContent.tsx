"use client"

import React from "react"
import Image from "next/image"
import RegisterForm from "../../../components/forms/RegisterForm"
import { User } from "../../../../../types"

const RegisterPageContent = ({ user }: { user: User }) => {
    return (
        <div className="flex w-full h-screen overflow-hidden bg-white">
            {/* Left Side - Form Container */}
            <div 
                className="w-full lg:w-[60%] max-md:px-10 flex flex-col justify-center items-center h-full relative z-10 bg-white animate-in fade-in slide-in-from-left-8 duration-700 ease-out"
            >
                {/* Scrollable Form Area */}
                <div className="w-full h-full overflow-y-auto custom-scrollbar flex justify-center py-6">
                    <RegisterForm user={user} />
                </div>
            </div>

            {/* Right Side - Image Container */}
            <div 
                className="hidden lg:flex lg:w-[40%]  h-full relative animate-in fade-in slide-in-from-right-8 duration-1000 ease-out delay-200 fill-mode-backwards"
            >
                <div className="relative w-full h-full group overflow-hidden">
                    <Image
                        src="/Register.jpeg"
                        alt="MindSettler Registration"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    {/* Gradient Overlay for professional look */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/5 pointer-events-none" />
                    
                    {/* Optional text overlay if needed */}
                    <div 
                        className="absolute bottom-2 right-8 text-white p-6 bg-black/5 backdrop-blur-md rounded-xl max-w-sm border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards hover:bg-black/10 hover:shadow-[0_0_40px_rgba(223,22,100,0.2)] transition-all"
                    >
                        <h3 className="text-2xl font-bold mb-2">Join MindSettler</h3>
                        <p className="text-sm opacity-90">Begin your journey to better mental health today.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPageContent