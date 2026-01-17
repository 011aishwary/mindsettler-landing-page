"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import RegisterForm from "../../../components/forms/RegisterForm"
import { User } from "../../../../../types"

const RegisterPageContent = ({ user }: { user: User }) => {
    return (
        <div className="flex w-full h-screen overflow-hidden bg-white">
            {/* Left Side - Form Container */}
            <motion.div 
                className="w-full md:w-[50%] lg:w-[60%] flex flex-col justify-center items-center h-full relative z-10 bg-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Scrollable Form Area */}
                <div className="w-full h-full overflow-y-auto custom-scrollbar flex justify-center py-6">
                    <RegisterForm user={user} />
                </div>
            </motion.div>

            {/* Right Side - Image Container */}
            <motion.div 
                className="hidden md:flex md:w-[50%] lg:w-[40%] h-full relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/Register.jpeg"
                        alt="MindSettler Registration"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlay for professional look */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/5" />
                    
                    {/* Optional text overlay if needed */}
                    <motion.div 
                        className="absolute bottom-2 right-8 text-white p-6 bg-black/5 backdrop-blur-md rounded-xl max-w-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        <h3 className="text-2xl font-bold mb-2">Join MindSettler</h3>
                        <p className="text-sm opacity-90">Begin your journey to better mental health today.</p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default RegisterPageContent