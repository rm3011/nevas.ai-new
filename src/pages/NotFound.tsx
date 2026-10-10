import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-20">
      <div className="glass-panel max-w-xl rounded-2xl p-10 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-cyber-cyan">
          404 — Page not found
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold text-white">
          This page doesn&apos;t exist.
        </h1>
        <Link to="/" className="hud-book-btn mt-8 inline-flex">
          Return home
        </Link>
      </div>
    </main>
  );
}
