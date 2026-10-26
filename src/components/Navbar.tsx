import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
};

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

          {/* Only Book Now button on desktop */}
          <div className="hidden sm:flex items-center">
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
          
          {/* Only Book Now button on mobile */}
          <div className="pt-2">
            <BookNowButton
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 justify-center"
            />
          </div>
        </div>
      )}
    </header>
  );
}