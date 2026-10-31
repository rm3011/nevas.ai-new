import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-cyber-bg px-4 py-20 text-white">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.15),transparent_50%)]" />
      
      {/* Cyber Grid/Scanline Effect */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {/* Main Terminal Card */}
      <div className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#050014]/80 p-8 text-center backdrop-blur-md sm:p-12">
        
        {/* Neon Top Border */}
        <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-cyber-cyan via-cyber-purple to-transparent" />

        {/* Terminal Header */}
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
            SYS.ERR // ROUTE_NOT_FOUND
          </p>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Glitchy 404 Text */}
        <h1 className="group relative font-display text-6xl font-extrabold tracking-tighter sm:text-8xl">
          <span className="neon-text-gradient">404</span>
          <span className="absolute inset-0 -z-10 block translate-x-1 translate-y-1 text-cyber-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-50">
            404
          </span>
          <span className="absolute inset-0 -z-10 block -translate-x-1 -translate-y-1 text-cyber-purple opacity-0 transition-opacity duration-300 group-hover:opacity-50">
            404
          </span>
        </h1>

        <h2 className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">
          Thread severed.
        </h2>
        
        <p className="mt-4 text-base text-gray-400">
          The page you are looking for has been unwoven, moved, or never existed in this sector of the network.
        </p>

        {/* Diagnostic Log */}
        <div className="mt-8 flex flex-col items-center justify-center gap-1 font-mono text-xs text-gray-500">
          <p><span className="text-cyber-cyan"></span> Analyzing requested coordinates...</p>
          <p><span className="text-cyber-pink"></span> Error: Target sequence not found.</p>
        </div>

        {/* Action Button */}
        <div className="mt-10 flex justify-center">
          <Link 
            to="/" 
            className="hud-book-btn hud-book-btn--purple group inline-flex items-center gap-3 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-cyan"
          >
            <span>Return to Base</span>
            {/* Arrow icon matches the one in your contact form */}
            <svg 
              className="h-4 w-4 text-cyber-purple transition-transform duration-300 group-hover:translate-x-1.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}