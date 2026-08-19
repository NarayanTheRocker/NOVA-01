import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import baseImage from "../assets/88.jpg";
import lampOverlay from "../assets/01.png"; 
import nextImage from "../assets/5.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const zoomWrapperRef = useRef(null); 
  const imageRef = useRef(null);
  const lampRef = useRef(null);
  const lightGlowRef = useRef(null);
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  
  const welcomeRef = useRef(null);
  const nextWorldRef = useRef(null);
  const finalPanelRef = useRef(null);

  const menuTlRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =========================
      // PERFORMANCE OPTIMIZATION
      // Removed "filter" and "clip-path" from willChange to fix the infinite browser loading/freezing issue
      // =========================
      gsap.set([
        imageWrapperRef.current, 
        zoomWrapperRef.current, 
        welcomeRef.current, 
        nextWorldRef.current, 
        finalPanelRef.current,
        ".welcome-text-anim",
        ".next-world-content",
        ".final-text-anim"
      ], { 
        willChange: "transform, opacity",
        force3D: true
      });

      // =========================
      // MENU HOVER WAVE ANIMATION
      // =========================
      const menuTl = gsap.timeline({ paused: true });
      
      gsap.set(".menu-item", { autoAlpha: 0, scale: 0.95 });

      // Mobile: animate in from Y-axis
      mm.add("(max-width: 767px)", () => {
        gsap.set(".menu-item", { x: 0, y: -15 });
      });

      // Tablet & Desktop: animate in from X-axis
      mm.add("(min-width: 768px)", () => {
        gsap.set(".menu-item", { x: 20, y: 0 });
      });
      
      menuTl.to(".menu-item", {
        x: 0,
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        stagger: { each: 0.08, from: "end" }, 
        ease: "back.out(1.5)",
        force3D: true
      });

      menuTlRef.current = menuTl;

      let isFlickering = false;
      const triggerFlicker = () => {
        // Prevent flicker entirely on screens smaller than laptop (1280px) to catch iPad Pro 1024px widths
        if (isFlickering || window.innerWidth < 1280) return;
        isFlickering = true;
        gsap.fromTo(
          lightGlowRef.current,
          { opacity: 1 },
          {
            keyframes: [
              { opacity: 0.1, duration: 0.05 },
              { opacity: 0.8, duration: 0.05 },
              { opacity: 0.2, duration: 0.05 },
              { opacity: 1.0, duration: 0.05 },
              { opacity: 0.3, duration: 0.1 },
              { opacity: 1.0, duration: 0.5, ease: "power2.out" }
            ],
            onComplete: () => {
              isFlickering = false;
            }
          }
        );
      };

      let desktopProgress = 0;
      let mobileProgress = 0;

      // =========================
      // DESKTOP
      // =========================
      mm.add("(min-width: 768px)", () => {
        const intro = gsap.timeline({ 
          defaults: { ease: "power4.out", force3D: true },
          onComplete: () => {
            gsap.set(".title-span-wrap", { overflow: "visible" });

            gsap.to(".hero-title-left, .hero-title-right", {
              textShadow: "0px 0px 40px rgba(255, 213, 154, 0.85), 0px 0px 15px rgba(255, 213, 154, 0.5)",
              opacity: 0.6,
              duration: 2.5,
              ease: "sine.inOut",
              yoyo: true,  
              repeat: -1,  
              transformOrigin: "center center",
              force3D: true
            });
          }
        });

        intro
          .from(".hero-logo", { y: -30, opacity: 0, duration: 0.8 })
          .from([".hero-title-left", ".hero-title-right"], {
            y: 40, 
            color: "#FFD59A", 
            opacity: 0,
            stagger: 0.2,
            duration: 0.6, 
            ease: "sine.out"
          }, "-=0.4")
          .from(".hero-desc-intro", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
          .from(zoomWrapperRef.current, { scale: 1.08, opacity: 0, duration: 1.4 }, "-=1")
          .fromTo(lightGlowRef.current, 
            { opacity: 0 }, 
            { 
              keyframes: [
                { opacity: 0.8, duration: 0.05 },
                { opacity: 0.1, duration: 0.05 },
                { opacity: 1.0, duration: 0.05 },
                { opacity: 0.8, duration: 0.05 },
                { opacity: 0.8, duration: 0.05 },
                { opacity: 0.1, duration: 0.05 },
                { opacity: 1.0, duration: 0.05 },
                { opacity: 0.8, duration: 0.05 },
                { opacity: 0.1, duration: 0.05 },
                { opacity: 1.0, duration: 0.05 },
                { opacity: 0.3, duration: 0.1 },
                { opacity: 1.0, duration: 0.8, ease: "power2.out" }
              ]
            }, 
            "-=0.8"
          )
          .from(".hero-meta-intro", { y: 30, opacity: 0, duration: 0.7 }, "=2");

        const scrollTl = gsap.timeline({
          defaults: { force3D: true },
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=500%",
            scrub: 1.8, 
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (desktopProgress < 0.05 && self.progress >= 0.05) {
                triggerFlicker();
              } else if (desktopProgress > 0.25 && self.progress <= 0.25) {
                triggerFlicker();
              }
              desktopProgress = self.progress;
            }
          },
        });

        scrollTl
          .to(imageWrapperRef.current, { clipPath: "inset(15% 15% 15% 15% round 24px)", scale: 0.85, duration: 1, ease: "power2.inOut" }, 0)
          .to(zoomWrapperRef.current, { scale: 1.3, duration: 1, ease: "none" }, 0)
          .to(heroRef.current, { backgroundColor: "#1A1A18", duration: 1, ease: "none" }, 0)
          .to(".hero-title-left", { x: -30, opacity: 0, duration: 1, ease: "power2.inOut" }, 0)
          .to(".hero-title-right", { x: 30, opacity: 0, duration: 1, ease: "power2.inOut" }, 0)
          .to(".hero-desc-scroll, .hero-meta-scroll", { opacity: 0, y: -20, duration: 1, ease: "power2.inOut" }, 0)
          .to(scrollRef.current, { opacity: 0, duration: 1 }, 0)
          .fromTo(welcomeRef.current, 
            { clipPath: "circle(0% at 50% 50%)" },
            { clipPath: "circle(150% at 50% 50%)", duration: 1.2, ease: "power2.inOut" }, 1.0)
          .fromTo(".welcome-text-anim", 
            { opacity: 0, scale: 0.5, filter: "blur(24px)", letterSpacing: "-0.2em" },
            { opacity: 1, scale: 1, filter: "blur(0px)", letterSpacing: "normal", duration: 0.8, ease: "power3.out" }, 1.2)
          .to(".welcome-text-anim", { scale: 1.08, duration: 1.2, ease: "none" }, 1.2)
          .to(welcomeRef.current, { opacity: 0, filter: "blur(12px)", scale: 1.15, duration: 0.6, ease: "power2.in" }, 2.4)
          .fromTo(nextWorldRef.current,
            { display: "none", opacity: 0, scale: 0.85, clipPath: "inset(15% 15% 15% 15% round 24px)" },
            { display: "block", opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.5, ease: "power2.inOut" }, 2.8) 
          .to(".next-bg-image", { scale: 1.1, duration: 2.2, ease: "none" }, 2.8)
          .fromTo(".next-world-content", 
            { opacity: 0, y: 50, filter: "blur(10px)" }, 
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" }, 3.5)
          
          .to(finalPanelRef.current, { yPercent: -100, borderRadius: "0px", duration: 3.5, ease: "power2.inOut" }, 5.8)
          
          .fromTo(".final-text-anim", 
            { 
              opacity: 0, 
              y: 150, 
              z: -300,            
              rotationX: -80,     
              scale: 0.8, 
              transformPerspective: 1200, 
              transformOrigin: "center bottom" 
            }, 
            { 
              opacity: 1, 
              y: 0, 
              z: 0,               
              rotationX: 0,       
              scale: 1, 
              stagger: 0.2,       
              duration: 3, 
              ease: "power2.out" 
            }, 
          8) 
          .to({}, { duration: 2.0 });
      });

      // =========================
      // MOBILE
      // =========================
      mm.add("(max-width: 767px)", () => {
        const intro = gsap.timeline({ 
          defaults: { ease: "power3.out", force3D: true },
          onComplete: () => {
            gsap.set(".title-span-wrap", { overflow: "visible" });
            gsap.to(".hero-title-intro", {
              textShadow: "0px 0px 30px rgba(255, 213, 154, 0.8), 0px 0px 10px rgba(255, 213, 154, 0.5)",
              opacity: 0.85,
              scale: 1.02,
              duration: 2.5,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              transformOrigin: "center center",
              force3D: true
            });
          }
        });
        
        intro
          .from(".hero-logo", { y: -20, opacity: 0, duration: 0.7 })
          .from(".hero-title-intro", { y: 60, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.3")
          .from(".hero-desc-intro", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
          .from(zoomWrapperRef.current, { scale: 1.05, opacity: 0, duration: 1 }, "-=0.6")
          .from(".hero-meta-intro", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");

        const scrollTl = gsap.timeline({
          defaults: { force3D: true },
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=350%", 
            scrub: 1.5, 
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (mobileProgress < 0.25 && self.progress >= 0.25) {
                triggerFlicker();
              } else if (mobileProgress > 0.25 && self.progress <= 0.25) {
                triggerFlicker();
              }
              mobileProgress = self.progress;
            }
          },
        });

        scrollTl
          .to(imageWrapperRef.current, { clipPath: "inset(10% 5% 10% 5% round 16px)", scale: 0.9, ease: "power2.inOut" }, 0)
          .to(zoomWrapperRef.current, { scale: 1.2, ease: "none" }, 0)
          .to(heroRef.current, { backgroundColor: "#1A1A18", ease: "none" }, 0)
          .to(".hero-title-left", { x: 100, opacity: 0, ease: "power2.inOut" }, 0)
          .to(".hero-title-right", { x: -100, opacity: 0, ease: "power2.inOut" }, 0)
          .to(".hero-desc-scroll, .hero-meta-scroll", { opacity: 0, y: -15, ease: "power2.inOut" }, 0)
          .to(scrollRef.current, { opacity: 0 }, 0)
          .fromTo(welcomeRef.current, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(150% at 50% 50%)", ease: "power2.inOut" }, 1.0)
          .fromTo(".welcome-text-anim", { opacity: 0, scale: 0.8, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power3.out" }, 1.2)
          .to(".welcome-text-anim", { scale: 1.05, duration: 1.2, ease: "none" }, 1.2)
          .to(welcomeRef.current, { opacity: 0, filter: "blur(10px)", scale: 1.1, ease: "power2.in" }, 2.4)
          .fromTo(nextWorldRef.current, { display: "none", opacity: 0, scale: 0.9, clipPath: "inset(10% 5% 10% 5% round 16px)" }, { display: "block", opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut" }, 2.6)
          .to(".next-bg-image", { scale: 1.1, duration: 2, ease: "none" }, 2.6)
          .fromTo(".next-world-content", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", ease: "power3.out" }, 3.0)
          .to(finalPanelRef.current, { yPercent: -100, borderRadius: "0px", ease: "power2.inOut" }, 4.2)
          .fromTo(".final-text-anim", 
            { opacity: 0, y: 80, rotationX: -15, scale: 0.95, filter: "blur(6px)" }, 
            { opacity: 1, y: 0, rotationX: 0, scale: 1, filter: "blur(0px)", stagger: 0.15, duration: 1.2, ease: "back.out(1.1)" }, 
          4.6);
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
<style>{`
@keyframes luxuryShimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.premium-text-shimmer {
  position: relative;
  display: inline-block;
  background: linear-gradient(
    to right,
    #8a857d 10%,
    #FAF8F5 40%,
    #FAF8F5 60%,
    #8a857d 90%
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: luxuryShimmer 4s linear infinite;
  will-change: background-position;
}

.premium-text-shimmer-2 {
  position: relative;
  display: inline-block;
  background: linear-gradient(
    to right,
    #666666 10%, 
    #FFFFFF 40%, 
    #FFFFFF 60%, 
    #666666 90%  
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: luxuryShimmer 4s linear infinite;
  will-change: background-position;
}

/* ================================== */
/* 3D HOVER FLIP TEXT STYLES          */
/* ================================== */
.btn-3d {
  perspective: 800px;
}

.cursor-none-global * {
          cursor: none !important;
}

.btn-3d-inner {
  position: relative;
  display: inline-block;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.btn-3d-front {
  display: block;
  transform: translateZ(0.6em);
  backface-visibility: hidden;
}

.btn-3d-back {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: rotateX(90deg) translateZ(0.6em);
  backface-visibility: hidden;
  color: #1A1A18;
}

.menu-item:hover .btn-3d-inner {
  transform: rotateX(-90deg);
}
`}</style>

      <section ref={heroRef} className="relative h-screen w-full bg-[#d8d0c0] overflow-y-hidden cursor-none-global">
        <div className="relative h-full w-full overflow-hidden overflow-y-hidden">
          <div className="absolute inset-0 bg-[#d1c5b1]" />

          <div ref={imageWrapperRef} className="absolute inset-0 overflow-hidden bg-black">
            
            <div ref={zoomWrapperRef} className="absolute inset-0 h-full w-full origin-center">
              <img
                ref={imageRef}
                src={baseImage}
                alt="Modern futuristic interior"
                className="absolute inset-0 z-[1] h-full w-full object-cover object-[center_35%] max-h-[100dvh] rounded-none will-change-transform"
              />

              <div
                ref={lightGlowRef}
                className="pointer-events-none absolute z-[2] mix-blend-screen opacity-0 hidden xl:block"
                style={{
                  top: "46%",    
                  left: "46.6%",   
                  width: "31.5vmax", 
                  height: "30vmax", 
                  background: "linear-gradient(to bottom, rgba(255, 250, 230, 1) 0%, rgba(255, 210, 100, 0.85) 15%, rgba(255, 140, 40, 0.3) 55%, transparent 80%)",
                  clipPath: "polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)", 
                }}
              />

              <img
                ref={lampRef}
                src={lampOverlay}
                alt="Glowing Lamp overlay"
                className="pointer-events-none absolute inset-0 z-[3] h-full w-full object-cover object-[center_35%] max-h-[100dvh] rounded-none will-change-transform hidden xl:block"
              />
            </div>
            
            <div className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-r from-black/30 via-black/25 to-black/10" />
            <div className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-t from-black/30 via-transparent to-black/20" />

            <div
              ref={contentRef}
              className="absolute left-5 top-1/2 z-[5] w-[calc(100%-40px)] -translate-y-1/2 md:left-10 md:w-auto lg:left-14 will-change-transform"
            >
              <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[250px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,213,154,0.18)_0%,rgba(255,140,40,0.05)_50%,transparent_70%)] blur-2xl md:h-[400px] md:w-[600px]" />

              <div className="hero-desc-intro">
                <p className="hero-desc-scroll mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E8E2D8]/90 drop-shadow-sm md:mb-6 md:text-xs">
                  Furniture / Spaces / Future
                </p>
              </div>

              <h1 className="hero-title-intro font-serif text-[13vw] font-normal uppercase leading-[0.8] tracking-[-0.04em] text-[#fcefef] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] md:text-[11vw] lg:text-[7vw]">
                <span className="title-span-wrap block overflow-hidden">
                  <span className="hero-title-left block will-change-transform">Future</span>
                </span>
                <span className="title-span-wrap block overflow-hidden">
                  <span className="hero-title-right block italic font-light text-white/95 will-change-transform">Living</span>
                </span>
              </h1>

              <div className="hero-desc-intro">
                <p className="hero-desc-scroll mt-6 max-w-[280px] text-xs font-light leading-relaxed tracking-wide text-[#E8E2D8]/85 drop-shadow md:mt-8 md:max-w-[360px] md:text-sm">
                  Furniture designed for spaces that haven&apos;t been imagined yet.
                </p>
              </div>
            </div>
          </div>

          <div 
            ref={welcomeRef} 
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-4 md:px-8 text-center overflow-hidden"
          >
            <div className="inline-block w-full" style={{ filter: "drop-shadow(0px 0px 30px rgba(81, 65, 36, 1))", transform: "translateZ(0)" }}>
              <h2 className="welcome-text-anim premium-text-shimmer mx-auto w-full max-w-[85vw] font-serif text-3xl font-medium leading-tight md:max-w-[65vw] md:text-4xl lg:max-w-[60vw] lg:text-[3.6vw] xl:max-w-[55vw] whitespace-normal break-words">
                Welcome to the world of modern furniture.
              </h2>
            </div>
          </div>

          <div 
            ref={nextWorldRef} 
            className="absolute inset-0 z-30 hidden overflow-hidden bg-[#4e4e48]"
          >
            <img 
              src={nextImage} 
              alt="Next room" 
              className="next-bg-image absolute inset-0 h-full w-full object-cover opacity-60 origin-center will-change-transform"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/50" />
            
            <div className="next-world-content absolute inset-0 flex flex-col items-center justify-center text-center text-[#E8E2D8] px-4">
               <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-[#E8E2D8]/70">
                 - NOVA -
               </p>
               
               <div className="inline-block" style={{ filter: "drop-shadow(0px 0px 15px rgba(81, 65, 36, 0.8))", transform: "translateZ(0)" }}>
                 <h2 className="next-world-content premium-text-shimmer px-6 text-center font-serif text-3xl font-medium leading-tight max-w-4xl md:text-6xl lg:text-[5vw]">
                 The New Standard.
                 </h2>
               </div>

               <p className="mt-4 max-w-md text-base font-medium tracking-wide text-[#E8E2D8]/80 md:text-lg">
                 Bridging the gap between imagined spaces and physical reality.
               </p>
            </div>
          </div>

          {/* ==================================================== */}
          {/* FINAL SECTION: BRAND ESSENCE */}
          {/* ==================================================== */}
          <div
            ref={finalPanelRef}
            className="absolute left-0 top-full z-40 flex h-full w-full flex-col overflow-hidden rounded-t-[40px] bg-[#bda988] p-8 md:p-16 lg:p-20 md:rounded-t-[60px]"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="animate-orb-1 absolute -left-[15%] -top-[30%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(216, 208, 192,0.18)_0%,rgba(216, 208, 192,0.08)_40%,transparent_70%)] blur-3xl md:h-[750px] md:w-[750px]" />
              <div className="animate-orb-2 absolute -right-[15%] bottom-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(216, 208, 192,0.14)_0%,transparent_70%)] blur-3xl md:h-[750px] md:w-[750px]" />
              <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(216, 208, 192,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(216, 208, 192,0.6)_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>

            <div className="about-card relative z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1c1a19] via-[#1c1a19] to-[#1c1a19] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] will-change-transform md:p-16 lg:p-20">
              
              <div className="about-border-glow pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[#d8d0c0]/40 via-[#F3D5B5]/20 to-[#d8d0c0]/40 opacity-100" />

              <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
                <p className="final-text-anim mb-5 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#a3a3a3] md:mb-7 md:text-xs">
                  About Futura — Our Essence
                </p>

                <h2 className="final-text-anim premium-text-shimmer-2 max-w-5xl font-serif text-3xl font-medium leading-[1.15] tracking-tight md:text-5xl lg:text-[3.8vw]">
                  We craft tactile spaces and timeless forms for the modern architectural era.
                </h2>

                <p className="final-text-anim mt-7 max-w-2xl text-sm font-light leading-relaxed tracking-wide text-[#d4d4d4] md:mt-9 md:text-base">
                  FUTURA bridges high-concept furniture design with spatial harmony—transforming living environments into sensory sanctuaries.
                </p>

                <div className="final-text-anim mt-11 flex flex-wrap items-center justify-center gap-8 md:mt-14 md:gap-14">
                  <div className="text-center">
                    <span className="block text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a8a] md:text-sm">
                      01 / Craft
                    </span>
                    <span className="mt-1.5 block text-xs font-semibold uppercase tracking-[0.22em] text-[#f5f5f5] md:text-sm">
                    Tactile Luxury
                    </span>
                  </div>

                  <div className="hidden h-10 w-px bg-white/10 md:block" />

                  <div className="text-center">
                    <span className="block text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a8a] md:text-sm">
                      02 / Architecture
                    </span>
                    <span className="mt-1.5 block text-xs font-semibold uppercase tracking-[0.22em] text-[#f5f5f5] md:text-sm">
                    Pure Geometry
                    </span>
                  </div>

                  <div className="hidden h-10 w-px bg-white/10 md:block" />

                  <div className="text-center">
                    <span className="block text-xs font-medium uppercase tracking-[0.28em] text-[#8a8a8a] md:text-sm">
                      03 / Vision
                    </span>
                    <span className="mt-1.5 block text-xs font-semibold uppercase tracking-[0.22em] text-[#f5f5f5] md:text-sm">
                      Timeless Living
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* NAV & META OVERLAYS */}
          {/* ==================================================== */}
          <header className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10 md:py-7 lg:px-14">
            <div className="hero-logo text-xs font-semibold tracking-[0.22em] text-[#FAF8F5] drop-shadow md:text-sm mt-1">
              NOVA / 01
            </div>

            <div 
              className="group relative flex items-center justify-end"
              onMouseEnter={() => menuTlRef.current?.play()}
              onMouseLeave={() => menuTlRef.current?.reverse()}
            >
              <div className="menu-options-container absolute right-0 top-full mt-3 md:mt-0 md:right-full md:top-1/2 flex flex-col md:flex-row items-end md:items-center -translate-y-0 md:-translate-y-1/2 gap-2 md:gap-3 pr-0 md:pr-4 lg:gap-4 lg:pr-6">
                {["Home", "About", "Work", "Journal", "Contact"].map((item) => (
                  <button 
                    key={item} 
                    className="menu-item btn-3d cursor-pointer whitespace-nowrap rounded-full border border-white/20 bg-black/30 backdrop-blur-md px-2.5 py-1 text-[9px] font-medium tracking-[0.05em] text-[#E8E2D8] transition-all duration-500 hover:bg-[#FAF8F5] hover:text-[#1A1A18] hover:shadow-[0_0_20px_rgba(255,213,154,0.4)] hover:border-[#FFD59A]/60 md:px-3 md:py-1.5 md:text-[10px] md:tracking-[0.1em] lg:px-4 lg:py-1.5 lg:text-[11px] lg:tracking-[0.2em]"
                  >
                    <span className="btn-3d-inner">
                      <span className="btn-3d-front">{item}</span>
                      <span className="btn-3d-back">{item}</span>
                    </span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  const tl = menuTlRef.current;
                  if (tl) tl.progress() === 0 || tl.reversed() ? tl.play() : tl.reverse();
                }}
                className="relative z-10 text-[10px] tracking-[0.15em] font-bold text-[#FAF8F5]/90 transition-opacity duration-300 hover:text-white hover:opacity-100 drop-shadow md:text-xs md:tracking-[0.2em] lg:text-sm lg:tracking-[0.22em]"
              >
                MENU
              </button>
            </div>
          </header>

          <div className="hero-meta-intro absolute bottom-6 left-5 right-5 z-50 md:bottom-8 md:left-10 md:right-10 lg:left-14 lg:right-14">
            <div className="hero-meta-scroll flex items-end justify-between text-[9px] uppercase tracking-[0.22em] text-[#E8E2D8]/80 drop-shadow md:text-[10px]">
              <div>
                Collection 01
                <br />
                Objects &amp; Spaces
              </div>
              <div className="text-right">
                2026
                <br />
                Designed for tomorrow
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="absolute bottom-7 left-1/2 z-50 hidden -translate-x-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-[#FAF8F5]/80 drop-shadow md:flex"
          >
            <span>Scroll to enter</span>
            <span className="h-10 w-px bg-white/40 shadow-sm" />
          </div>

        </div>
      </section>
    </>
  );
}