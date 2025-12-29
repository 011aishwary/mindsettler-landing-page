"use client";
import React, { useLayoutEffect, useRef, useEffect, useState, Suspense, useMemo } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Shuffle from './Shuffle_text';
import { TextGenerateEffect } from './text_generate_effect';
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Environment, PerspectiveCamera } from '@react-three/drei'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'


// Register plugin immediately
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// --- HELPER: Forces Canvas to Resize when Animation Ends ---
function ResizeHandler() {
    const { gl, camera } = useThree();
    useEffect(() => {
        const handleResize = () => {
            const parent = gl.domElement.parentElement;
            if (parent) {
                gl.setSize(parent.clientWidth, parent.clientHeight);
                camera.updateProjectionMatrix();
            }
        };
        // Listen to window resize to fix the 3D aspect ratio dynamically
        window.addEventListener('resize', handleResize);

        // Initial call
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [gl, camera]);
    return null;
}

const MindsettlerHero = ({ divRef }: { divRef: React.RefObject<HTMLDivElement | null> }) => {
    const comp = useRef(null);

    const heroImageRef = useRef(null);
    const headlineRef = useRef(null);
    const subheadRef = useRef(null);
    const ctaRef = useRef(null);
    const circleRef = useRef(null);

    const [size, setSize] = useState({ width: 0, height: 0 });

    function explode(circle: HTMLElement) {
        // prevent spam clicks
        if (gsap.isTweening(circle)) return;

        // pop effect
        gsap.fromTo(
            circle,
            { scale: 1 },
            { scale: 1.3, duration: 0.2, ease: "back.out(2)" }
        );

        const parent = circle.parentElement;
        if (!parent) return;

        for (let i = 0; i < 10; i++) {
            const particle = document.createElement("span");
            particle.className = "particle";
            parent.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const distance = gsap.utils.random(50, 100);

            gsap.fromTo(
                particle,
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                },
                {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    scale: 0,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power3.out",
                    onComplete: () => particle.remove(),
                }
            );
        }
    }


    useEffect(() => {
        function updateSize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        updateSize(); // run once on mount
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    console.log("Current window size:", size);




    function Model({ url }: { url: string }) {

        const { scene: originalScene } = useGLTF(url);


        const scene = useMemo(() => originalScene.clone(true), [originalScene]);

        const meshRef = useRef<THREE.Group>(null);

        // --- CLEANUP LOGIC ---
        useEffect(() => {
            // Run this ONLY when the component unmounts
            return () => {
                // Traverse the CLONED scene (not the original)
                scene.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;

                        // Dispose Geometry
                        mesh.geometry?.dispose();

                        // Dispose Materials & Textures
                        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

                        materials.forEach((mat: any) => {
                            // Dispose textures found in the material
                            for (const key in mat) {
                                const value = mat[key];
                                if (value && typeof value === 'object' && 'minFilter' in value) {
                                    value.dispose();
                                }
                            }
                            // Dispose material
                            mat.dispose();
                        });
                    }
                });

            };
        }, [scene, url]);

        // --- ANIMATION LOGIC ---
        useLayoutEffect(() => {
            if (!meshRef.current) return;

            const ctx = gsap.context(() => {
                gsap.to(meshRef.current!.rotation, {
                    y: Math.PI * 2.5,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".wrapper",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true,

                    }
                });
            });

            return () => ctx.revert();
        }, []);

        return (
            <Center>
                {/* Pass the CLONED scene to the primitive */}
                <primitive
                    ref={meshRef}
                    object={scene}
                    rotation={[0, Math.PI * 1.1, 0]}
                    scale={1.9}
                />
            </Center>
        );
    }

    useLayoutEffect(() => {


        let ctx = gsap.context(() => {
            const tl = gsap.timeline();
            gsap.set([subheadRef.current, ctaRef.current], { y: 100, opacity: 0 });



            // Image...
            tl.fromTo(heroImageRef.current,
                { scale: 1.3, filter: "blur(10px)" },
                { scale: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" }, "-=1.0"
            );

            // Circle Entrance...
            tl.fromTo(circleRef.current,
                { scale: 0, opacity: 0 },
                {
                    scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.5)",
                    onComplete: () => {
                        window.dispatchEvent(new Event('resize'));
                        ScrollTrigger.refresh();
                    }
                },
                "-=1.5"
            );

            // Text...
            tl.to(headlineRef.current, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=1")
                .to(subheadRef.current, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1.2")
                .to(ctaRef.current, { y: 0, opacity: 1, duration: 2, ease: "power3.out" }, "-=0.8");

        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={comp} className="relative w-screen overflow-hidden h-full lg:h-screen text-white font-sans">
            <div className="absolute  w-screen h-full ">
                <Image
                    ref={heroImageRef}
                    src="/gradienthero.jpeg"
                    alt="Mindsettler Hero Background"
                    fill
                    className=" "
                />
            </div>
            <div className="w-24 h-24 absolute bg-purple3/30 top-10 rounded-2xl spin-slow hover:scale-110 hover:cursor-pointer pointer-events-auto z-50 transition-all duration-300 "></div>
            {/* <div onClick={(e) => explode(e.currentTarget)} className="w-5 h-5 absolute bg-purple3/20 top-[50%] right-[10%] hover:scale-120 hover:cursor-pointer pointer-events-auto z-50 transition-all duration-300 upndown rounded-full"></div>
            <div className="w-5 h-5 absolute bg-purple3/20 top-[35%] right-[30%] hover:scale-120 hover:cursor-pointer pointer-events-auto z-50 transition-all duration-300 calmLR rounded-full"></div>
            <div className="w-5 h-5 absolute bg-purple3/20 top-[62%] right-[90%] hover:scale-120 hover:cursor-pointer pointer-events-auto z-50 transition-all duration-300 calmLR rounded-full"></div>
            <div className="w-5 h-5 absolute bg-purple3/20 top-[40%] right-[72%] hover:scale-120 hover:cursor-pointer pointer-events-auto z-50 transition-all duration-300 calmLR rounded-full"></div>
            <div className="w-5 h-5 absolute bg-purple3/20 top-[91%] right-[91%] hover:scale-120 hover:cursor-pointer pointer-events-auto z-50 transition-all duration-300 calmLR rounded-full"></div>
            <div className="w-5 h-5 absolute bg-purple3/20 top-[95%] right-[20%] hover:scale-120 hover:cursor-pointer pointer-events-auto z-50 transition-all duration-300 calmLR rounded-full"></div> */}
            <div className="w-[100vh] h-[100vh] max-sm:hidden absolute bg-purple3/20 top-[0%] -right-[20%] hover:scale-120 hover:cursor-pointer pointer-events-auto z-16 transition-all  duration-300 updown rounded-full text-center flex items-center justify-center"></div>
            <div className="absolute max-sm:hidden text-center top-0 right-0">
                <Image
                    src="/abstractlines.png"
                    alt="Abstract Lines"
                    width={500}
                    height={500}
                    className="opacity-100 lg:opacity-40"
                />
            </div>

            <div className="flex max-h-screen max-sm:min-h-[80vh] h-full relative flex-row-reverse ml-auto items-center  justify-between w-screen  px-4 md:px-12 py-20 mx-auto  gap-8 lg:gap-12">

                <div ref={divRef} className="relative max-sm:hidden z-40 wrapper bg-transparent rounded-full will-change-scroll  w-[50vw] h-[300px] md:w-80 md:h-80 lg:w-96 lg:h-96 overflow-visible xl:w-[28rem] xl:h-[28rem] flex items-center justify-center">
                    <div ref={circleRef} className="w-full h-full absolute z-40 bg-transparent">
                        <Canvas >
                            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} near={0.1} far={1000} />
                            <ambientLight intensity={0.5} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                            <Environment preset="city" />

                            <Suspense fallback={null}>
                                <Model url="/3ds/base_basic_pbr.glb" />
                            </Suspense>

                            <ResizeHandler />
                            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                        </Canvas>
                    </div>
                </div>
                {/* TEXT SECTION */}
                <div className="relative z-20 flex flex-col  justify-center max-sm:w-screen max-sm:h-fit h-fit py-2  max-sm:mx-auto w-[50vw] max-sm:mx  lg:w-1/2 order-2 lg:order-1">

                    <div className={`max-w-2xl mx-auto flex flex-col max-sm:gap-2  relative justify- ${size.height > 800 ? 'gap-0' : ''} h-full lg:mx-0 mt-16 max-sm:mt-4`}>
                        <div className=" mb-1 text- lg:text-left">
                            <p className="text-Primary-pink font-medium tracking-widest uppercase text-lg">Reclaim Your Inner Space</p>
                        </div>
                        <h1 ref={headlineRef} className="text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2  lg:text-left">
                            {/* ... Shuffle Component ... */}
                            <Shuffle
                                text="Understand the"
                                shuffleDirection="right"
                                duration={0.5}
                                animationMode="evenodd"
                                shuffleTimes={2}
                                ease="power3.out"
                                stagger={0.05}
                                threshold={0.1}
                                triggerOnce={false}
                                triggerOnHover={true}
                                respectReducedMotion={true}
                                className="text-blueGray "
                                style={{
                                    fontSize: 'clamp(3rem, 8vw, 4rem)',
                                    fontFamily: 'inherit',

                                }}
                            />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-200">Chaos Within.</span>
                        </h1>
                        <div ref={subheadRef} className="text-base md:text-md lg:text-lg text-Primary-purple/80 font-light mb-2 leading-relaxed max-w-lg mx-auto lg:mx-0  lg:text-left">
                            <TextGenerateEffect words={"MindSettler is a psycho-education and mental well-being platform offering structured online and offline sessions to help you understand your thoughts, emotions, and life challenges in a safe and confidential space."} duration={0.4} staggerDelay={0.08} />
                        </div>
                        <div ref={ctaRef} className="flex w-fit max-w-[80vw] relative max-sm:mx-auto max-sm:w-screen
                         flex-col sm:flex-row gap-4 justify-center max-sm:items-center">
                            <button className="px-6  md:px-8 py-3 md:py-4 max-sm:w-[80vw]  min-w-fit w-60 bg-purple5 hover:bg-purple4 text-slate-900 font-bold rounded-lg transition-all transform hover:scale-105 shadow-md shadow-black/10">Book Consultation</button>
                            <button className="px-6 md:px-8 py-3 md:py-4 max-sm:w-[80vw]  min-w-fit w-60 bg-purple5 hover:bg-purple4 text-slate-900 font-bold rounded-lg transition-all transform hover:scale-105 shadow-md shadow-black/10">Know More</button>
                        </div>
                    </div>
                </div>

            </div>

        </div>


    );
};

export default MindsettlerHero;