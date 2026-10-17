import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "WHO WE ARE", href: "#about", route: false },
  { label: "WHAT WE DO", href: "#services", route: false },
  { label: "LATEST SHORTS", href: "#shorts", route: false },
  { label: "BLOG", href: "/blogs", route: true },
  { label: "CONTACT US", href: "#contact", route: false },
];

const SERVICE_LINKS = [
  "AI Consulting Services",
  "Custom AI & ML Development",
  "Generative AI Development",
  "Conversational AI",
  "AI App Development",
  "LLM Fine-Tuning",
];

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

const CONTACT = [
  { icon: Phone, label: "+91 9884042931", href: "tel:+919884042931" },
  { icon: Mail, label: "info@nevas.ai", href: "mailto:info@nevas.ai" },
  {
    icon: MapPin,
    label: "39, Elumalai Street, West Tambaram, Chennai 600 045, India",
    href: undefined,
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-cyber-purple/15 bg-cyber-bg">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-20 -z-10 h-95 w-95 rounded-full bg-cyber-cyan/10 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-20 -z-10 h-95 w-95 rounded-full bg-cyber-purple/10 blur-[180px]"
      />

      {/* Faint grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 bg-[linear-gradient(rgba(0,240,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px]"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Top: brand + 3 link columns */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <a href="#" className="inline-flex items-center" aria-label="Nevas AI home">
              <img
                src="/logo.png"
                alt="Nevas AI"
                className="h-6 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </a>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              Powering the future of fashion and manufacturing with AI-driven
              automation, intelligence, and scale.
            </p>

            {/* Socials — purple */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cyber-purple/30 bg-cyber-purple/5 text-cyber-purple transition-all hover:border-cyber-purple/70 hover:bg-cyber-purple/15 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigate column */}
          <div className="lg:col-span-2">
            <h4 className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-cyber-purple">
             [ Navigate ]
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) =>
                l.route ? (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-sm text-gray-400 transition-colors hover:text-cyber-purple"
                    >
                      {l.label}
                    </Link>
                  </li>
                ) : (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-gray-400 transition-colors hover:text-cyber-purple"
                    >
                      {l.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services column */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-cyber-purple">
              [ Services ]
            </h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((label) => (
                <li key={label}>
                  <a
                    href="#services"
                    className="text-sm text-gray-400 transition-colors hover:text-cyber-purple"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-cyber-purple">
              [ Contact ]
            </h4>
            <ul className="space-y-4">
              {CONTACT.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <span className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyber-purple" />
                    <span className="text-sm leading-relaxed text-gray-400">
                      {item.label}
                    </span>
                  </span>
                );
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="block transition-colors hover:text-cyber-purple"
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Divider — purple */}
        <div className="my-10 h-px w-full bg-linear-to-r from-transparent via-cyber-purple/30 to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
            © {year} Nevas.ai Consulting — All rights reserved
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-mono text-[11px] uppercase tracking-widest text-gray-500 transition-colors hover:text-cyber-purple"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-mono text-[11px] uppercase tracking-widest text-gray-500 transition-colors hover:text-cyber-purple"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}