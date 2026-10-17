import { useState } from "react";
import { motion } from "motion/react";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const CHANNEL_URL = "https://youtube.com/@nevasai";

type Short = {
  id: string;
  title: string;
  published: string;
};

const SHORTS: Short[] = [
  {
    id: "Ba8wxU-t6EY",
    title: "The Honest State of AI in Garment Manufacturing",
    published: "2026-10-09",
  },
  {
    id: "IhBs5_SGVu0",
    title: "AI for Merchandisers: Cut Order Follow-Up Time in Half",
    published: "2026-10-08",
  },
  {
    id: "5DNDIwbzCj8",
    title: "10 Expensive Garment Factory Problems AI Can Solve",
    published: "2026-10-07",
  },
  {
    id: "ruSRETns2x8",
    title: "Where Should a Textile or Garment Business Start With AI?",
    published: "2026-10-06",
  },
  {
    id: "3Z2HeR68JNU",
    title: "38% of Indian Textile Firms Have No Digital System",
    published: "2026-10-05",
  },
];

const thumbnailFor = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/* ------------------------------------------------------------------ */
/* Play indicator — reused in both layouts                             */
/* ------------------------------------------------------------------ */

function PlayBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const dims = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      className={`absolute left-1/2 top-1/2 flex ${dims} -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-cyber-bg/70 backdrop-blur-md transition-colors duration-300 group-hover:bg-cyber-purple/20`}
      style={{
        clipPath:
          "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
        boxShadow:
          "0 0 20px rgba(168, 85, 247, 0.35), inset 0 0 12px rgba(168, 85, 247, 0.15)",
      }}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath:
            "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
          background:
            "linear-gradient(135deg, #a855f7 0%, rgba(168, 85, 247, 0.4) 50%, #a855f7 100%)",
          padding: "1.5px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        aria-hidden="true"
      />
      <span className={`relative ml-0.5 ${textSize} text-cyber-purple`}>
        ▶
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function YoutubeVideos() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SHORTS[activeIndex];

  return (
    <section
      id="shorts"
      className="relative isolate w-full overflow-hidden bg-cyber-bg py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 -z-10 h-95 w-95 rounded-full bg-cyber-cyan/15 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-105 w-105 rounded-full bg-cyber-purple/15 blur-[200px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* ---------------- Heading ---------------- */}
        <div className="mb-10 max-w-4xl sm:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center space-x-2 rounded-full glass-panel border border-cyber-cyan/30 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyber-cyan"
          >
            <span>[ latest shorts ]</span>
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            There Are So Many Digital
            <br className="hidden sm:block" />
            <span className="neon-text-gradient">
              Marketing Agencies Out There
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-400"
          >
            So, we bet you're wondering... Watch our latest shorts to see how
            we're different.
          </motion.p>
        </div>

        {/* ============================================================= */}
        {/* MOBILE LAYOUT (< md)                                          */}
        {/* ============================================================= */}
        <div className="md:hidden">
          <div className="relative mx-auto aspect-9/16 w-full max-w-sm overflow-hidden rounded-2xl border border-cyber-purple/40 bg-cyber-card shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <iframe
              key={active.id}
              src={`https://www.youtube.com/embed/${active.id}?autoplay=1&mute=1&rel=0&loop=1&playlist=${active.id}`}
              title={active.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>

          {/* Thumbnail strip below */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {SHORTS.map((short, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={short.id}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Play: ${short.title}`}
                  className={[
                    "group relative aspect-9/16 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 sm:w-24",
                    isActive
                      ? "border-cyber-purple/70 opacity-100 ring-2 ring-cyber-purple/40"
                      : "border-white/10 opacity-60 hover:opacity-100",
                  ].join(" ")}
                >
                  <img
                    src={thumbnailFor(short.id)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================= */}
        {/* DESKTOP LAYOUT (>= md): expanding row                         */}
        {/* ============================================================= */}
        <div
          className="hidden h-130 w-full items-stretch gap-4 md:flex"
          onMouseLeave={() => setActiveIndex(0)}
        >
          {SHORTS.map((short, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.div
                key={short.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={[
                  "group relative cursor-pointer overflow-hidden rounded-2xl border bg-cyber-card",
                  isActive
                    ? "border-cyber-purple/60 shadow-[0_0_40px_rgba(168,85,247,0.25)]"
                    : "border-white/10",
                ].join(" ")}
                animate={{
                  width: isActive
                    ? "calc(100% - 4 * 88px - 4 * 16px)"
                    : "88px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 28,
                  mass: 0.8,
                }}
                style={{ flexShrink: 0 }}
              >
                {/* 
                  PERFORMANCE FIX: Instead of rendering 5 iframes in the background,
                  we only render the iframe for the active video. The rest are just 
                  optimized images.
                */}
                {isActive ? (
                  <iframe
                    key={short.id}
                    src={`https://www.youtube.com/embed/${short.id}?autoplay=1&mute=1&rel=0&loop=1&playlist=${short.id}`}
                    title={short.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <>
                    <img
                      src={thumbnailFor(short.id)}
                      alt={short.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                    <PlayBadge size="md" />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ---------------- CTA ---------------- */}
        <div className="mt-10 text-center">
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hud-book-btn hud-book-btn--purple group inline-flex items-center gap-2"
          >
            <span>Watch More On YouTube</span>
            <span
              aria-hidden="true"
              className="text-cyber-purple transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}