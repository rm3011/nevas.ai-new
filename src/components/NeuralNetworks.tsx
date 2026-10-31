import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import robotImage from "../assets/conveyer-belt-image.jpeg";
import { useNeuralAssemble, NN_TOTAL, type NNProgress } from "../hooks/useNeuralAssemble";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const capabilities = ["Intelligent automation", "Custom AI applications", "Smarter decisions"];

export default function NeuralNetworks() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useRef<NNProgress>({ t: 0 }).current;

  // canvas engine: draws whenever progress.t changes
  useNeuralAssemble(canvasRef, progress, robotImage);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".nn-line", { yPercent: 110 });
        gsap.set(".nn-fade", { autoAlpha: 0, y: 16 });

        // One timeline that plays each time the section enters view (not scrubbed)
        const tl = gsap
          .timeline({ paused: true })
          .to(progress, { t: NN_TOTAL, duration: NN_TOTAL, ease: "none" }, 0)
          .to(".nn-line", { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.12 }, 0.6)
          .to(".nn-fade", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 }, 1.3)
          .fromTo(".nn-aura", { opacity: 0.2 }, { opacity: 1, duration: 1.2, ease: "power2.out" }, 2.6);

        // Replays every visit: plays on entry (from either direction) and resets
        // once the section is fully off-screen, so it is blank and ready next time.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 65%",
          animation: tl,
          toggleActions: "restart reset restart reset",
        });
      });

      // Reduced motion: finished robot, no intro
      mm.add("(prefers-reduced-motion: reduce)", () => {
        progress.t = NN_TOTAL;
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="neural-networks-heading"
      className="relative isolate overflow-hidden bg-cyber-bg py-16 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 md:grid-cols-[1.05fr_0.95fr] lg:px-14">
        {/* Robot assembles here. Decorative, so hidden from screen readers. */}
        <div aria-hidden="true" className="relative h-[22rem] sm:h-[28rem] md:h-[34rem] lg:h-[40rem]">
          <div className="nn-aura absolute inset-0 -z-10 bg-[radial-gradient(closest-side,rgba(60,90,255,0.28),transparent)]" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full mix-blend-screen" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="nn-fade mb-4 font-mono text-xs uppercase tracking-[0.24em] text-cyber-cyan">
            Intelligence, built for what’s next
          </p>

          <h2
            id="neural-networks-heading"
            className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="nn-line neon-text-gradient block">Artificial</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="nn-line neon-text-gradient block">Intelligence</span>
            </span>
          </h2>

          <h3 className="nn-fade mt-3 max-w-xl font-display text-2xl font-medium leading-tight text-white sm:text-3xl">
            Pioneers in AI solutions &amp; innovation
          </h3>

          <p className="nn-fade mt-5 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
            At Nevas AI, we turn emerging AI into practical solutions that help businesses work smarter, make better
            decisions, and grow with confidence.
          </p>

          <p className="nn-fade mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
            From intelligent automation to custom AI applications, our team helps you find the right technology for your
            next big idea.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {capabilities.map((c) => (
              <li
                key={c}
                className="nn-fade rounded-full border border-cyber-cyan/20 bg-white/[0.03] px-3 py-1 font-mono text-xs text-gray-300"
              >
                {c}
              </li>
            ))}
          </ul>

          <a href="#contact" className="nn-fade hud-book-btn hud-book-btn--purple group mt-7 w-fit gap-2">
            <span>Let’s build what’s next</span>
            <ArrowRight className="h-4 w-4 text-cyber-purple transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}