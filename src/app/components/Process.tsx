import React from 'react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { LucideLogIn, CalendarRangeIcon, ClipboardCheck, CircleCheck, LucideVideo } from "lucide-react"

gsap.registerPlugin(ScrollTrigger);


const Process = () => {


    const steps = [
        { id: 1, title: "Sign Up", description: "Create your account using our simple sign-up process. Provide basic information to get started.", icon: "/assets/login.svg" },
        { id: 2, title: "Choose a Therapist", description: "Browse through our list of qualified therapists. Read profiles and select the one that fits your needs.", icon: "/assets/calendar.svg" },
        { id: 3, title: "Schedule a Session", description: "Pick a date and time that works for you. Our flexible scheduling options make it easy to find a slot.", icon: "/assets/card.svg" },
        { id: 4, title: "Attend Your Session", description: "Join your therapy session via video call from the comfort of your home. Enjoy a private and secure environment.", icon: "/assets/check.svg" },
        { id: 5, title: "Follow Up", description: "After your session, you can schedule follow-ups or access additional resources to support your mental health journey.", icon: "/assets/videocall.svg" },
    ]
    const stepsMobile = [
        { id: 1, title: "Sign Up", description: "Create your account using our simple sign-up process. Provide basic information to get started.", icon: <LucideLogIn className='w-6 h-6 text-pink-600' /> },
        { id: 2, title: "Choose a Therapist", description: "Browse through our list of qualified therapists. Read profiles and select the one that fits your needs.", icon: <CalendarRangeIcon className='w-6 h-6 text-pink-600' /> },
        { id: 3, title: "Schedule a Session", description: "Pick a date and time that works for you. Our flexible scheduling options make it easy to find a slot.", icon: <ClipboardCheck className='w-6 h-6 text-pink-600' /> },
        { id: 4, title: "Attend Your Session", description: "Join your therapy session via video call from the comfort of your home. Enjoy a private and secure environment.", icon: <CircleCheck className='w-6 h-6 text-pink-600' /> },
        { id: 5, title: "Follow Up", description: "After your session, you can schedule follow-ups or access additional resources to support your mental health journey.", icon: <LucideVideo className='w-6 h-6 text-pink-600' /> },
    ]

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const desktopIconsRef = useRef<(HTMLDivElement | null)[]>([]);
    const mobileIconsRef = useRef<(HTMLDivElement | null)[]>([]);

    const desktopProgressRef = useRef<HTMLDivElement>(null);
    const mobileProgressRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        const ctx = gsap.context(() => {
            const progressDuration = 4;
            const iconCount = desktopIconsRef.current.length;
            /* ================= DESKTOP ================= */
            if (desktopProgressRef.current) {
                const desktopTL = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                });

                desktopTL.fromTo(
                    desktopProgressRef.current,
                    { width: 0 },
                    {
                        width: "100%",
                        // transformOrigin: "left center",
                        duration: progressDuration,
                        ease: "none",
                    }
                );

                desktopIconsRef.current.forEach((icon, i) => {
                    const iconTime = progressDuration * (i / (iconCount - 1));
                    desktopTL.to(
                        icon,
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.3,
                            ease: "back.out(1.7)",
                        },
                        iconTime
                    );

                    desktopTL.to(
                        icon,
                        {
                            scale: 1.2,
                            rotate: 12,
                            duration: 0.2,
                            ease: "power2.out",
                        },
                        iconTime + 0.05
                    );

                    desktopTL.to(
                        icon,
                        {
                            scale: 1,
                            rotate: 0,
                            duration: 0.2,
                            ease: "power2.inOut",
                        },
                        iconTime + 0.25
                    );
                });
            }

            /* ================= MOBILE ================= */
            if (mobileProgressRef.current) {
                gsap.fromTo(
                    mobileProgressRef.current,
                    {
                        scaleY: 0,
                        transformOrigin: "top center",
                    },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: ".mobile-steps",
                            start: "top 90%",
                            end: "bottom 80%",
                            scrub: 0.3,
                        },
                        markers: true, 
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // useEffect(() => {
    //     const crtx2 = gsap.context(() => {
    //         gsap.to(sectionRef.current, {
    //             scrollTrigger: {
    //                 trigger: sectionRef.current,
    //                 start: "bottom 100%",
    //                 end: "bottom 70%",
    //                 scrub: 0.5,
    //             },
    //             // scale:0.5,
    //             // borderRadius: "20px",
    //             y: -200,
    //             ease: "none",
    //         });
    //     }, sectionRef);

    //     return () => crtx2.revert();
    // }, []);

    return (
        <div ref={sectionRef} id='process' className='desktop-steps bg-cloudy-Apple relative min-h-screen lg:h-180'>

            <motion.div 
              className="relative top-0 pt-6 sm:pt-8 lg:pt-10 text-center text-pink-600 font-medium tracking-wider uppercase text-xs sm:text-sm lg:text-base my-6 sm:my-8 lg:my-10"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: false, margin: "-100px" }}
            >
                How It Works
            </motion.div>
            
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl relative text-center  font-bold text-purple-900 mb-4 sm:mb-6 lg:mb-8 leading-tight px-4 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: false, margin: "-100px" }}
            >
                Simple Steps to Your First Session
            </motion.h2>
            
            <motion.div 
              className="text-blueGray text-center max-w-lg sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mb-8 sm:mb-10 lg:mb-12 text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed px-4 sm:px-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: false, margin: "-100px" }}
            >
                We've made the process as gentle and straightforward as possible, so you can focus on what matters — your well-being.
            </motion.div>


            {/* ================= DESKTOP ================= */}
            <div className=" hidden md:block">
                {/* Titles */}
                <div className="flex w-[90vw] items-center justify-items-stretch mx-auto gap-4 mb-16 text-center">
                    {steps.map((step, i) => (
                        <div className={`desktop-step-${i} rounded-2xl  py-5 px-4 flex flex-col items-center w-auto h-fit border border-gray-300 relative`} key={i}>
                            <div className="relative text-Primary-purple bg-purple4 mb-3 rounded-full px-2 self">{step.id}</div>
                            <div

                                className={` text-purple2 mb-3 font-semibold transition-colors`}
                            >
                                {step.title}
                            </div>
                            <p className="text-Primary-purple text-sm">
                                {step.description}
                            </p>

                        </div>

                    ))}
                </div>

                {/* Progress */}
                <div className="relative w-[78vw] mx-auto ">
                    <div className="h-1 bg-gray-200  rounded-full">
                        <div ref={desktopProgressRef} className=" h-full w-0  rounded-full bg-linear-to-r from-pink-600 to-purple-400" />
                    </div>

                    {/* Icons */}
                    <div className="absolute -top-5 left-0 w-full flex justify-between">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                ref={(el) => { desktopIconsRef.current[i] = el; }}
                                className="w-fit h-full bg-white rounded-full shadow-md flex items-center relative justify-center scale-0 opacity-0"
                            >
                                <Image
                                    src={step.icon}
                                    alt='icon'
                                    width={32}
                                    height={32}
                                    className='m-1' />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= MOBILE ================= */}
            <div className="mobile-steps md:hidden relative w-full pb-20">
                <div className="px-4 py-8">
                    {/* Timeline Container */}
                    <div className="relative min-h-fit">
                        {/* Vertical Progress Bar */}
                        <div className="absolute left-[19px] top-0 w-1 h-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                ref={mobileProgressRef}
                                className="w-full h-full bg-gradient-to-b from-pink-600 to-purple-400 rounded-full"
                            />
                        </div>

                        {/* Steps */}
                        <div className="space-y-8 md:space-y-12">
                            {stepsMobile.map((step, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-start gap-6 relative"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                    viewport={{ once: false, margin: "-50px" }}
                                >
                                    {/* Icon Circle - Left Side */}
                                    <motion.div
                                        // ref={(el) => { mobileIconsRef.current[i] = el; }}
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                                
                                        // whileOutOfView={{ scale: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: i * 0.12,
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 15
                                        }}
                                        viewport={{ once: false, margin: "-50px" }}
                                        className="w-14 h-14 min-w-14 min-h-14 bg-white rounded-full shadow-lg flex items-center justify-center shrink border-2 border-pink-600 relative z-20"
                                    >
                                        <div className=" ">

                                        
                                        </div>
                                    </motion.div>

                                    {/* Content - Right Side */}
                                    <motion.div
                                        className="flex-1 pt-1"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: i * 0.12,
                                            type: "spring",
                                            stiffness: 80,
                                            damping: 12
                                        }}
                                        viewport={{ once: false, margin: "-50px" }}
                                    >
                                        
                                        {/* Step Number Badge */}
                                        <motion.div
                                            className="inline-block relative  text-pink-600 px-3 py-1 rounded-full text-xs font-semibold mb-2"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: i * 0.12,
                                                type: "spring",
                                                stiffness: 150
                                            }}
                                            viewport={{ once: false, margin: "-10px" }}
                                        >
                                            <div className="flex items-center absolute -left-12 bg-white rounded-full shadow-lg p-2 gap-2">

                                        {step.icon}
                                        </div>
                                        <span className="bg-pink-100 inline-block  text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">

                                            Step {step.id}
                                        </span>
                                        </motion.div>

                                        {/* Title */}
                                        <motion.h4
                                            className="font-bold text-lg text-purple-900 mb-1"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                delay: i * 0.12
                                            }}
                                            viewport={{ once: false, margin: "-50px" }}
                                        >
                                            {step.title}
                                        </motion.h4>

                                        {/* Description */}
                                        <motion.p
                                            className="text-gray-600 text-sm leading-relaxed"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                delay: i * 0.12
                                            }}
                                            viewport={{ once: false, margin: "-50px" }}
                                        >
                                            {step.description}
                                        </motion.p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="h-screen"></div> */}
        </div>

    )
}

export default Process
