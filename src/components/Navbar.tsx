import { useState } from "react";
import { ArrowRight, Menu, X, Download } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
};

// The URL to your PDF (put the PDF in the public folder)
const BROCHURE_URL = "/nevas-brochure.pdf";

const LINKS: NavLink[] = [
  { href: "/#about", label: "WHO WE ARE" },
  { href: "/#services", label: "WHAT WE DO" },
  { href: "/#shorts", label: "VIDEOS" },
  { href: "/#blogs", label: "BLOGS" },
];

function BookNowButton({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href="/#contact"
      onClick={onClick}
      className={`hud-book-btn hud-book-btn--purple group ${className}`}
    >
      <span className="mr-2">Talk To Us Now</span>
      <ArrowRight className="w-4 h-4 text-cyber-purple group-hover:translate-x-1.5 transition-transform duration-200" />
    </a>
  );
}

function DownloadButton({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Stop standard link navigation
    
    // Check if the user has unlocked the brochure via the form
    const isUnlocked = localStorage.getItem("nevas_brochure_unlocked") === "true";

    if (isUnlocked) {
      // Trigger PDF download
      const link = document.createElement("a");
      link.href = BROCHURE_URL;
      link.download = "Nevas_AI_Textile_Brochure.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Trigger the popup event
      window.dispatchEvent(new Event("open-brochure-popup"));
    }

    if (onClick) onClick();
  };

  return (
    <a
      href="#contact"
      onClick={handleClick}
      // Styled to match the HUD layout of the BookNow button, but with cyan accents
      className={`hud-book-btn group border-cyber-cyan/40 bg-cyber-cyan/5 hover:bg-cyber-cyan/10 ${className}`}
      style={{
         // Custom overrides to match the "Book Now" button frame
         boxShadow: "0 0 20px rgba(0, 240, 255, 0.1), inset 0 0 10px rgba(0, 240, 255, 0.05)"
      }}
    >
      <Download className="w-4 h-4 text-cyber-cyan mr-2 transition-transform group-hover:-translate-y-0.5" />
      <span className="text-cyber-cyan font-semibold">Brochure</span>
    </a>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav backdrop-blur-2xl bg-cyber-bg/70 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,240,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center group" aria-label="Nevas AI home">
            <img
              src="/logo.png"
              alt="Nevas AI"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </a>

          <nav className="hidden md:flex items-center space-x-10">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-base font-semibold text-gray-300 hover:text-cyber-cyan transition-colors tracking-wide py-1 relative group"
              >
                {l.label}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-cyber-cyan transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <DownloadButton />
            <BookNowButton />
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              className="text-gray-300 hover:text-cyber-cyan focus:outline-none p-2"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-panel border-t border-cyber-cyan/20 px-6 pt-4 pb-6 space-y-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-gray-300 hover:text-cyber-cyan text-base font-semibold tracking-wider"
            >
              {l.label}
            </a>
          ))}
          
          <div className="pt-2 flex flex-col gap-3">
            <DownloadButton
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 justify-center"
            />
            <BookNowButton
              onClick={() => setMobileOpen(false)}
              className="w-full py-3"
            />
          </div>
        </div>
      )}
    </header>
  );
}