import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dressSrc from "../assets/scrolly-telling/dress.png";
import { useWeaveCanvas, type Progress } from "../hooks/useWeaveCanvas";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One master timeline = 9 units. Everything below is positioned on it.
//  0 ─ 2     Phase 01 (threads begin to arrive)
//  2 ─ 4     Phase 02
//  4 ─ 6     Phase 03
//  6.4 ─ 9   the real dress "develops" over the woven threads (ends EXACTLY at 9)
//  7.4 ─ 9   Phase 04
//
// The reveal lands on the final unit, so the next scroll tick releases the
// pinned section immediately — no dead scroll space after the image is shown.

export default function ScrollytellingGSAP() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const progress = useRef<Progress>({ p: 0 }).current;

  // draws threads whenever progress.p changes
  useWeaveCanvas(canvasRef, imgRef, progress, dressSrc);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });

        // drives the canvas (9-unit master timeline)
        tl.to(progress, { p: 1, duration: 9 }, 0)
          .fromTo(".progress-bar", { scaleY: 0 }, { scaleY: 1, duration: 9 }, 0)
          .to(".scroll-hint", { autoAlpha: 0, duration: 0.5 }, 0)

          // story
          .to(".step-1", { autoAlpha: 0, y: -24, duration: 0.5, ease: "power1.in" }, 1.3)
          .fromTo(".step-2", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.8)
          .to(".step-2", { autoAlpha: 0, y: -24, duration: 0.5, ease: "power1.in" }, 3.2)
          .fromTo(".step-3", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 3.7)
          .to(".step-3", { autoAlpha: 0, y: -24, duration: 0.5, ease: "power1.in" }, 5.2)
          .fromTo(".step-4", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 7.4)

          // the real dress develops out of the threads — ends EXACTLY at unit 9
          .fromTo(
            ".dress-img",
            { autoAlpha: 0, scale: 1.06, filter: "blur(14px) brightness(1.8)" },
            { autoAlpha: 1, scale: 1, filter: "blur(0px) brightness(1)", duration: 2.6, ease: "power2.out" },
            6.4
          )
          .to(".thread-canvas", { opacity: 0.4, duration: 2.6 }, 6.4)
          .fromTo(".aura", { opacity: 0.35, scale: 0.9 }, { opacity: 1, scale: 1.1, duration: 4 }, 5);
      });

      // Reduced motion: show the finished dress + final message, no scrubbing
      mm.add("(prefers-reduced-motion: reduce)", () => {
        progress.p = 1;
        gsap.set([".step-1", ".step-2", ".step-3", ".scroll-hint"], { autoAlpha: 0 });
        gsap.set(".step-4", { autoAlpha: 1 });
        gsap.set(".dress-img", { autoAlpha: 1 });
        gsap.set(".thread-canvas", { opacity: 0.4 });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative h-[450vh] bg-cyber-bg text-white">
      <div className="sticky top-0 isolate flex h-svh items-center overflow-hidden bg-[#050014]">
        {/* Atmosphere */}
        <div className="aura absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_36%,rgba(138,43,226,0.22),transparent_60%)] md:bg-[radial-gradient(ellipse_at_70%_50%,rgba(138,43,226,0.22),transparent_60%)]" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#050014] via-[#050014]/60 to-transparent md:bg-linear-to-r md:via-[#050014]/70" />

        {/* Finished dress. Position is driven entirely by useWeaveCanvas's layout(). */}
        <img
          ref={imgRef}
          src={dressSrc}
          alt="A neon dress woven from thousands of glowing threads"
          draggable={false}
          className="dress-img pointer-events-none absolute z-[-5] opacity-0 mix-blend-screen mask-[radial-gradient(closest-side,#000_72%,transparent_100%)] will-change-[opacity,transform,filter]"
        />

        {/* Threads */}
        <canvas
          ref={canvasRef}
          aria-hidden
          className="thread-canvas pointer-events-none absolute inset-0 z-5 h-full w-full"
        />

        {/* Progress rail */}
        <div className="absolute left-3 top-1/2 h-24 w-px -translate-y-1/2 bg-white/10 md:left-6">
          <div className="progress-bar h-full w-full origin-top bg-cyber-cyan" />
        </div>

        {/* Story. Mobile: anchored to the top so it never sits under the dress.
            Desktop: original centered layout. */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-start px-6 pt-[15vh] sm:px-14 md:items-center md:pt-0">
          <div className="grid max-w-md">
            <div className="step-1 [grid-area:1/1]">
              <p className="mb-4 font-mono text-sm uppercase tracking-widest text-cyber-cyan">Phase 01 // The Challenge</p>
              <h2 className="text-4xl font-bold text-white sm:text-6xl">
                The Cost of <span className="text-red-400">Waste.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                Traditional textile manufacturing loses millions to manual quality control and overproduction.
              </p>
            </div>

            <div className="step-2 [grid-area:1/1]">
              <p className="mb-4 font-mono text-sm uppercase tracking-widest text-cyber-purple">Phase 02 // The AI Integration</p>
              <h2 className="text-4xl font-bold text-white sm:text-6xl">
                Neural <span className="text-cyber-purple">Vision.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                We deploy optical AI on the factory floor to detect weave defects at 2,000 meters per minute.
              </p>
            </div>

            <div className="step-3 [grid-area:1/1]">
              <p className="mb-4 font-mono text-sm uppercase tracking-widest text-cyber-cyan">Phase 03 // The Prediction</p>
              <h2 className="text-4xl font-bold text-white sm:text-6xl">
                Predictive <span className="text-cyber-cyan">Supply.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                Our models forecast material demand, ensuring your looms never sit idle and inventory never rots.
              </p>
            </div>

            <div className="step-4 [grid-area:1/1]">
              <p className="mb-4 font-mono text-sm uppercase tracking-widest text-green-400">Phase 04 // The Outcome</p>
              <h2 className="text-4xl font-bold text-white sm:text-6xl">
                Zero Waste. <br /> Maximum Yield.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                A fully optimized, autonomous supply chain powered by Nevas.ai.
              </p>
            </div>
          </div>
        </div>

        <p className="scroll-hint absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-white/40">
          Scroll
        </p>
      </div>
    </section>
  );
}