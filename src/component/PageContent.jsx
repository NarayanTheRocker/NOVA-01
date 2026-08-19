import React, { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { SplitText } from "gsap/SplitText"; // <-- Ensure this is imported

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText);

// Expanded Collaborations List - Formatted for the marquee
const collabsData = [
  "VOGUE LIVING",
  "HERMAN MILLER",
  "KINFOLK",
  "KVADRAT",
  "ARCHITECTURAL DIGEST",
  "DEZEEN",
];

// Create a repeated string for a seamless long line of text
const marqueeText = [...collabsData, ...collabsData, ...collabsData].join(" — ") + " — ";

const worksData = [
  {
    id: "01",
    title: "The Sculptural Lounge",
    category: "Residential Architecture",
    description:
      "A harmonious blend of monolithic concrete forms and raw timber. Designed to capture natural light at every hour of the day while maintaining intimate privacy.",
    image:
      "https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Concrete", "Minimalism", "Custom Lighting"],
  },
  {
    id: "02",
    title: "Material & Shadow Study",
    category: "Furniture & Tactile Craft",
    description:
      "Stripping away non-essential elements to focus on natural texture. Hand-finished brass accents paired with matte charcoal oak create a tactile sensory experience.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Brass", "Smoked Oak", "Limited Edition"],
  },
  {
    id: "03",
    title: "Monolith Pavilion",
    category: "Commercial Sanctuary",
    description:
      "An open-plan gallery space designed to feel weightless despite heavy stone elements. Floating steps and subterranean acoustics foster deep contemplation.",
    image:
      "https://images.unsplash.com/photo-1606744888344-493238951221?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Travertine", "Acoustics", "Spatial Flow"],
  },
  {
    id: "04",
    title: "Aura Residence",
    category: "Private Villa",
    description:
      "Framing panoramic horizons through minimalist floor-to-ceiling glass systems. Interiors dissolve into nature with continuous micro-cement surfaces.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    tags: ["Micro-cement", "Panorama", "Sustainable"],
  },
];

export default function PageContent() {
  const containerRef = useRef(null);
  const typewriterRef = useRef(null);
  const textCursorRef = useRef(null);
  const customCursorRef = useRef(null);

  // ==========================================
  // GLOBAL CUSTOM CURSOR LOGIC
  // ==========================================
  useEffect(() => {
    const cursor = customCursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
        opacity: 1,
        duration: 0.15,
        ease: "power2.out",
        force3D: true, 
      });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, scale: 0.2, duration: 0.3, force3D: true });
    };

    const onMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3, force3D: true });
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  // ==========================================
  // PAGE ANIMATIONS LOGIC
  // ==========================================
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      gsap.set([
        ".ambient-orb-1", ".ambient-orb-2", 
        ".about-card", 
        ".marquee-row-1", ".marquee-row-2", ".marquee-row-3",
        ".img-container", ".work-img"
      ], { 
        willChange: "transform, opacity",
        force3D: true 
      });

      // AMBIENT BACKGROUND ORBS
      gsap.to(".ambient-orb-1", {
        x: 100, y: 50, scale: 1.1, duration: 8, repeat: -1,
        yoyo: true, ease: "sine.inOut", force3D: true,
      });

      gsap.to(".ambient-orb-2", {
        x: -100, y: -50, scale: 1.1, duration: 10, repeat: -1,
        yoyo: true, ease: "sine.inOut", force3D: true,
      });

      // TYPEWRITER
      const words = ["think", "feel", "live"];
      const typewriterTl = gsap.timeline({ repeat: -1, defaults: { force3D: true } });

      gsap.to(textCursorRef.current, {
        opacity: 0,
        duration: 0.45,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
        force3D: true
      });

      words.forEach((word) => {
        typewriterTl
          .to(typewriterRef.current, { text: word, duration: word.length * 0.15, ease: "none" })
          .to({}, { duration: 1.8 })
          .to(typewriterRef.current, { text: "", duration: word.length * 0.1, ease: "none" })
          .to({}, { duration: 0.3 });
      });

      // ABOUT SECTION SCROLL SCRUB
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-section",
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1.5, 
          anticipatePin: 1,
        },
        defaults: { force3D: true }
      });

      aboutTl
        .fromTo(".about-card", { scale: 0.85, y: 10, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.7, ease: "none" })
        .fromTo(".about-border-glow", { opacity: 0 }, { opacity: 0.65, duration: 0.4, ease: "none" }, "-=0.2")
        .fromTo([".about-sub", ".about-heading", ".about-para-box"], { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: "power2.out" }, "-=0.4");

      // COLLAB MARQUEE
      const collabTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".collab-section",
          start: "top top",
          end: "+=150%", 
          pin: true,
          scrub: 1.8, 
        },
        defaults: { force3D: true }
      });

      collabTl.fromTo(".collab-sub", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      collabTl
        .to(".marquee-row-1", { xPercent: -25, ease: "none", duration: 2 }, 0)
        .fromTo(".marquee-row-2", { xPercent: -25 }, { xPercent: 0, ease: "none", duration: 2 }, 0)
        .to(".marquee-row-3", { xPercent: -25, ease: "none", duration: 2 }, 0);

      // GALLERY REVEALS
      gsap.fromTo(".gallery-header", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.2, ease: "power3.out", force3D: true,
        scrollTrigger: { trigger: ".gallery-header", start: "top 85%", toggleActions: "play none none reverse" }
      });

      const items = gsap.utils.toArray(".work-item");
      items.forEach((item, i) => {
        const isEven = i % 2 === 0;
        const imgContainer = item.querySelector(".img-container");
        const img = item.querySelector(".work-img");
        const textElements = item.querySelectorAll(".text-content > *");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 80%", toggleActions: "play none none reverse" },
          defaults: { force3D: true }
        });

        tl.fromTo(imgContainer, { opacity: 0, y: 60, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out" })
          .fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.5, ease: "power3.out" }, "<0.1")
          .fromTo(textElements, { opacity: 0, x: isEven ? 40 : -40 }, { opacity: 1, x: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "<0.3");
      });

      // ==========================================
      // PERSPECTIVES SCATTER SCROLL ANIMATION
      // ==========================================
      const quoteSplit = new SplitText(".perspective-quote", { type: "words, chars" });
      
      gsap.from(quoteSplit.chars, {
        x: "random(-600, 600)", // Scatters widely on the X axis
        y: "random(-400, 400)", // Scatters widely on the Y axis
        z: "random(-300, 300)", // Adds 3D depth to the scatter
        rotationX: "random(-180, 180)",
        rotationY: "random(-180, 180)",
        rotationZ: "random(-90, 90)",
        scale: "random(0.5, 2.5)",
        opacity: 0,
        duration: 1.5,
        stagger: 0.015, // Creates that satisfying domino effect
        ease: "expo.out",
        force3D: true,
        scrollTrigger: {
          trigger: ".perspectives-section",
          start: "top 80%",
          end: "bottom 20%",
          // play (enter), reverse (leave), play (enter back), reverse (leave back)
          toggleActions: "play reverse play reverse",
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSectionMouseEnter = () => {
    if(customCursorRef.current) {
      gsap.to(customCursorRef.current, { scale: 1.5, duration: 0.4, ease: "power3.out", force3D: true });
    }
  };

  const handleSectionMouseLeave = () => {
    if(customCursorRef.current) {
      gsap.to(customCursorRef.current, { scale: 1, duration: 0.4, ease: "power3.out", force3D: true });
    }
  };

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1500,
      ease: "power2.out",
      duration: 0.4,
      force3D: true, 
      overwrite: "auto" 
    });
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "power3.out",
      duration: 0.7,
      force3D: true,
      overwrite: "auto"
    });
  };

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

        .outline-text {
          color: transparent;
          -webkit-text-stroke: 1px rgba(250, 248, 245, 0.8);
          font-family: serif;
          white-space: nowrap;
          will-change: transform;
        }

        .cursor-none-global * {
          cursor: none !important;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* ================================== */
        /* 3D HOVER FLIP TEXT STYLES          */
        /* ================================== */
        .btn-3d {
          perspective: 800px;
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
        }

        .menu-item:hover .btn-3d-inner,
        .footer-link:hover .btn-3d-inner {
          transform: rotateX(-90deg);
        }
      `}</style>

      <div
        ref={customCursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex h-48 w-48 items-center justify-center opacity-0 md:h-72 md:w-72 will-change-transform"
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.05)_20%,transparent_40%)] blur-[10px] will-change-transform" />
        <div className="relative z-10 h-3 w-3 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] ring-1 ring-white/60 will-change-transform" />
      </div>
      
      <div 
        ref={containerRef} 
        className="relative z-10 w-full bg-[#161615] text-[#FAF8F5] overflow-hidden cursor-none-global"
      >
        
        {/* 1. ABOUT US SECTION */}
        <section className="about-section relative flex min-h-screen w-full items-center justify-center bg-[#bda988] py-20 px-4 md:px-10 lg:px-16">
          <div 
            className="ambient-orb-1 pointer-events-none absolute -left-32 top-1/4 h-[40rem] w-[40rem] rounded-full will-change-transform"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(18,17,16,0) 70%)' }}
          />
          <div 
            className="ambient-orb-2 pointer-events-none absolute -right-32 bottom-1/4 h-[45rem] w-[45rem] rounded-full will-change-transform"
            style={{ background: 'radial-gradient(circle, rgba(232,184,150,0.1) 0%, rgba(18,17,16,0) 70%)' }}
          />

          <div className="mx-auto w-full max-w-[1400px]">
            <div className="about-card relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1c1a19] via-[#151413] to-[#100f0e] p-8 md:p-16 lg:p-20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] will-change-transform">
              <div className="about-border-glow pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[#d8d0c0]/40 via-[#F3D5B5]/20 to-[#d8d0c0]/40 opacity-0" />
              <div className="relative z-10">
                <p className="about-sub mb-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#E8B896] md:mb-12 md:text-xs">
                  About the Studio
                </p>
                <h3 className="about-heading premium-text-shimmer font-serif text-3xl font-normal leading-[1.2] tracking-tight text-[#FAF8F5] md:text-5xl lg:text-6xl lg:leading-[1.18]">
                  We believe the spaces we inhabit shape how we{" "}
                  <span className="inline-flex items-center">
                    <span className="inline-block w-[2.5em] text-left whitespace-nowrap">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3D5B5] to-[#E8B896]" ref={typewriterRef}></span>
                      <span ref={textCursorRef} className="ml-[2px] inline-block h-[0.85em] w-[3px] bg-[#D4AF37] align-baseline" />
                    </span>
                  </span>
                  . Our approach bridges the gap between{" "}
                  <span className="italic text-[#E8E2D8]/80 underline decoration-[#D4AF37]/40 underline-offset-8">
                    sculptural art
                  </span>{" "}
                  and everyday utility.
                </h3>
                <div className="about-para-box mt-12 flex justify-end md:mt-16">
                  <div className="max-w-xl border-l border-[#D4AF37]/30 pl-6 md:pl-8">
                    <p className="text-xs font-light leading-relaxed tracking-wide text-[#E8E2D8]/80 md:text-sm">
                      Founded in 2026, NOVA was born from a desire to strip away the
                      unnecessary. Every piece is crafted with a focus on material purity,
                      architectural proportions, and a relentless pursuit of the perfect
                      line.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PINNED ALTERNATING SCROLL TRIGGER SECTION */}
        <section 
          className="collab-section relative flex h-screen w-full flex-col items-center justify-center overflow-hidden border-y border-white/5 bg-[#2c2726]"
          onMouseEnter={handleSectionMouseEnter}
          onMouseLeave={handleSectionMouseLeave}
        >
          <div className="collab-sub absolute top-10 flex w-full justify-center opacity-0 md:top-20">
            <h2 className="premium-text-shimmer text-center font-serif text-sm md:text-xl uppercase tracking-[0.3em] text-[#FAF8F5]">
              Featured In
            </h2>
          </div>

          <div className="flex w-[200vw] flex-col gap-6 md:gap-12">
            <div className="marquee-row-1 text-5xl md:text-7xl lg:text-9xl outline-text flex w-max will-change-transform">
              {marqueeText}
            </div>
            <div className="marquee-row-2 text-5xl md:text-7xl lg:text-9xl outline-text flex w-max will-change-transform">
              {marqueeText}
            </div>
            <div className="marquee-row-3 text-5xl md:text-7xl lg:text-9xl outline-text flex w-max will-change-transform">
              {marqueeText}
            </div>
          </div>
        </section>

        {/* 3. OUR WORK GALLERY */}
        <section 
          className="relative overflow-hidden bg-[#161615] pt-20 pb-40 md:pt-32 md:pb-56"
          onMouseEnter={handleSectionMouseEnter}
          onMouseLeave={handleSectionMouseLeave}
        >
          <div className="mx-auto w-[95vw] max-w-[1600px] px-4 md:px-10 lg:px-16">
            
            <div className="gallery-header mb-24 md:mb-36 relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1c1a19] via-[#151413] to-[#100f0e] p-8 md:p-14 lg:p-20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] will-change-transform">
              <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[#d8d0c0]/10 via-[#F3D5B5]/5 to-[#d8d0c0]/10 pointer-events-none" />
              <div className="relative z-10 text-center md:text-left">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                  Selected Works
                </p>
                <h2 className="premium-text-shimmer font-serif text-4xl font-light md:text-6xl lg:text-7xl">
                  Architectural Artifacts
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-28 md:gap-40 lg:gap-52">
              {worksData.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id}
                    className={`work-item group relative grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-14 lg:gap-20 ${
                      isEven ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    <div 
                      className={`relative md:col-span-7 lg:col-span-8 ${isEven ? "md:order-1" : "md:order-2"}`} 
                      style={{ perspective: '1500px' }}
                    >
                      <div 
                        className="img-container relative h-[70vh] md:h-[85vh] w-full overflow-hidden rounded-2xl border border-white/5 bg-[#1A1A18] shadow-[0_30px_60px_rgba(0,0,0,0.7)] transition-colors duration-700 group-hover:border-[#D4AF37]/40 will-change-transform"
                        onMouseMove={handleCardMouseMove}
                        onMouseLeave={handleCardMouseLeave}
                      >
                        <div className="pointer-events-none relative h-full w-full overflow-hidden">
                          <img src={item.image} alt={item.title} className="work-img h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 will-change-transform" />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121110]/90 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
                        </div>
                        <div className="pointer-events-none absolute left-6 top-6 rounded border border-[#D4AF37]/30 bg-black/50 px-3 py-1 font-serif text-3xl font-light text-[#D4AF37]">
                          {item.id}
                        </div>
                      </div>
                    </div>

                    <div className={`flex flex-col justify-center md:col-span-5 lg:col-span-4 ${isEven ? "md:order-2" : "md:order-1"}`}>
                      <div className="text-content">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                          {item.category}
                        </p>
                        <h3 className="mb-6 font-serif text-3xl font-normal leading-tight text-[#FAF8F5] md:text-4xl lg:text-5xl">
                          {item.title}
                        </h3>
                        <p className="mb-8 text-xs font-light leading-relaxed tracking-wide text-[#E8E2D8]/75 md:text-sm">
                          {item.description}
                        </p>
                        <div className="mb-8 flex flex-wrap gap-2">
                          {item.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[10px] uppercase tracking-wider text-[#E8E2D8]/60 transition-colors hover:border-[#D4AF37]/50 hover:text-white">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a href="#" className="group/link flex w-max items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:text-[#D4AF37]">
                          Explore Project <span className="text-sm transition-transform duration-300 group-hover/link:translate-x-2">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. REVIEWS */}
        <section className="perspectives-section relative overflow-hidden bg-[#161615] py-32 md:py-48" style={{ perspective: '1500px' }}>
          <div className="mx-auto max-w-5xl px-6 text-center md:px-14">
            <p className="mb-12 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E8E2D8]/60 md:mb-20 md:text-xs">
              Perspectives
            </p>
            <blockquote className="perspective-quote font-serif text-3xl font-light leading-relaxed text-[#FAF8F5] md:text-4xl lg:text-5xl lg:leading-normal">
              &quot;An absolute masterclass in restraint. NOVA doesn&apos;t just
              design furniture; they engineer atmospheres. It is the new standard
              for modern luxury.&quot;
            </blockquote>
            <p className="mt-12 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] md:mt-16">
              — Architectural Digest
            </p>
          </div>
        </section>

        {/* 5. FOOTER */}
        <footer className="relative border-t border-white/5 bg-[#121212] pt-24 md:pt-32">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-16 px-6 md:flex-row md:px-14 lg:px-20">
            
            {/* Left Side: Menus */}
            <div className="flex gap-16 md:gap-24">
              <div className="flex flex-col gap-4 text-xs tracking-wider text-[#E8E2D8]/70">
                <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E8E2D8]/40">Menu</span>
                <a href="#" className="footer-link btn-3d block w-max transition-colors duration-300">
                  <span className="btn-3d-inner">
                    <span className="btn-3d-front text-[#E8E2D8]/70">Collections</span>
                    <span className="btn-3d-back text-[#D4AF37]">Collections</span>
                  </span>
                </a>
                <a href="#" className="footer-link btn-3d block w-max transition-colors duration-300">
                  <span className="btn-3d-inner">
                    <span className="btn-3d-front text-[#E8E2D8]/70">Studio</span>
                    <span className="btn-3d-back text-[#D4AF37]">Studio</span>
                  </span>
                </a>
                <a href="#" className="footer-link btn-3d block w-max transition-colors duration-300">
                  <span className="btn-3d-inner">
                    <span className="btn-3d-front text-[#E8E2D8]/70">Journal</span>
                    <span className="btn-3d-back text-[#D4AF37]">Journal</span>
                  </span>
                </a>
              </div>
              
              <div className="flex flex-col gap-4 text-xs tracking-wider text-[#E8E2D8]/70">
                <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E8E2D8]/40">Social</span>
                <a href="#" className="footer-link btn-3d block w-max transition-colors duration-300">
                  <span className="btn-3d-inner">
                    <span className="btn-3d-front text-[#E8E2D8]/70">Instagram</span>
                    <span className="btn-3d-back text-[#D4AF37]">Instagram</span>
                  </span>
                </a>
                <a href="#" className="footer-link btn-3d block w-max transition-colors duration-300">
                  <span className="btn-3d-inner">
                    <span className="btn-3d-front text-[#E8E2D8]/70">Pinterest</span>
                    <span className="btn-3d-back text-[#D4AF37]">Pinterest</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Right Side: Newsletter */}
            <div className="flex flex-col gap-4 md:items-end md:text-right">
              <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E8E2D8]/40">Newsletter</span>
              <p className="max-w-xs text-xs tracking-wider text-[#E8E2D8]/70">
                Subscribe to receive updates on new collections and studio news.
              </p>
              <div className="mt-4 flex w-full max-w-[280px] items-end border-b border-white/20 pb-2 transition-colors focus-within:border-[#D4AF37]">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-transparent px-2 py-1 text-xs text-[#FAF8F5] outline-none placeholder:text-white/30" 
                />
                <button className="ml-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] transition-colors hover:text-white">
                  Submit
                </button>
              </div>
            </div>

          </div>
          
          <div className="mt-24 text-center md:mt-32">
            <h2 className="select-none font-serif text-[18vw] font-normal leading-none tracking-tight text-[#FAF8F5]/5">NOVA</h2>
          </div>

          {/* Golden Animated Signature Bar */}
          <div className="w-full bg-[linear-gradient(to_right,#bda988_0%,#D4AF37_25%,#FAF8F5_50%,#D4AF37_75%,#bda988_100%)] bg-[length:200%_auto] animate-[luxuryShimmer_6s_linear_infinite] py-3.5">
          <p className="flex items-center justify-center gap-1.5 text-center text-[9px] font-bold uppercase tracking-[0.4em] text-[#161615]">
             <span>Designed and Developed by N Narayan</span>
             <svg className="h-2.5 w-auto inline-block tracking-normal translate-y-[-1px]" viewBox="0 0 900 600" xmlns="http://w3.org">
               <rect width="900" height="600" fill="#f97316"/>
               <rect width="900" height="400" fill="#fff"/>
               <rect width="900" height="200" fill="#16a34a"/>
               <g transform="translate(450,300)">
                 <circle r="92" fill="none" stroke="#1e3a8a" strokeWidth="8"/>
                 <circle r="16" fill="#1e3a8a"/>
                 <path d="M0,0 L0,-92 M0,0 L0,92 M0,0 L92,0 M0,0 L-92,0" stroke="#1e3a8a" strokeWidth="4"/>
                 {/* Dynamic 24-spoke approximation for crisp mini rendering */}
                 <g id="spokes">
                   <path d="M0,0 L46,80 M0,0 L-46,-80 M0,0 L-46,80 M0,0 L46,-80" stroke="#1e3a8a" strokeWidth="2"/>
                   <path d="M0,0 L80,46 M0,0 L-80,-46 M0,0 L-80,46 M0,0 L80,-46" stroke="#1e3a8a" strokeWidth="2"/>
                 </g>
                 <use href="#spokes" transform="rotate(30)"/>
                 <use href="#spokes" transform="rotate(60)"/>
               </g>
               </svg>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}