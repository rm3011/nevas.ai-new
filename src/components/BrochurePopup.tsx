import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, FileText } from "lucide-react";

export default function BrochurePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user already dismissed it in this session
    const hasSeen = sessionStorage.getItem("nevas_popup_seen");
    
    if (!hasSeen) {
      // Show popup after 5 seconds of scrolling
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("nevas_popup_seen", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[100] w-full max-w-sm overflow-hidden rounded-2xl border border-cyber-purple/30 bg-[#0a0f1c]/95 p-6 shadow-[0_20px_60px_rgba(168,85,247,0.2)] backdrop-blur-xl"
        >
          {/* Subtle glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyber-purple/20 blur-[40px]" />

          <button 
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close popup"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan mb-4">
            <FileText className="h-6 w-6" />
          </div>

          <h3 className="font-display text-xl font-bold text-white">
            Want the full details?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            Download our comprehensive PDF brochure to see exactly how Nevas.ai transforms textile manufacturing.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="#contact" // Scrolls to the contact form
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyber-purple px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyber-purple/80"
            >
              <Download className="h-4 w-4" />
              Submit details to download
            </a>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              No thanks, just exploring
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}