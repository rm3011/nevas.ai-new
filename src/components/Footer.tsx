import { motion } from "motion/react";
import { Link } from "react-router-dom";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/nevasaiconsulting",
    path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nevas.ai/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/nevasai/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@nevasai",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-white/5 bg-cyber-bg">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-75 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-purple/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-cyber-cyan/5 blur-[100px]" />

      {/* Reduced outer padding from py-16 to py-8 sm:py-10 */}
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        
        {/* Top: Brand & Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <Link to="/" className="group inline-flex items-center" aria-label="Nevas AI home">
            <img
              src="/logo.png"
              alt="Nevas AI"
              // Slightly reduced logo size
              className="h-6 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </Link>

          {/* Reduced top margin from mt-6 to mt-3 */}
          <p className="mt-3 max-w-md text-xs leading-relaxed text-gray-400 sm:text-sm">
            Powering the future of fashion and manufacturing with AI-driven automation, intelligence, and scale.
          </p>
        </motion.div>

        {/* Socials */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
          }}
          // Reduced top margin from mt-8 to mt-5
          className="mt-5 flex items-center gap-3 sm:gap-4"
        >
          {SOCIALS.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 }
              }}
              // Slightly smaller social icons
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/2 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-cyber-purple/50 hover:bg-cyber-purple/10 hover:text-cyber-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] sm:h-10 sm:w-10"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" aria-hidden="true">
                <path d={s.path} />
              </svg>
            </motion.a>
          ))}
        </motion.div>

        {/* Divider - Reduced margins from my-10 to my-6 */}
        <div className="my-6 h-px w-full max-w-3xl bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Bar */}
        <div className="flex w-full max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 sm:text-[11px]">
            © {year} Nevas.ai Consulting. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-500 transition-colors hover:text-cyber-purple sm:text-[11px]"
            >
              Privacy
            </a>
            <a
              href="#"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-500 transition-colors hover:text-cyber-purple sm:text-[11px]"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}