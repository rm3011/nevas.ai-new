import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, useReducedMotion, animate, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";

const image = {
  src: "https://th.bing.com/th/id/R.ab534b3f175047ea3e448a7a1b738861?rik=tP9elqXc3KlRwQ&riu=http%3a%2f%2fnews-images.dhan.co%2fnahar-spinning-mills-reports-net-loss-of-1291-63-lakhs-in-q3fy26.jpg&ehk=ZedSbyuuMyyv3rphTIezpaTbrPIji2RpFFfLm5xMo0A%3d&risl=&pid=ImgRaw&r=0",
  alt: "NEVAS AI platform",
};

const stats = [
  { target: 50, suffix: "+", label: "BRANDS SCALED", color: "text-cyber-cyan" },
  { target: 42, suffix: "%", label: "RETURN REDUCTION", color: "text-cyber-purple" },
  { target: 24, suffix: "/7", label: "AUTOMATION UPTIME", color: "text-cyber-pink" },
];

const defects = [
  { top: 27, left: 14, w: 26, h: 9, label: "Slub" },
  { top: 44, left: 52, w: 30, h: 8, label: "Broken pick" },
  { top: 60, left: 26, w: 24, h: 10, label: "Oil stain" },
];
const SCAN = 3.6;

const floatIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 18, mass: 0.9 } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

function ScannerCard({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <div className="glass-panel relative h-full min-h-[320px] w-full overflow-hidden rounded-2xl border border-cyber-cyan/30 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#070b1a]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(0,243,255,.07), rgba(138,43,226,.12) 50%, rgba(255,0,255,.07)), repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 5px), repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 5px)",
        }}
      />

      {defects.map((d) => (
        <motion.div
          key={d.label}
          aria-hidden="true"
          className="absolute rounded-sm border border-cyber-pink/80 bg-cyber-pink/10"
          style={{ top: `${d.top}%`, left: `${d.left}%`, width: `${d.w}%`, height: `${d.h}%` }}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={active && !reduced ? { opacity: [0, 1, 1, 0], scale: [0.92, 1, 1, 1] } : undefined}
          transition={{
            duration: SCAN,
            times: [0, 0.05, 0.8, 1],
            delay: ((d.top + d.h) / 100) * SCAN,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span className="absolute -top-5 left-0 whitespace-nowrap rounded-sm bg-cyber-pink px-1.5 py-0.5 font-mono text-[10px] font-semibold text-black">
            {d.label}
          </span>
        </motion.div>
      ))}

      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 82%, rgba(0,243,255,.22) 98%, rgba(0,243,255,.95) 100%)",
          }}
          initial={{ y: "-100%" }}
          animate={active ? { y: ["-100%", "0%"] } : { y: "-100%" }}
          transition={{ duration: SCAN, repeat: Infinity, ease: "linear" }}
        />
      )}

      <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-cyber-cyan/30 bg-cyber-bg/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-cyber-cyan backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyber-cyan" />
        Neural Vision · Live
      </span>
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-cyber-bg/95 to-transparent px-4 pb-3 pt-10">
        <p className="font-display text-sm font-bold leading-snug text-white">Defects caught while the loom runs.</p>
        <p className="mt-0.5 text-[11px] text-gray-400">Optical AI · 2,000 meters per minute</p>
      </div>
    </div>
  );
}

function AnimatedCounter({ target, suffix, className }: { target: number; suffix: string; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);
  const reduced = !!useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reduced) {
      setCount(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (value) => setCount(Math.floor(value)),
    });
    return () => controls.stop();
  }, [isInView, target, reduced]);

  return (
    <div ref={ref} className={className}>
      {count}{suffix}
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.15]);
  const stageActive = useInView(stageRef, { margin: "-80px" });

  return (
    <section ref={sectionRef} id="about" className="relative z-10 overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        style={{ scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-cyan/5 blur-[180px]"
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 space-y-4 text-center"
        >
          <motion.div
            variants={floatIn}
            className="glass-panel inline-flex items-center space-x-2 rounded-full border border-cyber-cyan/30 px-3 py-1"
          >
            <span className="text-xs uppercase tracking-widest text-cyber-cyan">[ WHO WE ARE ]</span>
          </motion.div>

          <motion.h2
            variants={floatIn}
            className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Built for the <span className="neon-text-gradient">Next Era</span> of Fashion
          </motion.h2>
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={stageRef}
          className="relative isolate overflow-hidden rounded-[28px] border border-cyber-cyan/20 bg-cyber-bg shadow-[0_30px_120px_rgba(0,0,0,0.5)]"
        >
          {/* Background Image & Gradient Overlays */}
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          {/* Dark gradient so the text and card remain readable over the image */}
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-cyber-bg via-cyber-bg/80 to-cyber-bg/20 lg:bg-linear-to-r lg:from-cyber-bg/95 lg:via-cyber-bg/60 lg:to-transparent" />

          {/* Inner Content Wrapper (No massive top padding anymore) */}
          <div className="relative p-6 sm:p-10 lg:p-14">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reduced ? 0 : 0.7, ease: "easeOut" }}
              className="flex flex-col gap-10"
            >
              {/* Top section: Text + Scanner Card */}
              <div className="grid items-center gap-10 lg:grid-cols-2">
                
                {/* Text Content */}
                <div className="space-y-6">
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    We don't just build AI. We build the bridge between <span className="text-cyber-cyan">intelligence</span>{" "}
                    and <span className="text-cyber-pink">style</span>.
                  </h3>

                  <p className="leading-relaxed text-gray-300">
                    NEVAS.AI was founded by a collective of engineers and fashion industry veterans who saw a gap: fashion
                    brands were drowning in data but starving for insight. We built our enterprise AI platform to turn that
                    noise into action.
                  </p>

                  <p className="leading-relaxed text-gray-400">
                    From virtual try-on technology that reduces returns, to demand forecasting that eliminates waste, our
                    solutions are purpose-built for the unique rhythm of the apparel industry.
                  </p>

                  <div className="pt-2">
                    <a href="#contact" className="hud-book-btn hud-book-btn--purple group w-fit gap-2">
                      <span>Get your free fabric-waste estimate</span>
                      <ArrowRight className="h-4 w-4 text-cyber-purple transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>

                {/* Scanner Card */}
                <div className="h-[320px] w-full sm:h-[400px] lg:h-[450px]">
                  <ScannerCard active={stageActive} reduced={reduced} />
                </div>
              </div>

              {/* Bottom section: Stats */}
              <div className="glass-panel mt-4 grid grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {stats.map((s) => (
                  <div key={s.label} className="px-3 py-6 text-center sm:px-8 sm:py-8 sm:text-left">
                    <AnimatedCounter 
                      target={s.target} 
                      suffix={s.suffix} 
                      className={`text-4xl font-bold tabular-nums sm:text-5xl lg:text-6xl ${s.color}`} 
                    />
                    <div className="mt-2 text-xs tracking-wide text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}