import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from "motion/react";

const image = {
  src: "https://textalks.com/wp-content/uploads/2026/01/AI-copy.jpg",
  alt: "NEVAS AI",
};

const stats = [
  { value: "50+", label: "BRANDS SCALED", color: "text-cyber-cyan" },
  { value: "42%", label: "RETURN REDUCTION", color: "text-cyber-purple" },
  { value: "24/7", label: "AUTOMATION UPTIME", color: "text-cyber-pink" },
];

/** Fade + drift upward when entering view. Physics-y spring. */
const floatIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 18,
      mass: 0.9,
    },
  },
};

/** Wrapper that staggers its children's animation. */
const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: image drifts slower than the page as you scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.15]);

  const statsInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient glow that breathes with scroll */}
      <motion.div
        style={{ scale: glowScale }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-cyber-cyan/5 rounded-full blur-[180px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            variants={floatIn}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-cyber-cyan/30"
          >
            <span className="text-xs tracking-widest text-cyber-cyan uppercase">
              [ WHO WE ARE ]
            </span>
          </motion.div>

          <motion.h2
            variants={floatIn}
            className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            Built for the{" "}
            <span className="neon-text-gradient">Next Era</span> of Fashion
          </motion.h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <motion.div
            style={{ y: textY }}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <motion.h3
              variants={floatIn}
              className="text-2xl font-bold text-white font-display"
            >
              We don't just build AI. We build the bridge between{" "}
              <span className="text-cyber-cyan">intelligence</span> and{" "}
              <span className="text-cyber-pink">style</span>.
            </motion.h3>

            <motion.p variants={floatIn} className="text-gray-400 leading-relaxed">
              NEVAS.AI was founded by a collective of engineers and fashion
              industry veterans who saw a gap: fashion brands were drowning in
              data but starving for insight. We built our enterprise AI platform
              to turn that noise into action.
            </motion.p>

            <motion.p variants={floatIn} className="text-gray-400 leading-relaxed">
              From virtual try-on technology that reduces returns, to demand
              forecasting that eliminates waste, our solutions are purpose-built
              for the unique rhythm of the apparel industry.
            </motion.p>

            {/* Stats Row */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-800">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: 0.2 + i * 0.15,
                    type: "spring",
                    stiffness: 80,
                    damping: 16,
                  }}
                >
                  <div className={`text-4xl sm:text-5xl font-bold ${s.color}`}>
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Single Large Image */}
          <motion.div
            style={{ y: imageY }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                type: "spring",
                stiffness: 55,
                damping: 18,
                delay: 0.1,
              }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="glass-panel p-2 rounded-2xl border border-cyber-cyan/20 overflow-hidden group"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-[28rem] lg:h-[36rem] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-cyber-bg/80 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}