import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, FileText } from "lucide-react";
import emailjs from "@emailjs/browser";

// Make sure this points to your actual PDF path in the public folder
const BROCHURE_URL = "/nevas-brochure.pdf";

// EmailJS config (pulling from your .env file)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function BrochurePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });

  // 1. Auto-open after 5 seconds (unless they already unlocked it)
  useEffect(() => {
    const isUnlocked = localStorage.getItem("nevas_brochure_unlocked") === "true";
    if (isUnlocked) return; // Don't auto-open if they already have it

    const timer = setTimeout(() => setIsOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // 2. Listen for manual triggers from the floating button
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-brochure-popup", handleOpen);
    return () => window.removeEventListener("open-brochure-popup", handleOpen);
  }, []);

  // 3. Handle Form Submit, Email, Unlock & Download
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Send the email notification
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: `${form.firstName} ${form.lastName}`.trim(),
          from_email: form.email,
          phone: "Not provided (Brochure Popup)",
          message: "User requested the brochure download via the popup.",
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
    } catch (err) {
      // If email fails, we log it but still let them download the file
      console.error("[brochure] EmailJS error:", err);
    }

    // Unlock the brochure in local memory
    localStorage.setItem("nevas_brochure_unlocked", "true");
    
    // Trigger the PDF download
    const link = document.createElement("a");
    link.href = BROCHURE_URL;
    link.download = "Nevas_AI_Brochure.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset form and close
    setStatus("idle");
    setIsOpen(false);
    setForm({ firstName: "", lastName: "", email: "" }); 
  };

  // 4. Floating Button Click Logic
  const handleFloatingButtonClick = () => {
    const isUnlocked = localStorage.getItem("nevas_brochure_unlocked") === "true";
    if (isUnlocked) {
      const link = document.createElement("a");
      link.href = BROCHURE_URL;
      link.download = "Nevas_AI_Brochure.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* FLOATING CIRCULAR BUTTON (Above Chatbot) */}
      <button
        onClick={handleFloatingButtonClick}
        className="fixed bottom-24 right-6 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-cyber-cyan/40 bg-[#0a0f1c]/80 text-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-cyber-cyan/10 sm:bottom-28 sm:right-8"
        aria-label="Download Brochure"
      >
        <Download className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark blurred backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md"
            />

            {/* Centered Split-Screen Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed left-1/2 top-1/2 z-[100] flex w-[95%] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-cyber-cyan/30 bg-[#0a0f1c] shadow-[0_30px_100px_rgba(0,240,255,0.15)] md:w-full md:flex-row"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* LEFT SIDE: 3D PDF Mockup (Hidden on Mobile) */}
              <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c1221] to-[#040711] p-12 md:flex">
                <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyber-cyan/20 blur-[100px]" />
                
                {/* Fake 3D Book */}
                <div className="relative flex aspect-[1/1.4] w-full max-w-[280px] flex-col overflow-hidden rounded-r-xl rounded-l-sm border border-white/10 border-l-[6px] border-l-cyber-cyan bg-[#050914] p-6 shadow-[20px_20px_60px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                  
                  {/* Book Logo */}
                  <div className="mb-6 flex items-center gap-2">
                    <img src="/logo.png" alt="Nevas" className="h-6 w-auto" />
                  </div>
                  
                  {/* Book Title */}
                  <h4 className="font-display text-2xl font-bold leading-tight text-white">
                    The Future of <br />
                    <span className="neon-text-gradient">Textile AI</span>
                  </h4>
                  <p className="mt-2 text-xs text-gray-400">Enterprise Automation & Defect Detection</p>
                  
                  {/* Book Graphic */}
                  <div className="mt-auto flex h-32 w-full items-center justify-center rounded-lg border border-cyber-purple/30 bg-cyber-purple/5">
                     <FileText className="h-12 w-12 text-cyber-purple/50" />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: The Form */}
              <div className="flex w-full flex-col justify-center p-6 sm:p-10 md:w-1/2 lg:p-14">
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    Download the Brochure
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    Enter your details below to get instant access to our comprehensive guide on AI-driven textile manufacturing.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name *"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#050914] px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:border-cyber-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyber-cyan/50"
                    />
                    <input
                      type="text"
                      placeholder="Last Name *"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#050914] px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:border-cyber-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyber-cyan/50"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Work Email *"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#050914] px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:border-cyber-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyber-cyan/50"
                  />

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="hud-book-btn hud-book-btn--purple group mt-4 w-full justify-center py-4 text-base disabled:opacity-50"
                  >
                    <span className="mr-2">
                      {status === "loading" ? "Preparing Download..." : "Get My Free Brochure"}
                    </span>
                    <Download className="h-5 w-5 text-cyber-purple transition-transform duration-200 group-hover:-translate-y-1" />
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-gray-500">
                  We respect your privacy. No spam, ever.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}