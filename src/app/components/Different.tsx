import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
gsap.registerPlugin(ScrollTrigger);

const Different = () => {
    const cards = [
        { id: 1, title: "Structured Sessions", description: "Every session follows a thoughtful framework designed to maximize your growth and understanding.", icon: "/assets/stack.svg" },
        { id: 2, title: "Complete Confidentiality", description: "Your privacy is sacred. Everything shared stays between you and your counselor.", icon: "/assets/lock.svg" },
        { id: 3, title: "Personalized Guidance", description: "No one-size-fits-all approaches. Your sessions are tailored to your unique needs and goals.", icon: "/assets/profilecheck.svg" },
        { id: 4, title: "Online & Offline Options", description: "Choose the format that works best for you — from home or at our peaceful studio.", icon: "/assets/laptop.svg" },
        { id: 5, title: "Corporate Programs", description: "Specialized workshops and sessions designed for organizational mental wellness.", icon: "/assets/buildings.svg" },
        { id: 6, title: "Non-Judgmental Space", description: "Express yourself freely in an environment of acceptance and understanding.", icon: "/assets/hearthand.svg" },
    ]

    const different = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const crtx = gsap.context(() => {
            gsap.to(different.current, {
                scrollTrigger: {
                    trigger: different.current,
                    start: "top bottom",
                    end: "bottom 80%",
                    scrub: true,
                    anticipatePin: 1, // Smooths out layout changes
    fastScrollEnd: true, // Prevents snapping/jitter at the end
    invalidateOnRefresh: true // Recalculates if height changes

                },
                y: -1000,
                
                marginBottom:-1000,
                duration: 1,
                ease: "none",
            })
        });
        return () => crtx.revert();
    }, []);

    return (
        <div className=''>
            <div ref={different} className="bg-cloudy-AppleRev overflow-hidden mx-auto lg:min-h-fit pb-10 w-screen px-10">
                <div className=" relative top-0 pt-10 text-center  text-pink-600 font-medium tracking-wider uppercase text-sm mb-2">
                    Why Choose Us
                </div>
                <h2 className="text-3xl relative  text-center lg:text-5xl font-serif font-bold text-purple-900 mb-2 leading-tight">
                    What Makes MindSettler Different
                </h2>
                <div className="text-blueGray text-center max-w-[60vw] mx-auto mb-12 text-md font-medium leading-relaxed">
                    We combine professional expertise with genuine care to create an experience that truly supports your mental well-being.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div key={card.id} className="rounded-xl bg-white shadow-md p-6 hover:shadow-xl transition">
                            <div className="bg-Primary-pink/30 rounded-2xl w-fit mb-2">
                                <Image src={card.icon} alt={card.title} width={40} height={40} className="p-2" />
                            </div>
                            <h3 className="text-xl text-purple2 font-light mb-2">{card.title}</h3>
                            <p className="text-gray-600">{card.description}</p>
                        </div>

                    ))}






                </div>

            </div>

        </div>
    )
}

export default Different
