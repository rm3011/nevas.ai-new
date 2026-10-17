import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Service = {
	id: string;
	title: string;
	description: string;
	points: string[];
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const SERVICES: Service[] = [
	{
		id: "consulting",
		title: "AI Consulting Services",
		description:
			"Not every idea is ready for full-scale AI implementation, and that's okay. Our AI consulting and PoC services help you explore, validate, and de-risk your AI initiatives before making major investments.",
		points: [
			"AI Readiness Audits",
			"Discovery & Ideation Workshops",
			"Scalable AI Roadmaps",
			"Cost-Benefit & ROI Analysis",
			"Rapid PoC Development",
			"Executive Dashboards & Reporting",
		],
	},
	{
		id: "custom-ml",
		title: "Custom AI & ML Development",
		description:
			"We build AI and machine learning solutions from the ground up. The purpose of our AI app development company is to develop solutions tailored to your data, your use case, and your industry. We manage the full lifecycle of AI model development.",
		points: [
			"Predictive Analytics",
			"Recommendation Systems",
			"Dynamic Pricing Models",
			"Forecasting Tools",
			"Fraud Detection",
			"Image and Text Classification",
		],
	},
	{
		id: "generative-ai",
		title: "Generative AI Development",
		description:
			"As a leading name in the top generative AI development company list, we build GenAI-powered systems that think, write, talk, and create using the world's most advanced language models. From chatbots to content creators, our tools are fine-tuned to deliver value fast.",
		points: [
			"LLM Integration",
			"Custom Fine-Tuning",
			"Generative AI Copilots",
			"Knowledge Embedding & Retrieval (RAG)",
			"Enterprise-grade Security",
			"Real-Time, Context-Aware Responses",
		],
	},
	{
		id: "conversational-ai",
		title: "Conversational AI",
		description:
			"Get smart assistants for sales, support, onboarding, and internal operations. Our AI chatbot development company designs multilingual chatbots, voice bots, and AI agents for customer service and engagement.",
		points: [
			"Custom Chatbots & Voicebots",
			"RAG-Based Bots",
			"Data-Interactive Chatbots",
			"Omnichannel Availability",
			"CRM & ERP Integration",
			"Multilingual Voice & Text Bots",
		],
	},
	{
		id: "ai-app",
		title: "AI App Development",
		description:
			"Known for the #1 AI app development company in India, we integrate smart features into your web and mobile apps, so they work better and faster. Your apps will anticipate user needs, deliver lightning-fast responses, and keep people engaged.",
		points: [
			"Voice, Vision & NLP Features",
			"Custom AI API Integration",
			"Real-Time Intelligence & Prediction",
			"Cross-Platform Compatibility",
			"AI-Driven Personalization",
			"Mobile & Edge Optimization",
		],
	},
	{
		id: "llm-tuning",
		title: "LLM Fine-Tuning & Customization",
		description:
			"As an enterprise AI software development company, we help businesses train, fine-tune, and host LLMs like GPT, Claude, or LLaMA to their specific industry, data, and use cases. Plus, we ensure more relevant, secure, and high-performing AI experiences.",
		points: [
			"Private LLM Fine-Tuning",
			"Retrieval-Augmented Generation",
			"Generative AI Tasks",
			"Web Scraping for Real-Time Context",
			"Custom Guardrails & Filters",
			"Secure Hosting & Latency Optimization",
		],
	},
	{
		id: "image-ai",
		title: "Image-Based AI Solutions",
		description:
			"We develop AI tools that understand, generate, and transform images with precision. From visual content creation to intelligent editing, custom solutions by our AI development company support a wide range of business needs.",
		points: [
			"Image-to-Text Summarizers",
			"Text-to-Image Generation",
			"AI Face Swapping",
			"AI Image Upscaling",
			"AI Outpainting & Background Fill",
			"AI-Powered Image Editing",
		],
	},
	{
		id: "ai-product",
		title: "AI Product Development",
		description:
			"AI is the foundation of modern software products. Being the best AI product development company in India, our team plan, prototype, and launch AI-first platforms that are impactful, and built for scale. From strategy to deployment, we partner with you at every step.",
		points: [
			"AI Strategy + Design + Engineering",
			"Rapid Prototyping and Usability Testing",
			"Modular Architecture",
			"Built-In Analytics",
			"Seamless Integration",
			"Multi-Cloud Support",
		],
	},
	{
		id: "aiops",
		title: "AIOps Services",
		description:
			"We help enterprises bring intelligence to their IT and DevOps operations. Our team uses machine learning to detect anomalies, prevent outages, and accelerate root cause analysis. Our AIOps solutions add intelligence across observability and incident response pipelines.",
		points: [
			"Log & Metrics Analysis",
			"AI/ML Workload & Infra Optimization",
			"Predictive Alerting",
			"Cloud & Hybrid Environment Support",
			"Automated Remediation",
		],
	},
];

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const SECTION_CLASS = [
	"relative isolate w-full overflow-hidden",
	"bg-[#040711] text-white",
	"py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-14",
].join(" ");

const GRID_OVERLAY_STYLE: CSSProperties = {
	backgroundImage:
		"linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
	backgroundSize: "60px 60px",
};

const LIST_WRAPPER_CLASS = [
	"relative flex flex-col gap-2",
	"h-full",
	"overflow-y-auto",
	"rounded-2xl",
	"border border-cyan-400/15",
	"bg-[#0B1220]/60 p-3",
	"backdrop-blur-xl",
	"shadow-[0_0_40px_-10px_rgba(34,211,238,0.15)]",
	"custom-scrollbar",
].join(" ");

const PANEL_CLASS = [
	"relative h-full",
	"overflow-hidden",
	"rounded-2xl",
	"border border-cyan-400/15",
	"bg-[#0B1220]/70",
	"p-6 sm:p-8 lg:p-10",
	"backdrop-blur-2xl",
	"shadow-[0_0_60px_-15px_rgba(236,72,153,0.15)]",
].join(" ");

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

type ServiceButtonProps = {
	service: Service;
	isActive: boolean;
	onSelect: () => void;
	buttonRef: (el: HTMLButtonElement | null) => void;
};

function ServiceButton({ service, isActive, onSelect, buttonRef }: ServiceButtonProps) {
	const baseClass = [
		"relative w-full flex-shrink-0 overflow-hidden",
		"rounded-xl px-5 py-4",
		"text-left font-cervino text-[13px] uppercase tracking-wide",
		"transition-all duration-300 cursor-pointer",
	].join(" ");

	const stateClass = isActive
		? "text-white"
		: "bg-[#0F1A2E] text-gray-300 hover:text-white hover:bg-[#132033]";

	return (
		<button
			ref={buttonRef}
			role="tab"
			aria-selected={isActive}
			onClick={onSelect}
			className={`${baseClass} ${stateClass}`}
		>
			{isActive && <ActiveButtonBackground />}

			<span className="relative z-10 flex items-center justify-between gap-3">
				<span>{service.title}</span>

				{isActive && (
					<motion.span
						initial={{ opacity: 0, x: -4 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.2 }}
						className="text-cyan-300"
						aria-hidden="true"
					>
						→
					</motion.span>
				)}
			</span>
		</button>
	);
}

function ActiveButtonBackground() {
	return (
		<>
			<motion.span
				layoutId="service-active-bg"
				transition={{ type: "spring", stiffness: 400, damping: 32 }}
				className="absolute inset-0 -z-10 rounded-xl bg-linear-to-r from-cyan-500/25 via-fuchsia-500/25 to-purple-500/25 border border-cyan-400/40"
			/>
			<motion.span
				aria-hidden="true"
				initial={{ x: "-120%" }}
				animate={{ x: "120%" }}
				transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
				className="pointer-events-none absolute inset-y-0 -z-10 w-1/3 bg-linear-to-r from-transparent via-cyan-300/20 to-transparent"
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute left-0 top-1/2 -z-10 h-6 w-0.75 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]"
			/>
		</>
	);
}

type ServicePointsProps = {
	serviceId: string;
	points: string[];
};

function ServicePoints({ serviceId, points }: ServicePointsProps) {
	return (
		<motion.ul
			role="list"
			initial="hidden"
			animate="visible"
			variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
			className="relative z-10 mt-8 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2"
		>
			{points.map((point, index) => (
				<motion.li
					key={`${serviceId}-${index}`}
					variants={{
						hidden: { opacity: 0, y: 8 },
						visible: { opacity: 1, y: 0 },
					}}
					transition={{ duration: 0.35, ease: "easeOut" }}
					className="flex items-start gap-3"
				>
					<span
						aria-hidden="true"
						className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/5 text-[11px] font-semibold text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
					>
						✓
					</span>
					<span className="font-cervino text-[13px] uppercase tracking-wide text-gray-200 sm:text-[14px]">
						{point}
					</span>
				</motion.li>
			))}
		</motion.ul>
	);
}

function PanelDecorations() {
	return (
		<>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-linear-to-br from-cyan-500/25 via-purple-500/15 to-transparent blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-linear-to-tr from-fuchsia-500/25 via-purple-500/15 to-transparent blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/40 to-transparent"
			/>
		</>
	);
}

function PanelHeader() {
	return (
		<div className="mb-4 flex items-center gap-3">
			<motion.span
				initial={{ scaleX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				style={{ transformOrigin: "left" }}
				className="block h-0.75 w-10 rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
			/>
			<span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/80">
				[ service ]
			</span>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function Services() {
	const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
	const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const initialActiveId = useRef(activeId);

	const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];

	useEffect(() => {
		if (
			activeId !== initialActiveId.current &&
			document.readyState === "complete"
		) {
			buttonRefs.current[activeId]?.scrollIntoView({
				block: "nearest",
				behavior: "smooth",
			});
		}
	}, [activeId]);

	return (
		<section
			id="services"
			aria-labelledby="services-explorer-heading"
			className={SECTION_CLASS}
		>
			{/* Neon blurred blobs */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -left-40 top-20 -z-10 h-105 w-105 rounded-full bg-cyan-500/20 blur-[180px]"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute right-0 top-1/2 -z-10 h-115 w-115 -translate-y-1/2 rounded-full bg-fuchsia-500/15 blur-[200px]"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-1/3 -bottom-32 -z-10 h-95 w-95 rounded-full bg-purple-500/20 blur-[180px]"
			/>

			{/* Faint diagonal grid */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 opacity-40"
				style={GRID_OVERLAY_STYLE}
			/>

			<div className="mx-auto max-w-7xl">
				{/* Heading */}
				<div className="mb-12 max-w-3xl">
					<motion.p
						initial={{ opacity: 0, y: 8 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.5 }}
						className="mb-4 inline-flex items-center space-x-2 rounded-full glass-panel border border-cyber-cyan/30 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyber-cyan"
					>
						<span>[ what we do ]</span>
					</motion.p>

					<motion.h2
						id="services-explorer-heading"
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
						className="font-cervino text-[32px] leading-10.5 uppercase tracking-tight text-white sm:text-[42px] sm:leading-13.5 lg:text-[52px] lg:leading-16"
					>
						AI Development Services <br className="hidden sm:block" />
						<span className="bg-linear-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
							We Offer
						</span>
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
						className="mt-5 max-w-2xl font-cervino text-sm leading-7 text-gray-400 sm:text-base"
					>
						Explore our end-to-end AI capabilities. Click any service on the left to see
						how we deliver it.
					</motion.p>
				</div>

				{/* Explorer — items-stretch makes both columns equal height */}
				<div className="grid gap-6 lg:grid-cols-[minmax(260px,340px)_1fr] lg:gap-8 lg:items-stretch">
					{/* Left: switchable list */}
					<div role="tablist" aria-orientation="vertical" className={LIST_WRAPPER_CLASS}>
						{SERVICES.map((service) => (
							<ServiceButton
								key={service.id}
								service={service}
								isActive={service.id === activeId}
								onSelect={() => setActiveId(service.id)}
								buttonRef={(el) => {
									buttonRefs.current[service.id] = el;
								}}
							/>
						))}
					</div>

					{/* Right: detail panel */}
					<div className="relative h-full">
						<AnimatePresence mode="wait">
							<motion.article
								key={active.id}
								initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
								exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
								transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
								className={PANEL_CLASS}
							>
								<PanelDecorations />

								<div className="relative z-10">
									<PanelHeader />

									<h3 className="font-cervino text-2xl leading-tight uppercase text-white sm:text-3xl lg:text-4xl">
										{active.title}
									</h3>

									<p className="mt-5 max-w-3xl font-cervino text-sm leading-7 text-gray-400 sm:text-base">
										{active.description}
									</p>
								</div>

								<ServicePoints serviceId={active.id} points={active.points} />
							</motion.article>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</section>
	);
}	