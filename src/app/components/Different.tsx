"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const Different = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll Progress Hooks
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // --- SCROLL DRIVEN ANIMATIONS ---
    const headingOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const headingScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
    const headingBlur = useTransform(scrollYProgress, [0, 0.3], ["0px", "10px"]);
    const cardsY = useTransform(scrollYProgress, [0, 1], [0, -100]);

    const cards = [
        { id: 1, title: "Structured Sessions", description: "Every session follows a thoughtful framework designed to maximize your growth and understanding.", icon: "/assets/stack.svg" },
        { id: 2, title: "Complete Confidentiality", description: "Your privacy is sacred. Everything shared stays between you and your counselor.", icon: "/assets/lock.svg" },
        { id: 3, title: "Personalized Guidance", description: "No one-size-fits-all approaches. Your sessions are tailored to your unique needs and goals.", icon: "/assets/profilecheck.svg" },
        { id: 4, title: "Online & Offline Options", description: "Choose the format that works best for you — from home or at our peaceful studio.", icon: "/assets/laptop.svg" },
        { id: 5, title: "Corporate Programs", description: "Specialized workshops and sessions designed for organizational mental wellness.", icon: "/assets/buildings.svg" },
        { id: 6, title: "Non-Judgmental Space", description: "Express yourself freely in an environment of acceptance and understanding.", icon: "/assets/hearthand.svg" },
    ];

    return (
        <section
            ref={containerRef}
            className="relative bg-gradient-to-b from-cloudy-AppleRev via-white to-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            {/* Background Ambient Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/30 rounded-full blur-[100px]"
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* --- STICKY HEADER SECTION --- */}
                <div className="sticky top-10 mb-20 z-0 h-fit">
                    <motion.div
                        style={{
                            opacity: headingOpacity,
                            scale: headingScale,
                            filter: `blur(${headingBlur})`
                        }}
                        className="text-center"
                    >
                        {/* Animated Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            // viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-8 backdrop-blur-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            Why Choose MindSettler
                        </motion.div>

                        {/* Main Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            // viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight mb-6"
                        >
                            What Makes Us{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary relative inline-block">
                                Different
                                <motion.span
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                    className="absolute bottom-1 left-0 h-1 bg-accent/30 rounded-full"
                                />
                            </span>
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                        >
                            We combine professional expertise with genuine care to create an experience designed purely for your mental well-being.
                        </motion.p>
                    </motion.div>
                </div>

                {/* --- SCROLLING CARDS GRID --- */}
                <motion.div
                    style={{ y: cardsY }}
                    className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 active:pb-20"
                >
                    {cards.map((card, index) => (
                        // <motion.div
                        //     key={card.id}
                        //     initial={{ opacity: 0, y: 150, scale: 0.95 }}
                        //     whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        //     viewport={{ once: false, margin: "-50px" }}
                        //     transition={{ duration: 0.5, delay: index * 0.1 }}
                        // >
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 1, y: 150 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.1, delay: index * 0.1 }}
                                whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                                className="group relative bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-sm hover:border-accent/30 transition-all duration-300"
                            >
                                {/* Hover Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Icon Box */}
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative h-16 w-16 mb-6 rounded-2xl bg-gradient-to-br from-Primary-pink/20 to-primary/10 flex items-center justify-center p-3 shadow-inner"
                                >
                                    <Image
                                        src={card.icon}
                                        alt={card.title}
                                        width={40}
                                        height={40}
                                        className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                </motion.div>

                                {/* Text Content */}
                                <div className="relative">
                                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                                        {card.description}
                                    </p>
                                </div>

                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-2 h-2 rounded-full bg-accent/40" />
                                </div>
                            </motion.div>
                        // </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default Different;