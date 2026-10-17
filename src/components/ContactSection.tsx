import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import ownerImage from "../assets/owner-optimized.png";

/* ------------------------------------------------------------------ */
/* EmailJS config                                                      */
/* ------------------------------------------------------------------ */

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

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
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

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
      className="relative isolate w-full overflow-hidden bg-cyber-bg py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-14"
    >
      {/* Ambient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 -z-10 h-100 w-100 rounded-full bg-cyber-cyan/15 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-105 w-105 rounded-full bg-cyber-purple/15 blur-[200px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center space-x-2 rounded-full glass-panel border border-cyber-cyan/30 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyber-cyan"
          >
            <span>[ get in touch ]</span>
          </motion.p>

          <motion.h2
            id="contact-heading"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Let's Build Something{" "}
            <span className="neon-text-gradient">Together</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-400"
          >
            Say something to start a live chat — we usually reply within a
            business day.
          </motion.p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-8 pt-32 sm:pt-40 lg:grid-cols-2 lg:gap-16 lg:pt-44">
          {/* ============ LEFT: Card with photo ============ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
            className="relative"
          >
            {/* Photo */}
            <img
              src={ownerImage}
              alt="Nevas AI founder"
              className="pointer-events-none absolute bottom-0 right-2 z-20 h-105 w-auto object-contain object-bottom drop-shadow-[0_0_30px_rgba(168,85,247,0.15)] sm:h-125 sm:right-4 lg:h-140 lg:-right-6"
              loading="lazy"
              decoding="async"
            />

            {/* Card */}
            <div className="glass-panel relative z-10 mr-20 overflow-hidden rounded-2xl border border-cyber-cyan/20 p-8 sm:mr-28 sm:p-10 lg:mr-0 lg:pr-60">
              <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Contact Information
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Say something to start a live chat!
              </p>

              <ul className="mt-8 space-y-6">
                {CONTACT.map((item) => {
                  const Icon = item.icon;
                  const inner = (
                    <span className="flex items-start gap-4">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyber-cyan" />
                      <span className="text-sm leading-relaxed text-gray-300">
                        {item.label}
                      </span>
                    </span>
                  );
                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="block transition-colors hover:text-cyber-cyan"
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

              {/* Socials */}
              <div className="mt-10 flex items-center gap-4">
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
          </motion.div>

          {/* ============ RIGHT: Form ============ */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 18,
              delay: 0.15,
            }}
            onSubmit={handleSubmit}
            className="flex flex-col justify-between"
          >
            <div className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <Field
                  label="First Name"
                  value={form.firstName}
                  onChange={(v) => update("firstName", v)}
                  required
                />
                <Field
                  label="Last Name"
                  value={form.lastName}
                  onChange={(v) => update("lastName", v)}
                />
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  required
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                />
              </div>

              <Field
                label="Message"
                value={form.message}
                onChange={(v) => update("message", v)}
                textarea
                required
              />
            </div>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-mono text-xs">
                {status === "sending" && (
                  <span className="text-gray-400">// Sending…</span>
                )}
                {status === "sent" && (
                  <span className="text-cyber-purple">
                    // Message sent — we'll be in touch
                  </span>
                )}
                {status === "error" && (
                  <span className="text-cyber-pink">
                    // Something went wrong. Try again.
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="hud-book-btn hud-book-btn--purple group inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {status === "sending" ? "Sending…" : "Send Message"}
                </span>
                <Send className="h-4 w-4 text-cyber-purple transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Field                                                               */
/* ------------------------------------------------------------------ */

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  textarea,
}: FieldProps) {
  const baseClasses = [
    "w-full bg-transparent border-0 border-b border-gray-700",
    "focus:border-cyber-purple focus:outline-none focus:ring-0",
    "text-white placeholder:text-gray-500",
    "pb-3 pt-2 text-sm transition-colors duration-300",
    "font-sans",
  ].join(" ");

  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          required={required}
          rows={2}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          required={required}
          className={baseClasses}
        />
      )}
    </label>
  );
}