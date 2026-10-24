import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import emailjs from "@emailjs/browser";
import ownerImage from "../assets/owner-optimized.png";

/* ------------------------------------------------------------------ */
/* EmailJS config                                                      */
/* ------------------------------------------------------------------ */

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const CONTACT = [
  {
    icon: Phone,
    label: "+91 9884042931",
    href: "tel:+919884042931",
  },
  {
    icon: Mail,
    label: "info@nevas.ai",
    href: "mailto:info@nevas.ai",
  },
  {
    icon: MapPin,
    label: "39, Elumalai Street, West Tambaram, Chennai 600 045, India",
    href: undefined,
  },
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
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 24 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@nevasai",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ContactSection() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: `${form.firstName} ${form.lastName}`.trim(),
          from_email: form.email,
          phone: form.phone,
          message: form.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus("sent");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("[contact] EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate w-full overflow-hidden bg-[#040711] px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Premium Background Effects */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-purple/10 via-[#040711] to-[#040711]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
      
      {/* Grid Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-7xl">
        
        {/* Massive Header */}
        <div className="mb-16 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center space-x-2 rounded-full glass-panel border border-cyber-cyan/30 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-cyber-cyan"
          >
            <span>[ get in touch ]</span>
          </motion.p>

          <motion.h2
            id="contact-heading"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]"
          >
            Let's Build Something <br />
            <span className="neon-text-gradient">Together</span>
          </motion.h2>
        </div>

        {/* Main Glass Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
          className="relative mx-auto w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0f1c]/80 shadow-[0_0_100px_-20px_rgba(168,85,247,0.15)] backdrop-blur-3xl"
        >
          {/* Subtle inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/5" />

          {/* SWAPPED GRID COLUMNS: Form left, Info right */}
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)]">
            
            {/* LEFT SIDE: Form */}
            <div className="relative flex flex-col p-8 sm:p-10 lg:p-12">
              <div className="mb-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyber-purple">
                  Start a conversation
                </p>
                <h4 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                  Send us a message
                </h4>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="First Name" value={form.firstName} onChange={(v) => update("firstName", v)} required />
                    <Field label="Last Name" value={form.lastName} onChange={(v) => update("lastName", v)} />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Email Address" type="email" value={form.email} onChange={(v) => update("email", v)} required />
                    <Field label="Phone Number" type="tel" value={form.phone} onChange={(v) => update("phone", v)} />
                  </div>

                  <Field label="How can we help you?" value={form.message} onChange={(v) => update("message", v)} textarea required />
                </div>

                <div className="mt-auto flex flex-col-reverse items-start justify-between gap-6 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center">
                  <div aria-live="polite" className="min-h-5 font-mono text-xs">
                    {status === "sending" && <span className="text-gray-400">// Sending…</span>}
                    {status === "sent" && <span className="text-cyber-cyan">// Message sent — we'll be in touch</span>}
                    {status === "error" && <span className="text-cyber-pink">// Something went wrong. Try again.</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="hud-book-btn hud-book-btn--purple group inline-flex items-center gap-3 px-8 py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>{status === "sending" ? "Sending…" : "Send Message"}</span>
                    <ArrowRight className="h-5 w-5 text-cyber-purple transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT SIDE: Info & Image */}
            <aside className="relative isolate flex min-h-[540px] flex-col overflow-hidden border-t border-white/10 bg-gradient-to-bl from-[#0c1221] via-[#080d19] to-[#050812] p-8 sm:p-10 lg:min-h-full lg:border-l lg:border-t-0 lg:p-12">
              
              <div className="relative z-20 max-w-[75%] lg:max-w-[65%]">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-cyber-cyan">
                  Contact Information
                </p>
                <h3 className="font-display text-3xl font-bold leading-tight tracking-tight text-white">
                  Let's talk about your next big idea.
                </h3>
                
                <ul className="mt-10 space-y-6">
                  {CONTACT.map((item) => {
                    const Icon = item.icon;
                    const inner = (
                      <span className="group flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-cyber-cyan transition-all duration-300 group-hover:border-cyber-cyan/50 group-hover:bg-cyber-cyan/10 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 group-hover:text-gray-400 transition-colors">
                            {item.icon === Phone ? "Phone" : item.icon === Mail ? "Email" : "Address"}
                          </span>
                          <span className="mt-1 block break-words text-sm font-medium leading-relaxed text-gray-200 group-hover:text-white transition-colors">
                            {item.label}
                          </span>
                        </span>
                      </span>
                    );
                    return (
                      <li key={item.label}>
                        {item.href ? (
                          <a href={item.href} className="block w-fit max-w-full transition-transform hover:-translate-y-0.5">
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

              {/* Premium Image Treatment (Adjusted for right side) */}
              <div className="absolute inset-y-0 right-0 flex w-[45%] items-end justify-end lg:w-[40%]">
                <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyber-purple/20 blur-[90px]" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-full w-full bg-gradient-to-t from-[#050812] via-transparent to-transparent z-10" />
                <img
                  src={ownerImage}
                  alt="Nevas AI founder"
                  className="pointer-events-none relative z-20 h-[260px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_0_40px_rgba(168,85,247,0.3)] lg:h-[85%]"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Socials */}
              <div className="relative z-20 mt-auto flex gap-3 pt-10">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-cyber-purple/50 hover:bg-cyber-purple/10 hover:text-cyber-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </aside>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Enhanced Form Field                                                 */
/* ------------------------------------------------------------------ */

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
};

function Field({ label, value, onChange, type = "text", required, textarea }: FieldProps) {
  const baseClasses = [
    "w-full rounded-xl border border-white/10 bg-[#050914]/60 px-5 py-4",
    "text-sm text-white placeholder:text-gray-600",
    "transition-all duration-300",
    "hover:border-white/20 hover:bg-[#050914]/80",
    "focus:border-cyber-purple/70 focus:bg-[#050914] focus:outline-none focus:ring-4 focus:ring-cyber-purple/10",
    "font-sans shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
  ].join(" ");

  return (
    <label className="block group">
      <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 transition-colors group-focus-within:text-cyber-purple">
        {label} {required && <span className="text-cyber-purple/70">*</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tell us about your project..."
          required={required}
          rows={4}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          required={required}
          className={baseClasses}
        />
      )}
    </label>
  );
}