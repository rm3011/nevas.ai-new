import { ArrowRight, Sliders } from "lucide-react";

const BANNER_IMAGE =
  "https://img.freepik.com/premium-photo/vibrant-textile-mill-with-rows-looms-weaving-fabrics_980928-27124.jpg?w=2000";

export default function Hero() {
  return (
    <section className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Banner image background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={BANNER_IMAGE}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cyber-bg/50" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
          Powering The Future Of <br className="hidden sm:inline" />
          <span className="neon-text-gradient">Fashion With AI</span> &amp;{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyber-purple via-cyber-pink to-cyber-cyan">
            Intelligent Automation.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 font-normal leading-relaxed">
          We help fashion brands, retailers, and D2C companies increase conversions,
          reduce operational costs, and scale faster using AI-driven personalization,
          virtual try-ons, demand forecasting, and workflow automation.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5">
          <a
            href="#contact"
            className="w-full sm:w-auto hud-book-btn hud-book-btn--purple text-base py-3.5 px-8 group"
          >
            <span className="mr-2">Talk to Our AI Fashion Experts</span>
            <ArrowRight className="w-4 h-4 text-cyber-purple group-hover:translate-x-1.5 transition-transform duration-200" />
          </a>

          <a
            href="#services"
            className="w-full sm:w-auto hud-sec-btn font-semibold px-8 py-3.5 text-base tracking-wide flex items-center justify-center space-x-2"
          >
            <Sliders className="w-4 h-4 text-cyber-cyan" />
            <span>Explore Solutions</span>
          </a>
        </div>
      </div>
    </section>
  );
}