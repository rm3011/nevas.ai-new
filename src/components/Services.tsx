import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Compass,
  Cpu,
  MessagesSquare,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Service = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  textile: string;
  points: string[];
};

const SERVICES: Service[] = [
  {
    id: "consulting",
    title: "AI Consulting",
    icon: Compass,
    description: "Not every idea is ready for full-scale AI implementation. Our consulting and PoC services help you explore, validate, and de-risk your AI initiatives before making major investments.",
    textile: "Find where your mill loses margin first, before you spend on any technology.",
    points: ["AI Readiness Audits", "Discovery Workshops", "Scalable AI Roadmaps", "ROI Analysis", "Rapid PoC Development", "Executive Dashboards"],
  },
  {
    id: "custom-ml",
    title: "Custom AI & ML",
    icon: Cpu,
    description: "We build AI and machine learning solutions from the ground up. We develop solutions tailored to your data, your use case, and your industry, managing the full lifecycle of model development.",
    textile: "Defect, demand and yield models trained on your own looms, orders and fabric data.",
    points: ["Predictive Analytics", "Recommendation Systems", "Dynamic Pricing", "Forecasting Tools", "Fraud Detection", "Image Classification"],
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    icon: Sparkles,
    description: "We build GenAI-powered systems that think, write, talk, and create using the world's most advanced language models. From chatbots to content creators, our tools are fine-tuned to deliver value fast.",
    textile: "Design copilots that turn mood boards into specs, tech packs and buyer-ready copy.",
    points: ["LLM Integration", "Custom Fine-Tuning", "Generative Copilots", "RAG Knowledge Retrieval", "Enterprise Security", "Real-Time Context"],
  },
  {
    id: "conversational-ai",
    title: "Conversational AI",
    icon: MessagesSquare,
    description: "Get smart assistants for sales, support, onboarding, and internal operations. We design multilingual chatbots, voice bots, and AI agents for customer service and engagement.",
    textile: "Buyer and supplier assistants that answer order, stock and sample queries in any language.",
    points: ["Custom Chatbots", "RAG-Based Bots", "Omnichannel Availability", "CRM & ERP Integration", "Multilingual Voice & Text", "Data-Interactive Chatbots"],
  },
  {
    id: "ai-app",
    title: "AI App Dev",
    icon: Smartphone,
    description: "We integrate smart features into your web and mobile apps, so they work better and faster. Your apps will anticipate user needs, deliver lightning-fast responses, and keep people engaged.",
    textile: "Virtual try-on, order tracking and smart catalogs inside your own app.",
    points: ["Voice & Vision Features", "Custom AI API Integration", "Real-Time Intelligence", "Cross-Platform", "AI Personalization", "Mobile Optimization"],
  },
  {
    id: "llm-tuning",
    title: "LLM Fine-Tuning",
    icon: SlidersHorizontal,
    description: "We help businesses train, fine-tune, and host LLMs like GPT, Claude, or LLaMA to their specific industry. We ensure more relevant, secure, and high-performing AI experiences.",
    textile: "A private model that knows your fabrics, specs and SOPs, and keeps them in-house.",
    points: ["Private LLM Tuning", "RAG Implementation", "Web Scraping Context", "Custom Guardrails", "Secure Hosting", "Latency Optimization"],
  },
  {
    id: "aiops",
    title: "AIOps Services",
    icon: Activity,
    description: "Bring intelligence to your IT and DevOps operations. We use machine learning to detect anomalies, prevent outages, and accelerate root cause analysis across your pipelines.",
    textile: "Keep ERP and factory systems running, with outages caught before the floor feels them.",
    points: ["Log & Metrics Analysis", "Infra Optimization", "Predictive Alerting", "Cloud & Hybrid Support", "Automated Remediation"],
  },
];

const SERVICE_IMAGES: Record<string, string> = {
  consulting: "https://api.pulauintanlestari.com/files/post/2025/05/how-ai-is-revolutionizing-the-textile-industry-image-03-1746686398847.webp",
  "custom-ml": "https://consulting.groyyo.com/wp-content/uploads/2024/09/Picture1-scaled.jpg",
  "generative-ai": "https://easyodm.tech/wp-content/uploads/2023/06/ai-in-textile-industry-1024x573.webp",
  "conversational-ai": "https://static.vecteezy.com/system/resources/previews/024/570/142/large_2x/3d-rendering-robot-working-in-the-laboratory-artificial-intelligence-and-machine-learning-concept-an-ai-robot-scientist-doing-experiments-in-the-laboratory-ai-generated-free-photo.jpg",
  "ai-app": "https://labeloom.com/cdn/shop/articles/AI_and_Fashion_1200x1200.webp?v=1726742207",
  "llm-tuning": "https://t4.ftcdn.net/jpg/08/50/54/51/360_F_850545169_1OQNmlhKs8NnZn4rBjTMbozaedqAXWS8.jpg",
  aiops: "https://eonsr.com/wp-content/uploads/2026/02/are-ai-fashion-design-tools-revolutionizing-the-apparel-industry-featured-image.png",
};

export default function ServicesCarousel() {
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  const [direction, setDirection] = useState(0);

  const activeIndex = SERVICES.findIndex((s) => s.id === activeId);
  const active = SERVICES[activeIndex];
  const ActiveIcon = active.icon;

  const handleSelect = (id: string, index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveId(id);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <section id="services" className="relative isolate w-full overflow-hidden bg-cyber-bg py-20 px-4 sm:px-6 lg:px-14">
      
      {/* Background Glows */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-105 w-105 rounded-full bg-cyber-cyan/15 blur-[180px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-115 w-115 -translate-y-1/2 rounded-full bg-cyber-pink/10 blur-[200px]" />

      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center space-x-2 rounded-full border border-cyber-cyan/30 glass-panel px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyber-cyan"
          >
            <span>[ what we do ]</span>
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-5xl"
          >
            AI Development Services <br className="hidden sm:block" />
            <span className="neon-text-gradient">We Offer</span>
          </motion.h2>
        </div>

        {/* Navigation Dock - Reduced margin bottom (mb-4) */}
        <div className="mb-4 flex w-full snap-x gap-2 overflow-x-auto pb-4 scrollbar-none lg:justify-center">
          {SERVICES.map((service, index) => {
            const isActive = service.id === activeId;
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => handleSelect(service.id, index)}
                className={`relative flex shrink-0 snap-start items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-cyber-cyan/40 bg-linear-to-r from-cyber-cyan/20 via-cyber-purple/25 to-cyber-pink/20"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className={`h-4 w-4 ${isActive ? "text-cyber-cyan" : "text-gray-500"}`} />
                <span>{service.title}</span>
              </button>
            );
          })}
        </div>

        {/* Carousel Container - Reduced min-height from 550 to 480 */}
        <div className="relative min-h-120 w-full overflow-hidden rounded-3xl border border-cyber-cyan/20 bg-cyber-card shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={active.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid h-full w-full grid-cols-1 lg:grid-cols-2"
            >
              
              {/* Left Side: Image */}
              <div className="relative h-64 w-full lg:h-full overflow-hidden">
                <img
                  src={SERVICE_IMAGES[active.id]}
                  alt={active.title}
                  className="absolute inset-0 h-full w-full object-cover saturate-[0.8]"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyber-cyan/20 to-cyber-pink/20 mix-blend-soft-light" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-cyber-card via-cyber-card/20 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-cyber-card/20 lg:to-cyber-card" />
                
                <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-xl border border-cyber-cyan/40 bg-cyber-bg/60 backdrop-blur-md">
                  <ActiveIcon className="h-6 w-6 text-cyber-cyan" />
                </div>
              </div>

              {/* Right Side: Content - Reduced bottom padding and margins */}
              <div className="relative flex flex-col justify-center px-6 pt-6 pb-5 sm:px-10 sm:pt-10 sm:pb-7 lg:px-12 lg:pt-12 lg:pb-8">
                <h3 className="mb-3 font-display text-2xl font-bold text-white sm:text-3xl">
                  {active.title}
                </h3>
                
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  {active.description}
                </p>

                {/* Textile Callout - Reduced margin & padding */}
                <div className="relative mb-5 rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/5 py-2.5 pl-5 pr-4">
                  <span className="absolute bottom-2.5 left-0 top-2.5 w-0.75 rounded-full bg-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.7)]" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyber-cyan/80">Textile Impact</p>
                  <p className="mt-1 font-display text-sm font-semibold text-white">{active.textile}</p>
                </div>

                {/* Points Grid - Reduced margin */}
                <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {active.points.map((point, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyber-cyan/20 text-[10px] text-cyber-cyan">✓</span>
                      <span className="text-xs text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>

                {/* CTA - Reduced top padding */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  <a href="#contact" className="hud-book-btn hud-book-btn--purple group w-fit gap-2">
                    <span>Discuss this with our team</span>
                    <ArrowRight className="h-4 w-4 text-cyber-purple transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>
    </section>
  );
}