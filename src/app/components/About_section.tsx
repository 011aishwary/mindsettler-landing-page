"use client";
import React, { use, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { title } from 'process';
import { desc } from 'framer-motion/client';

const journeySteps = [
    {
        id: 1,
        title: "Awareness",
        description: "Recognize and acknowledge your thoughts, feelings, and patterns that affect your well-being.",
        icon: "/assets/sparkle.svg",
    },
    {
        id: 2,
        title: "Understanding",
        description: "Gain deeper insights into why you feel the way you do and what triggers certain responses.",
        icon: "/assets/bulb.svg",
    },
    {
        id: 3,
        title: "First Session",
        description: "Take your first step in a safe, confidential space where you're heard without judgment.",
        icon: "/assets/chat.svg",
    },
    {
        id: 4,
        title: "Structured Guidance",
        description: "Receive personalized strategies and tools tailored to your unique situation and goals.",
        icon: "/assets/map.svg",
    },
    {
        id: 5,
        title: "Ongoing Support",
        description: "Continue your journey with consistent support as you build lasting mental wellness habits.",
        icon: "/assets/normalheart.svg",
    },
]


// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const AboutMindSettler = () => {
    const aboutref = useRef<HTMLDivElement>(null);
    const panels: React.RefObject<HTMLElement>[] = []; // Initialize this array appropriately in your component

    const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
    const mainHead = useRef<HTMLSpanElement>(null);
    const bottomHead = useRef<HTMLDivElement>(null);


    // Data for your steps
    const steps = [
        {
            id: 1,
            title: "Bridging the gap between feeling and knowing.",
            content: "MindSettler was born from a simple realization: trying to navigate life's challenges without understanding your own mind is like trying to drive without a map.",
            style: "bg-slate-900 text-blue-400",
        },
        {
            id: 2,
            title: "Settle your mind.",
            content: "MindSettler helps you understand your mental health and navigate life's challenges through structured, confidential sessions focused on awareness, guidance, and personalized support.",
            style: "bg-blue-900 text-white",
        },
        {
            id: 3,
            title: "Understanding Your Path to Mental Clarity",
            content: "Whether you're dealing with stress, anxiety, relationship challenges, or simply seeking personal growth, MindSettler provides a structured approach to help you find balance and clarity.",
            style: "bg-indigo-900 text-teal-300",
        },
        {
            id: 4,
            title: "What Makes MindSettler Different",
            content: "We combine professional expertise with genuine care to create an experience that truly supports your mental well-being",
            style: "bg-emerald-900 text-white",
        },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(mainHead.current,
                {
                    opacity: 0,
                    x: 150,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: mainHead.current, // Use your section ref/class
                        start: "top 70%",     // Animation starts when the top of the section hits 80% of viewport height
                        end: "top 50%",
                        toggleActions: "play none none reverse", // Plays on scroll down, reverses on scroll up
                        // scrub: true,
                    }
                });
        });
        return () => ctx.revert();
    }, []);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(bottomHead.current,
                {
                    opacity: 0,
                    y: -50,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: bottomHead.current, // Use your section ref/class
                        start: "top 80%",     // Animation starts when the top of the section hits 80% of viewport height
                        end: "top 60%",
                        toggleActions: "play none none reverse", // Plays on scroll down, reverses on scroll up
                        scrub: true,
                    }
                });
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const totalPanels = steps.length;
            let currentIndex = 0;

            // 1. Initial Setup: Hide all panels except the first one
            gsap.set(panelsRef.current, { autoAlpha: 0, display: "none" });
            gsap.set(panelsRef.current[0], { autoAlpha: 1, display: "block" });

            // 2. Create the Transition Function
            const gotoPanel = (index: number, isScrollingDown: boolean) => {
                if (index === currentIndex) return;

                const target = panelsRef.current[index];
                const current = panelsRef.current[currentIndex];

                // Animate Current (Outgoing)
                gsap.to(current, {

                    autoAlpha: 0,
                    scale: 0.6,
                    display: "none",
                    x: isScrollingDown ? -500 : 500, // Move opposite to scroll


                    duration: 0.6,
                    ease: "power2.inOut",
                });

                // Animate Target (Incoming)
                gsap.fromTo(
                    target,
                    { autoAlpha: 0, x: isScrollingDown ? 500 : -500 },
                    {
                        autoAlpha: 1,
                        scale: 1,
                        x: 0,
                        y: 0,
                        display: "block",
                        duration: 0.6,
                        ease: "power2.inOut", // "Out" ease feels snappy for arrival
                        delay: 0.1, // Slight pause for drama
                    }
                );

                currentIndex = index;
            };

            // 3. Create the ScrollTrigger
            ScrollTrigger.create({
                trigger: aboutref.current,
                start: "center center",
                end: "+=1000", // Virtual scroll height (tweak for scroll sensitivity)
                pin: true,
                scrub: true, // Links progress to scrollbar
                snap: {
                    snapTo: 1 / (totalPanels - 1), // Calculate snap points
                    duration: 0.5,
                    delay: 0.1,
                    ease: "power1.inOut",
                },
                onUpdate: (self) => {
                    // Map scroll progress (0 to 1) to panel index (0 to 3)
                    const newIndex = Math.round(self.progress * (totalPanels - 1));

                    if (newIndex !== currentIndex) {
                        const isScrollingDown = newIndex > currentIndex;
                        gotoPanel(newIndex, isScrollingDown);
                    }
                },
            });
        }, aboutref);
        return () => ctx.revert();

    }, []);



    useEffect(() => {

        gsap.fromTo(aboutref.current,
            {
                opacity: 0,
                y: 100,
                scale: 0.7,
                borderRadius: "200px",

            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                borderRadius: "0px",
                duration: 1.2,
                scrollTrigger: {
                    trigger: aboutref.current, // Use your section ref/class
                    start: "top 90%",     // Animation starts when the top of the section hits 80% of viewport height
                    end: "top 60%",
                    toggleActions: "play none none reverse", // Plays on scroll down, reverses on scroll up
                    scrub: true,
                }

            },
        )

    }, [])

    // portrait animation
    useEffect(() => {

        const crtx = gsap.context(() => {
            gsap.fromTo(".portrait1", {

                autoAlpha: 0,
                scale: 0.8,
                y: 500,
                rotateY: 180,
            },
                {
                    autoAlpha: 1,
                    scale: 1,
                    y: 0,
                    rotateY: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: aboutref.current, // Use your section ref/class
                        start: "top 100%",     // Animation starts when the top of the section hits 80% of viewport height
                        toggleActions: "play none none reverse", // Plays on scroll down, reverses on scroll up
                        // scrub: true,
                    }
                })
        })
        return () => crtx.revert();


    }, []);

    useEffect(() => {
        const crtx2 = gsap.context(() => {
            gsap.fromTo(".sec2", {

                scale: 0.5,
                top: "10vh",
                borderRadius: "40px",
                justifySelf: "center",
                alignSelf: "center",
                y: -100,
            }, {

                scale: 1,
                top: "0vh",
                borderRadius: "0%",
          
                y: 0,
                duration: 1.5,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: ".bgwiteabout", // Use your section ref/class
                    start: "top 80%",     // Animation starts when the top of the section hits 80% of viewport height
                    end: "top center",
                    toggleActions: "play none none reverse", // Plays on scroll down, reverses on scroll up
                    scrub: true,
                    // markers: true,
                },
                
            });
        })
        return () => crtx2.revert();


    }, []);


    useEffect(() => {
        gsap.utils.toArray<HTMLElement>(".mountain").forEach(layer => {
            const speed = parseFloat(layer.dataset.speed || '0');

            gsap.to(layer, {
                y: () => -window.innerHeight * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: ".bgwiteabout",
                    start: "top 40%",
                    end: "bottom center",
                    toggleActions: "play none none reverse",
                    scrub: true,
                }
            });
        });

    }, []);



    return (
        <>
            <div className='h-fit overflow-hidden relative w-screen '>
                {/* <div className="h-screen w-screen"> */}
{/* 
                <Image src="/gradient2rev.png" alt="About Mindsettler Background"
                    className="h-[50vh] w-screen absolute z-1 "
                    height={500}
                    width={500}
                />
                <div className='bg-white/30 absolute backdrop-blur-[2px] inset-0 m-0 p-0 z-2' /> */}
                <div ref={aboutref} className="h-full overflow-hidden  relative   inset-0 w-screen z-5 ">
                    {/* <div className='cove bg-white/30 absolute backdrop-blur-[2px] rounded inset-0 z-2' /> */}

                    {/* </div> */}
                    <section className="py-1 lg:py-10 h-full  bg-white relative z-20">
                        <div className="container mx-auto relative px-6 md:px-12">

                            {/* Flex Container: Stacks on mobile (col), Side-by-side on desktop (row) */}
                            <div className="flex flex-col lg:flex-row items-center justify-between relative h-[120vh] gap-12 max-sm:gap-2  lg:gap-20">

                                {/* ============ LEFT SIDE: IMAGE ============ */}
                                {/* We use w-full lg:w-1/2 to take half space on desktop */}
                                <div className="w-full lg:w-1/2  relative flex justify-center lg:justify-end">

                                    {/* Optional Decorative Blur behind image for depth */}
                                    <div className="portrait1 absolute -inset-4 bg-purple-200/50 blur-3xl rounded-[50px] -z-10 transform rotate-3"></div>

                                    {/* The Image Container with Arch Shape */}
                                    {/* aspect-[3/4] forces a portrait ratio. rounded-t-[4rem] creates the arch top. */}
                                    <div className="portrait1 relative w-full max-w-md aspect-[3/4] rounded-t-[4rem] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-white z-10">
                                        <img

                                            src="/portrait.png"
                                            alt="Founder of MindSettler"
                                            className=" w-full h-full object-cover "
                                        />
                                    </div>
                                </div>


                                {/* ============ RIGHT SIDE: CONTENT ============ */}
                                <div className="w-full max-sm:w-screen  lg:w-1/2  relative  h-[-webkit-fill-available] max-lg:scale-75 flex flex-col justify-around items-start">

                                    {/* Small Overline Tag */}
                                    <span ref={mainHead} className="inline-block   absolute  mx-auto max-sm:-top-10 top-0 max-sm:  sm:mt-10  text-pink-600 font-medium tracking-wider uppercase text-sm mb-4">
                                        About MindSettler
                                    </span>


                                    {steps.map((step, i) => (
                                        <div
                                            key={step.id}
                                            ref={(el) => {panelsRef.current[i] = el;}}
                                            className="absolute max-sm:h-fit "
                                        >
                                            <h2 className="text-3xl relative   lg:text-5xl font-serif font-bold text-purple-900 mb-6 leading-tight">
                                                {step.title}
                                            </h2>
                                            <div className="space-y-1 relative text-lg text-gray-600 leading-relaxed font-sans">
                                                <p>
                                                    {step.content}
                                                </p>

                                            </div>
                                            <div className="absolute bottom-10 text-sm opacity-50 uppercase tracking-widest">
                                                Part {i + 1} / {steps.length}
                                            </div>
                                        </div>
                                    ))}


                                    {/* Optional subtle call to action or signature area */}
                                    <div ref={bottomHead} className="mt-2 pt-4 border-t absolute bottom-0 mb-10 border-purple-100 flex items-center">
                                        <span className="text-purple-800 font-medium mr-4">Are you ready to find clarity?</span>
                                        <a href="#contact" className="text-pink-600 hover:text-pink-700 font-semibold underline-offset-4 hover:underline transition-all">
                                            Read Our Full Story &rarr;
                                        </a>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </section>
                </div>

            </div>
            <div className="bg-white inset-0 z-0 absolute"></div>
            <section className=" sec2 overflow-hidden  bg-white  flex items-center justify-center min-h-screen w-screen relative ">
                <div className="bgwiteabout lg:h-[120vh] relative self-center w-screen">
                    <div className="bg-white/70 absolute w-screen h-full z-96">
                        <div className=" relative top-0 pt-10 text-center  text-pink-600 font-medium tracking-wider uppercase text-sm mb-2">
                            Your Journey
                        </div>
                        <h2 className="text-3xl relative  text-center lg:text-5xl font-serif font-bold text-purple-900 mb-2 leading-tight">
                            The Path to Mental Clarity
                        </h2>
                        <div className="text-blueGray text-center max-w-[60vw] mx-auto mb-12 text-md font-medium leading-relaxed">
                            Every journey begins with a single step. Here's how MindSettler guides you through your personal path to mental wellness.
                        </div>


                        <div className="flex items-center  justify-center lg:flex-row flex-col lw-screen:space-y-0 space-y-6 lg:space-x-6 lg:px-20 px-4">
                            {journeySteps.map((step) => (
                                <div key={step.id} className=" lg:w-1/5 w-full relative flex flex-col items-center text-center p-4 lg:p-6 m-2 rounded-2xl  transition ">

                                    <div  className="relative card hover:-translate-y-4 transition-all duration-500 flex   flex-col items-center text-center ">
                                        <div className="bg-white icon  transition duration-300 relative  text-xl text-white rounded-full w-fit mb-4 p-3">
                                            <span className="absolute top-0 bg-Primary-pink w-5 px-2 h-5 self-center flex items-center justify-center text-center  text-sm rounded-full right-0">{step.id}</span>
                                            <Image src={step.icon} alt={step.title} width={40} height={40} className='p-2' />
                                        </div>
                                        <h3 className="text-xl text-purple2 font-light mb-2">{step.title}</h3>
                                        <p className="text-gray-600 relative text-sm">{step.description}</p>
                                    </div>
                                    <div className="bg-Primary-pink  calmLR duration-initial w-px h-4 absolute top-[50%]  right-0 self-center  z-96 ml-10 "></div>

                                </div>
                            ))}
                        </div>
                        <div className="mt-10 flex font-light items-center justify-center space-x-2  cursor-pointer">
                            <span className="text-Primary-pink hover:underline transition-all duration-300  ">Start your journey today</span>
                            <span className="text-Primary-pink font-extrabold calmLR">→</span>
                        </div>
                    </div>
                    <div className="bg-[#3a6d70] absolute w-screen h-full z-0">

                    </div>
                    <div className="relative ">
                        <Image
                            src="/Parallax/mountainsfulll1.png"
                            alt="About Mindsettler Background White"
                            className="mountain w-full h-full absolute inset-0 object-cover"
                            height={500}
                            width={1000}
                            data-speed="0.3"
                        />
                        {/* <div  className="bg-white w-20 h-20 mx-auto  rounded-full border-0 absolute inset-0"> */}

                        <Image
                            src="/Parallax/mountainsfulllastsun.png"
                            alt="About Mindsettler Background White"
                            className=" mountain w-full h-full  absolute inset-0 "
                            height={500}
                            width={500}
                            data-speed="0.4"
                        />
                        {/* </div> */}

                        <Image
                            src="/Parallax/mountainsfulllast5.png"
                            alt="About Mindsettler Background White"
                            className="mountain absolute inset-0 w-full h-full "
                            height={500}
                            width={500}
                            data-speed="0.5"
                        />
                        <Image
                            src="/Parallax/mountainsfulllast4.png"
                            alt="About Mindsettler Background White"
                            className="mountain w-full h-full absolute inset-0 "
                            height={500}
                            width={500}
                            data-speed="0.6"
                        />
                        <Image
                            src="/Parallax/mountainsfulllast3.png"
                            alt="About Mindsettler Background White"
                            className="mountain w-full h-full absolute inset-0 "
                            height={500}
                            width={500}
                            data-speed="0.6"
                        />
                        <Image
                            src="/Parallax/mountainsfulllast2.png"
                            alt="About Mindsettler Background White"
                            className="mountain w-full h-full "
                            height={500}
                            width={500}
                            data-speed="0.5"
                        />
                        {/* <Image
                            src="/Parallax/mountainsfulllast.png"
                            alt="About Mindsettler Background White"
                            className="mountain w-full h-full absolute inset-0 "
                            height={500}
                            width={500}
                            data-speed="0.9"
                        /> */}
                    </div>
                </div>
            </section>
        </>
    );


};

export default AboutMindSettler;