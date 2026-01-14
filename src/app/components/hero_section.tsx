"use client";

// import { motion } from "framer-motion";
import MindsettlerHero from "./StoryJourney";
import ScrollPage from "./ScrollPage";


import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight,  Play } from "lucide-react";
import { Button } from "../components/ui/button1";
import heroJourney from "@/assets/hero-journey.jpg";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FetchUser from "./FetchUser";

export const fetchUserData = async () => {
  const userData = await FetchUser()
  console.log("User data fetched on home page.", userData);
  return userData;
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [user, setUser] = useState<any>(null);
    useEffect(() => {
      fetchUserData().then(setUser);
      if (user) {
        console.log("User data fetched on home page:", user);
        console.log("User email:", user.$id);  // Access values here
      }
    }, []);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleBlob = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const rotateBlob = useTransform(scrollYProgress, [0, 1], [0, 20]);

  return (
    <>
      <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements with Parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating blob with parallax */}
          <motion.div
            initial={{ opacity: 1, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              y: backgroundY,
              scale: scaleBlob,
              rotate: rotateBlob,
            }}
            className="absolute -top-40 -right-40 inset-0  z-50 gradient-mindsettler w-screen h-screen  rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 1, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
            style={{
              y: useTransform(scrollYProgress, [0, 1], [0, 200]),
              rotate: useTransform(scrollYProgress, [0, 1], [0, -15]),
            }}
            className="absolute -bottom-40 z-20 -left-40 gradient-soft-glow w-[500px] h-[500px] gradient-hero rounded-full blur-3xl"
          />

          {/* Subtle floating circles with enhanced parallax */}
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]) }}
            className="absolute top-1/4 left-1/4 z-20"
          >
            <motion.div
              animate={{
                y: [-10, 10, -10],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-4 rounded-full bg-accent shadow-lg shadow-accent/20"
            />
          </motion.div>
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -120]) }}
            className="absolute top-1/3 right-1/3 z-20"
          >
            <motion.div
              animate={{
                y: [10, -10, 10],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-6 rounded-full bg-primary/25 "
            />
          </motion.div>
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -60]) }}
            className="absolute bottom-1/3 right-1/4 z-20"
          >
            <motion.div
              animate={{
                y: [-15, 15, -15],
                x: [-5, 5, -5],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="w-3 h-3 rounded-full bg-accent/30 z-20"
            />
          </motion.div>

          {/* Additional floating elements */}
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
            className="absolute z-20 top-1/2 left-1/6  "
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-purple2"
            />
          </motion.div>
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -140]) }}
            className="absolute z-20 top-2/3 right-1/6"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-5 rounded-full bg-lavender-medium blur-[2px]"
            />
          </motion.div>
        </div>

        <motion.div
          style={{  }}
          className="container mx-auto px-6 lg:px-8 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge with hover effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              // viewport={{ once: true }}
            >
              <motion.span
                whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(221, 23, 100, 0.15)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 cursor-default"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full  bg-accent"
                />
                Your mental well-being matters
              </motion.span>
            </motion.div>

            {/* Main Headline with stagger */}
            <motion.h1
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 , ease: "easeOut"}}
              className="mt-8 text-4xl  sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-primary leading-tight"
            >
              <motion.span
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Settle your mind.
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary"
              >
                One step at a time.
              </motion.span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 text-lg  sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              MindSettler helps you understand your mental health and navigate life's challenges
              through structured, confidential sessions focused on awareness, guidance, and
              personalized support.
            </motion.p>

            {/* CTA Buttons with enhanced hover */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                  <Link href={`${user ? `/patient/${user.$id}/new-appointment` : '/Signup'}`}>
                <Button variant="hero" className="group relative overflow-hidden">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Book Your First Session
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                  </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="#howitworks">
                <Button variant="hero-secondary" className="group">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  How It Works
                </Button>
                  </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators with stagger animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="my-5 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              {[
                { text: "100% Confidential", delay: 1.3 },
                { text: "Non-judgmental Space", delay: 1.4 },
                { text: "Personalized Guidance", delay: 1.5 },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: item.delay }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                  >
                    <span className="text-primary font-semibold">✓</span>
                  </motion.div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator with enhanced animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          style={{ opacity: opacityContent }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <motion.div
              animate={{ opacity: [1, 0, 1], y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-primary/50"
            />
          </motion.div>
        </motion.div>

        {/* Hero Image with Parallax */}
        <motion.div
          // 1. ENTRANCE ANIMATION (Outer Wrapper)
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute inset-0 w-full h-full pointer-events-none z-10" // Added z-10 to ensure visibility
        >
          {/* <motion.div
            // 2. SCROLL PARALLAX (Inner Wrapper)
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
            className="w-full h-full relative"
          >
            
            <div className="absolute inset-0 w-screen h-100 hero-overlay-gradient z-20" />

          
            <Image
              src={'/heroJourney.jpg'}
              alt="A peaceful journey path through mountains representing mental wellness"
              className="w-full h-full object-cover object-top opacity-5" // Removed z-index here, let parent handle stacking
              width={1920}
              height={1000}
            />
          </motion.div> */}
        </motion.div>
      </section>
      <ScrollPage />
    </>
  );
};
