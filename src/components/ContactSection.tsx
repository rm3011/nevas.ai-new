  import { useRef, useState, useEffect, type FormEvent } from "react";
  import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
  import emailjs from "@emailjs/browser";
  import ownerImage from "../assets/owner-optimized.png";
  import { BROCHURE_URL } from "../utils/brochure";
  import { useContactAnimation } from "../hooks/useContactanimation";

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const CONTACT = [
    { icon: Phone, label: "+91 9884042931", href: "tel:+919884042931" },
    { icon: Mail, label: "info@nevas.ai", href: "mailto:info@nevas.ai" },
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

  /* Reveal is plain CSS. The hook only toggles data-js (arms hidden start) and data-in (reveal). */
  const CONTACT_CSS = `
  @media (prefers-reduced-motion: no-preference) {
    #contact[data-js] [data-rise] { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .8s cubic-bezier(.16,1,.3,1); }
    #contact[data-js] [data-line] { transform: translateY(110%); transition: transform .9s cubic-bezier(.16,1,.3,1); }
    #contact[data-js] [data-image] { opacity: 0; transform: translateY(48px) scale(.96); transform-origin: 50% 100%; transition: opacity 1s ease, transform 1.2s cubic-bezier(.16,1,.3,1); }
    #contact[data-js] [data-underline], #contact[data-js] [data-stitch] { transform: scaleX(0); transform-origin: 0 50%; transition: transform 1.1s cubic-bezier(.65,0,.35,1); }
    #contact[data-in] [data-rise] { opacity: 1; transform: none; transition-delay: var(--d, .45s); }
    #contact[data-in] [data-line] { transform: none; transition-delay: var(--d, .1s); }
    #contact[data-in] [data-image] { opacity: 1; transform: none; transition-delay: .5s; }
    #contact[data-in] [data-underline], #contact[data-in] [data-stitch] { transform: none; transition-delay: var(--d, .6s); }
  }`;

  type FormState = { firstName: string; lastName: string; email: string; phone: string; message: string };
  const EMPTY: FormState = { firstName: "", lastName: "", email: "", phone: "", message: "" };

  export default function ContactSection() {
    const root = useRef<HTMLElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<FormState>(EMPTY);
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    useContactAnimation(root);

    // Focus the first input when the user clicks "Submit Details" from the popup
    useEffect(() => {
      const handleFocus = () => {
        // Small timeout ensures the browser finishes scrolling to #contact before focusing
        setTimeout(() => firstNameRef.current?.focus(), 600);
      };
      window.addEventListener("focus-contact-form", handleFocus);
      return () => window.removeEventListener("focus-contact-form", handleFocus);
    }, []);

    const update = (field: keyof FormState, value: string) =>
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
        setForm(EMPTY);
        localStorage.setItem("nevas_brochure_unlocked", "true");

        // Trigger the PDF download
        const link = document.createElement("a");
        link.href = BROCHURE_URL;
        link.download = "nevas-brochure.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (err) {
        console.error("[contact] EmailJS error:", err);
        setStatus("error");
      }
      
      // Reset the status message after 4 seconds
      setTimeout(() => setStatus("idle"), 4000);
    };

    return (
      <section
        ref={root}
        id="contact"
        aria-labelledby="contact-heading"
        className="relative isolate w-full overflow-hidden bg-cyber-bg px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
      >
        <style>{CONTACT_CSS}</style>
        <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-cyber-purple/15 via-cyber-bg to-cyber-bg" />

        {/* Spacetime fabric */}
        <canvas
          data-fabric
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full"
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            
            {/* Left: headline + form */}
            <div>
              <p data-rise className="mb-4 text-sm font-medium text-cyber-cyan">
                Textile intelligence, tailored to your mill
              </p>
              <h2
                id="contact-heading"
                className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                <span className="block overflow-hidden pb-[0.2em] -mb-[0.2em]">
                  <span data-line className="block">Let's weave something</span>
                </span>
                <span className="block overflow-hidden pb-[0.2em]">
                  <span data-line className="neon-text-gradient block">Together</span>
                </span>
              </h2>
              <span data-stitch aria-hidden="true" className="mt-2 block h-px w-56 bg-linear-to-r from-cyber-cyan to-cyber-purple [mask-image:repeating-linear-gradient(90deg,#000_0_8px,transparent_8px_14px)]" />

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field 
                    inputRef={firstNameRef} // <-- Pass the ref here
                    label="First name" 
                    value={form.firstName} 
                    onChange={(v) => update("firstName", v)} 
                    required 
                  />
                  <Field label="Last name" value={form.lastName} onChange={(v) => update("lastName", v)} />
                  <Field label="Email address" type="email" value={form.email} onChange={(v) => update("email", v)} required />
                  <Field label="Phone number" type="tel" value={form.phone} onChange={(v) => update("phone", v)} />
                </div>
                <Field label="How can we help you?" value={form.message} onChange={(v) => update("message", v)} textarea required />

                <div data-rise className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p aria-live="polite" className="min-h-5 text-sm">
                    {status === "idle" && <span className="text-gray-500">Free brochure on submit. We reply within a day.</span>}
                    {status === "sending" && <span className="text-gray-400">Sending…</span>}
                    {status === "sent" && <span className="text-cyber-cyan">Message sent. Your brochure is downloading.</span>}
                    {status === "error" && <span className="text-cyber-pink">Couldn't send. Please try again.</span>}
                  </p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="hud-book-btn hud-book-btn--purple group inline-flex items-center gap-3 px-7 py-3.5 text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-cyan disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>{status === "sending" ? "Sending…" : "Register & get brochure"}</span>
                    <ArrowRight className="h-5 w-5 text-cyber-purple transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right: frameless cut-out standing on the fabric well */}
            <div className="relative flex h-70 items-end justify-center sm:h-95 lg:h-[500px]">
              <span data-well aria-hidden="true" className="absolute bottom-3 left-1/2 block h-0 w-0" />
              <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.3),transparent_70%)]" />
              <div className="relative h-full">
                <div data-image className="h-full">
                  <img
                    src={ownerImage}
                    alt="Nevas AI founder"
                    className="pointer-events-none h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact strip */}
          <div className="relative mt-10 flex flex-col gap-6 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <span data-stitch aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-cyber-cyan/70 via-cyber-purple/60 to-transparent [mask-image:repeating-linear-gradient(90deg,#000_0_8px,transparent_8px_14px)]" />
            <ul className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10">
              {CONTACT.map(({ icon: Icon, label, href }) => {
                const inner = (
                  <span className="group flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-cyber-cyan" aria-hidden="true" />
                    <span className="text-sm text-gray-300 transition-colors group-hover:text-white">{label}</span>
                  </span>
                );
                return (
                  <li data-rise key={label}>
                    {href ? (
                      <a href={href} className="block focus-visible:outline-2 focus-visible:outline-cyber-cyan">
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>

            <div data-rise className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 after:absolute after:-inset-1 after:rounded-full after:border after:border-dashed after:border-cyber-purple/70 after:opacity-0 after:transition-opacity hover:after:animate-[spin_8s_linear_infinite] hover:after:opacity-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyber-purple/50 hover:bg-cyber-purple/10 hover:text-cyber-purple focus-visible:outline-2 focus-visible:outline-cyber-purple"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* Thread-style underline field */
  type FieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    textarea?: boolean;
    inputRef?: React.RefObject<HTMLInputElement | null>;
  };

  function Field({ label, value, onChange, type = "text", required, textarea, inputRef }: FieldProps) {
    const control =
      "w-full bg-transparent pb-2.5 pt-1 font-sans text-base text-white placeholder:text-gray-600 focus:outline-none";

    return (
      <label data-rise className="group relative block">
        <span className="mb-1 block text-xs font-medium text-gray-500 transition-colors group-focus-within:text-cyber-cyan">
          {label}
          {required && <span className="text-cyber-purple"> *</span>}
        </span>
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tell us about your project..."
            required={required}
            rows={2}
            className={`${control} resize-none`}
          />
        ) : (
          <input
            ref={inputRef} // <-- Attach the ref here
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            required={required}
            className={control}
          />
        )}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/15" />
        <span data-underline aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-cyber-cyan to-cyber-purple [mask-image:repeating-linear-gradient(90deg,#000_0_6px,transparent_6px_11px)]" />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-cyber-cyan to-cyber-purple transition-transform duration-500 group-focus-within:scale-x-100" />
      </label>
    );
  }