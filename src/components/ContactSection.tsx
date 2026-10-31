import { useRef, useState, useEffect, type FormEvent } from "react";
import { Mail, MapPin, Phone, ArrowRight, RefreshCw } from "lucide-react";
import emailjs from "@emailjs/browser";
import ownerImage from "../assets/owner-optimized.png";
import { BROCHURE_URL } from "../utils/brochure";
import { useContactAnimation } from "../hooks/useContactanimation";
import { 
  loadCaptchaEnginge, 
  LoadCanvasTemplateNoReload, 
  validateCaptcha 
} from "react-simple-captcha";

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

  // Captcha state
  const [captchaInput, setCaptchaInput] = useState("");

  useContactAnimation(root);

  useEffect(() => {
    // Initialize captcha engine with 4 characters
    loadCaptchaEnginge(4);
    
    const handleFocus = () => {
      setTimeout(() => firstNameRef.current?.focus(), 600);
    };
    window.addEventListener("focus-contact-form", handleFocus);
    return () => window.removeEventListener("focus-contact-form", handleFocus);
  }, []);

  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate captcha (false = don't reload captcha on failure so user can try again)
    if (!validateCaptcha(captchaInput, false)) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

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
      setCaptchaInput("");
      loadCaptchaEnginge(4); // Generate a new captcha for next time

      localStorage.setItem("nevas_brochure_unlocked", "true");

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
              <span className="block overflow-hidden pb-[0.2em] mb-[0.2em]">
                <span data-line className="block">Let's weave something</span>
              </span>
              <span className="block overflow-hidden pb-[0.2em]">
                <span data-line className="neon-text-gradient block">Together</span>
              </span>
            </h2>
            <span data-stitch aria-hidden="true" className="mt-2 block h-px w-56 bg-linear-to-r from-cyber-cyan to-cyber-purple mask-[repeating-linear-gradient(90deg,#000_0_8px,transparent_8px_14px)]" />

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  inputRef={firstNameRef}
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
                <div className="flex flex-col gap-2 min-h-11 justify-center">
                  
                  {/* Captcha Area matching your screenshot */}
                  <div className="flex items-center gap-3">
                    {/* Refresh Button */}
                    <button 
                      type="button" 
                      onClick={() => loadCaptchaEnginge(4)}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Refresh Captcha"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </button>

                    {/* Canvas Image Container - White background for visibility */}
                    <div className="bg-white rounded px-2 py-1 flex items-center justify-center min-w-22.5 min-h-9">
                       <LoadCanvasTemplateNoReload />
                    </div>

                    {/* Input Field */}
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Captcha"
                      required
                      className="w-28 bg-transparent border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyber-cyan"
                    />
                  </div>

                  <p aria-live="polite" className="min-h-5 text-sm">
                    {status === "sending" && <span className="text-gray-400">Sending…</span>}
                    {status === "sent" && <span className="text-cyber-cyan">Message sent. Your brochure is downloading.</span>}
                    {status === "error" && <span className="text-cyber-pink">Couldn't send. Please verify captcha and try again.</span>}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="hud-book-btn hud-book-btn--purple group inline-flex items-center gap-3 px-7 py-3.5 text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-cyan disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{status === "sending" ? "Sending…" : "Submit"}</span>
                  <ArrowRight className="h-5 w-5 text-cyber-purple transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right: frameless cut-out standing on the fabric well */}
          <div className="relative flex h-70 items-end justify-center sm:h-95 lg:h-125">
            <span data-well aria-hidden="true" className="absolute bottom-3 left-1/2 block h-0 w-0" />

            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.3),transparent_70%)]" />

            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

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
          <span data-stitch aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-cyber-cyan/70 via-cyber-purple/60 to-transparent mask-[repeating-linear-gradient(90deg,#000_0_8px,transparent_8px_14px)]" />
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
      <span className="mb-1 block text-sm font-semibold text-gray-400 transition-colors group-focus-within:text-cyber-cyan">
        {label}
        {required && <span className="text-cyber-purple"> *</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={2}
          className={`${control} resize-none`}
        />
      ) : (
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={control}
        />
      )}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/15" />
      <span data-underline aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-cyber-cyan to-cyber-purple mask-[repeating-linear-gradient(90deg,#000_0_6px,transparent_6px_11px)]" />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-cyber-cyan to-cyber-purple transition-transform duration-500 group-focus-within:scale-x-100" />
    </label>
  );
}