import React from 'react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger);


const Process = () => {


    const steps = [
        { id: 1, title: "Sign Up", description: "Create your account using our simple sign-up process. Provide basic information to get started.", icon: "/assets/login.svg" },
        { id: 2, title: "Choose a Therapist", description: "Browse through our list of qualified therapists. Read profiles and select the one that fits your needs.", icon: "/assets/calendar.svg" },
        { id: 3, title: "Schedule a Session", description: "Pick a date and time that works for you. Our flexible scheduling options make it easy to find a slot.", icon: "/assets/card.svg" },
        { id: 4, title: "Attend Your Session", description: "Join your therapy session via video call from the comfort of your home. Enjoy a private and secure environment.", icon: "/assets/check.svg" },
        { id: 5, title: "Follow Up", description: "After your session, you can schedule follow-ups or access additional resources to support your mental health journey.", icon: "/assets/videocall.svg" },
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
                const mobileTL = gsap.timeline({
                    scrollTrigger: {
                        trigger: mobileProgressRef.current,
                        start: "top 80%",
                        once: true,
                    },
                });

                mobileTL.fromTo(
                    mobileProgressRef.current,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        transformOrigin: "top center",
                        duration: 3,
                        ease: "none",
                    }
                );

                mobileIconsRef.current.forEach((icon, i) => {
                    mobileTL.to(
                        icon,
                        {
                            scale: 1.25,
                            rotateZ: "45deg",
                            opacity: 1,
                            duration: 0.3,
                            ease: "back.out(1.7)",
                        },
                        i * 0.6
                    );
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const crtx2 = gsap.context(() => {
            gsap.to(sectionRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "bottom 100%",
                    end: "bottom 70%",
                    scrub: 0.5,
                },
                // scale:0.5,
                // borderRadius: "20px",
                y: -200,
                ease: "none",
            });
        }, sectionRef);

        return () => crtx2.revert();
    }, []);

    return (
        <div ref={sectionRef} className='desktop-steps bg-cloudy-Apple relative h-screen'>

            <div className=" relative top-0 pt-10 text-center  text-pink-600 font-medium tracking-wider uppercase text-sm my-10">
                How It Works
            </div>
            <h2 className="text-3xl relative  text-center lg:text-5xl font-serif font-bold text-purple-900 mb-2 leading-tight">
                Simple Steps to Your First Session
            </h2>
            <div className="text-blueGray text-center max-w-[60vw] mx-auto mb-12 text-md font-medium leading-relaxed">
                We've made the process as gentle and straightforward as possible, so you can focus on what matters — your well-being.
            </div>
            

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
                                ref={(el) => {desktopIconsRef.current[i] = el;}}
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
            <div className="mobile-steps md:hidden relative pl-8">
                {/* Vertical Track */}
                <div className="absolute left-2 top-0 w-1 h-full bg-gray-200 rounded-full">
                    <div ref={mobileProgressRef} className="mobile-progress w-full h-0 bg-gradient-to-b from-pink-600 to-purple-400 rounded-full" />
                </div>

                {/* Steps */}
                <div className="space-y-12">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-6">
                            <div
                                ref={(el) => {mobileIconsRef.current[i] = el;}}
                                className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center scale-0 opacity-0"
                            >
                                {step.icon}
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg">{step.title}</h4>
                                <p className="text-gray-500 text-sm">
                                    Complete this step to move forward.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-screen"></div>
        </div>

    )
}

export default Process
