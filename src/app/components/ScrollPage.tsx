"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import dynamic from 'next/dynamic';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ShatterSection from "./ShatterSection";
import MindsettlerHero from "./StoryJourney";
import Link from "next/link";

export default function Home() {
  const movingDivRef = useRef<HTMLDivElement | null>(null);
  const sectionBRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {

      // 2. TILE ANIMATION (Shatter Section)
      const tiles = sectionBRef.current?.querySelectorAll(".tile") || [];
      if (tiles.length > 0) {
        gsap.from(tiles, {
          scrollTrigger: {
            trigger: sectionBRef.current,
            start: "top bottom",
            end: "top 90%",
            scrub: 3,
          },
          scale: 0,
          opacity: 0,
          rotation: 45,
          x: () => (Math.random() - 0.5) * 1200,
          y: () => (Math.random() - 0.5) * 1200,
          stagger: { amount: 1, from: "center" },
        });
      }

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="overflow-visible ">
      {/* 1. We pass movingDivRef to the Hero. The Hero attaches it to the 3D Wrapper. */}

      <div className="relative z-50">

        <MindsettlerHero divRef={movingDivRef} />
      </div>

      {/* 2. Section B */}
      <div className=" relative z-4">

        <ShatterSection ref={sectionBRef} />
      </div>
    </main>
  );
}
