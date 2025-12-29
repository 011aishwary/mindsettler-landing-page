"use client";

import gsap from "gsap";

import { forwardRef, use } from "react";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import SplitType from "split-type";
import { contain } from "three/src/extras/TextureUtils.js";

const ShatterSection = forwardRef<HTMLDivElement>((props, ref) => {
  const rows = 5;
  const cols = 5;
  const tiles = Array.from({ length: rows * cols });
  const section2 = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const spacing = 150; // Adjust spacing between cards
  const total = 4;

  const card = [
    { id: 1, image: "/assets/brain.svg", heading: "What is Psycho-Education?", content: "Structured learning about mental processes, emotions, and behaviors — empowering you with knowledge to understand yourself better." },
    { id: 2, image: "/assets/heart.svg", heading: "Why Awareness Matters", content: "Self-awareness is the foundation of change. When you understand your patterns, you gain the power to reshape them." },
    { id: 3, image: "/assets/compass.svg", heading: "Guidance, Not Therapy", content: "This is about education and clarity — a space to learn, reflect, and grow without clinical pressure." },
    { id: 4, image: "/assets/shield.svg", heading: "Safe Environment", content: "Complete confidentiality and privacy in a supportive, secure setting." },
  ]

  useEffect(() => {
    gsap.fromTo(".Heading1",
      {
        opacity: 0,
        y: -100,          // Start 100px lower
        skewY: 2        // Slight tilt for a more dynamic feel
      },
      {
        opacity: 1,
        y: 0,
        skewY: 0,
        duration: 1.2,
        ease: "power4.out", // Smooth deceleration
        scrollTrigger: {
          trigger: section2.current, // Use your section ref/class
          start: "top 80%",     // Animation starts when the top of the section hits 80% of viewport height
          toggleActions: "play none none reverse", // Plays on scroll down, reverses on scroll up
          // scrub: 0.2,
        }
      }
    );
  }, []);
  useEffect(() => {
    gsap.fromTo(".SubHeading1",
      {
        opacity: 0,
        x: 100,          // Start 100px lower
        skewY: 2        // Slight tilt for a more dynamic feel
      },
      {
        opacity: 1,
        x: 0,
        skewY: 0,
        duration: 1.2,
        ease: "power3.out", // Smooth deceleration
        scrollTrigger: {
          trigger: ".Heading1", // Use your section ref/class
          start: "top 90%",     // Animation starts when the top of the section hits 80% of viewport height
          toggleActions: "play none none reverse", // Plays on scroll down, reverses on scroll up
          scrub: 0.2,
        }
      }
    );
  }, []);
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".SubHeading1", // Use your section ref/class
        start: "top 50%",     // Animation starts when the top of the section hits 80% of viewport height
        toggleActions: "play none none reverse", // Plays on scroll down, reverses on scroll up
        scrub: 0.5,
      }
    });


    tl.fromTo(".Card",
      {
        opacity: 0,

        x: (i) => {

          return spacing * (i - (total - 1) / 2);
        },
        rotateZ: 20,
        
        skewY: 2     
      },
      {
        opacity: 1,
        rotateZ: 0,
        x: 0,
        skewY: 0,
        stagger: 0.1,
        duration: 1.2,
        scrollTrigger: {
          trigger: ".Card",
          start: "top 30%",
          end: "top 10%",
          toggleActions: "play none none reverse",
        },
        ease: "power3.out", // Smooth deceleration
        markers: true,
      })
      .fromTo(".Card1",
        {
          opacity: 0,
          x: 100,          // Start 100px lower
          skewY: 2        // Slight tilt for a more dynamic feel
        },
        {
          opacity: 1,
          x: 0,
          skewY: 0,
          duration: 1.2,
          ease: "power3.out", // Smooth deceleration

        }
      )
      tl.fromTo(".Card2",
        {
          opacity: 0,
          x: -100,          // Start 100px lower
          skewY: 2        // Slight tilt for a more dynamic feel
        },
        {
          scrollTrigger:{
            trigger: ".card1",
            start:"top 50%"

          },
          opacity: 1,
          x: 0,
          skewY: 0,
          duration: 1.2,
          ease: "power3.out", // Smooth deceleration

        }
      );
  }, []);

  useEffect(() => {
    gsap.fromTo(".bgwite", {
      opacity: 0,
    }, {
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".bgwite",
        start: "top 60%",
        toggleActions: "play none none reverse",
        // markers: true,
      }
    });
  }, []);


  useEffect(() => {
    // 1. Split text into words
    const text = new SplitType('.Card3', { types: 'words' });

    // 2. Animate words from dim to bright
    gsap.fromTo(text.words,
      {
        opacity: 0.2, // The "dim" state
        color: "var(--color-Primary-purple)"// Or use your gradient colors
      },
      {
        opacity: 1,   // The "lit" state
        color: "var(--color-Primary-purple)/30%", // Or use your gradient colors
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".SubHeading1",
          start: "top 60%", // Starts when the top of text hits 80% of screen
          end: "bottom 30%",   // Ends when it reaches 20% of screen
          scrub: true,      // Essential: links animation to scroll distance
          // markers: false    // Set to true to see the start/end lines during dev
        }
      }
    );
  }, []);

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".Card");

    cards.forEach(card => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { scale: 0.97, duration: 0.1 ,boxShadow:"0 10px 20px rgba(0, 0, 0, 0.2)" , translateY:-15});
      });
      
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { scale: 1, duration: 0.1, boxShadow: "none" , translateY:0  });
      });
    });
    const icons = gsap.utils.toArray<HTMLElement>(".Card1 img");

    icons.forEach(icon => {
      icon.addEventListener("mouseenter", () => {
        gsap.to(icon, {rotateZ:10, duration: 0.1  });
      });
      
      icon.addEventListener("mouseleave", () => {
        gsap.to(icon, {rotateZ:0, duration: 0.1  });
      });
    });

    // Cleanup event listeners on unmount
    return () => {
      cards.forEach(card => {
        card.removeEventListener("mouseenter", () => {});
        card.removeEventListener("mouseleave", () => {});
      });
      icons.forEach(icon => {
        icon.removeEventListener("mouseenter", () => {});
        icon.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);



  return (
    <section
      ref={ref}
      className="relative h-full lg:h-fit w-full bg-calm-soft overflow-hidden z-10"
    >
      <div ref={section2} className="bgwite bg-pink5/2 backdrop-blur-[2px] z-20 h-full w-full absolute" />
      <div
        className="grid absolute w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {tiles.map((_, i) => {
          const x = (i % cols) * 25; // Calculation for 5x5 grid
          const y = Math.floor(i / cols) * 25;

          return (
            <div
              key={i}
              className="tile bg-cover"
              style={{
                backgroundImage: "url('/gradientinfo.jpeg')",
                backgroundSize: "500% 500%",
                backgroundPosition: `${x}% ${y}%`
              }}
            />
          );
        })}
      </div>
      <div ref={section2} className="relative inset-0 h-full lg:h-screen flex flex-col items-center justify-start  z-30">
        <div className="Heading1 relative top-0 pt-10 text-center  text-pink-600 font-medium tracking-wider uppercase text-sm mb-2">
          What is MindSettler
        </div>
        <h2 className="SubHeading1 text-3xl relative  text-center lg:text-5xl font-serif font-bold text-purple-900 mb-2 leading-tight">
          First Step is Awareness
        </h2>
        <div className="text-blueGray text-center max-w-[60vw] max-sm:max-w-screen max-sm:text-xs max-sm:px-5 mx-auto  text-md font-medium leading-relaxed">
          MindSettler is a psycho-education and counseling service designed to help individuals understand their mental health, build awareness, and receive personalized guidance in a safe, confidential environment.            </div>
        <div ref={containerRef} className="CarHead  flex Heading1 flex-col  min-[600px]:flex-row gap-5 min-[960px]:[5vw] items-center justify-evenly min-[850px]:justify-center w-full  my-10 max-sm:my-2 p-6 m-4 ">
          {card.map((card, index) => (
            <div key={index} className="Card overflow-hidden max-sm:w-[70vw] transition-all duration-300 hover:-bg-conic-330 hover:scale-95  flex flex-col max-[600px]:w-[50vw] w-[30vw] min-[960px]:w-[22vw] min-[1050px]:w-[20vw]  bg-Primary-purple/20 backdrop-blur-sm rounded-2xl border-0  shadow-md items-center  text-center justify-start space-y-4 px-4 py-4 h-[-webkit-fill-available]">
              <div className="Card1 bg-purple3/40 rounded-2xl p-2 text-center">
                <Image
                  src={card.image}
                  alt={card.heading}
                  width={40}
                  height={40}
                  className="Card1Img "
                />
              </div>
              <h2 className="Card2 text-center font-semibold text-Primary-purple">{card.heading}</h2>
              <p className=" Card3 text-purple3 opacity-100 transition-opacity ease-in duration-500 text-center">{card.content}
              </p>
            </div>

          ))}
        </div>
      </div>
    </section>
  );
});

ShatterSection.displayName = "ShatterSection";
export default ShatterSection;