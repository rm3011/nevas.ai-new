export default function LogoLoop() {
  const logos = ["OpenAI", "Anthropic", "Azure", "AWS", "Google", "Meta", "NVIDIA", "MongoDB"];

  return (
    <section className="relative overflow-hidden border-y border-cyan-500/20 bg-slate-950/80 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_55%)]" />
      <div className="flex animate-[scroll_24s_linear_infinite] items-center gap-8 whitespace-nowrap px-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300/80">
        {[...logos, ...logos].map((logo, index) => (
          <span key={`${logo}-${index}`} className="inline-flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
}
