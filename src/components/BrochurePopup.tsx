import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText, ArrowRight } from "lucide-react";

export default function BrochurePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Show automatically after 4 seconds on every visit
    const timer = setTimeout(() => setIsOpen(true), 4000);

    // 2. Listen for manual triggers from the Navbar
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-brochure-popup", handleOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("open-brochure-popup", handleOpen);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-90 bg-black/60 backdrop-blur-sm"
          />

          {/* Centered Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-100 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-cyber-cyan/30 bg-[#0a0f1c]/95 p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,240,255,0.15)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyber-cyan/20 blur-2xl" />

            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan mb-5">
              <FileText className="h-7 w-7" />
            </div>

            <h3 className="font-display text-2xl font-bold text-white">
              Unlock the Full Brochure
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              Fill out the quick form below to instantly download our comprehensive PDF detailing how Nevas.ai transforms textile manufacturing.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href="#contact" 
                onClick={() => setIsOpen(false)}
                className="w-full hud-book-btn hud-book-btn--purple group justify-center"
              >
                <span className="mr-2">Submit Details to Unlock</span>
                <ArrowRight className="w-4 h-4 text-cyber-purple group-hover:translate-x-1.5 transition-transform duration-200" />
              </a>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-xl py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                No thanks, I'll keep exploring
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}