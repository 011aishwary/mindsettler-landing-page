"use client";
import HeroSection from "./components/hero_section";
import { useRef, useState, useLayoutEffect, useEffect, use } from "react";
import gsap from "gsap";
import AboutMindSettler from "./components/About_section";
import Process from "./components/Process";
import Different from "./components/Different";
import Footer from "./components/Footer";
import Faq from "./components/Faq";
import Booking from "./components/Booking";
import { CorporateSection } from "./components/CorporateSection";




export default function Home() {
  const comp = useRef(null);
  const overlayTopRef = useRef(null);
  const overlayBottomRef = useRef(null);
  
  


  useLayoutEffect(() => {

    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // Entrance Animations...
      tl.to(overlayTopRef.current, {
        height: 0, duration: 1.5, top: "-10%", ease: "power4.inOut"
      })
        .to(overlayBottomRef.current, {
          height: 0, duration: 1.5, ease: "power4.inOut", bottom: "-10%", display: "none", delay: -1.5,
        });
    }, comp);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={comp}>
      <div ref={overlayTopRef} className="absolute top-0 left-0 w-full h-[50vh] bg-slate-100 z-500 flex items-end justify-center pb-4">
        <span className="text-slate-900 font-bold tracking-widest uppercase text-sm opacity-50">Inhale</span>
      </div>
      <div ref={overlayBottomRef} className="absolute bottom-0 left-0 w-full h-[50vh] bg-slate-100 z-500 flex items-start justify-center pt-4">
        <span className="text-slate-900 font-bold tracking-widest uppercase text-sm opacity-50">Exhale</span>
      </div>
      <div className="bg-white/90 w-full mt-10 h-fit overflow-hidden relative z-0">

        <HeroSection />
        < AboutMindSettler />
        <Process />
        <Different />
        <CorporateSection />
        <Booking />
        <Faq />
        <Footer />
      </div>


    </div>
  );
}
