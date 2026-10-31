import { useLayoutEffect, type RefObject } from "react";

const COLS = 34;
const ROWS = 16;
const STEPS = 28;
const SAG = 64;

const RINGS = [
  { r: 0.16, dir: 1, speed: 24, rgb: "0,240,255", a: 0.6 },
  { r: 0.24, dir: -1, speed: 32, rgb: "168,85,247", a: 0.5 },
  { r: 0.33, dir: 1, speed: 40, rgb: "0,240,255", a: 0.32 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const inOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
const out = (x: number) => 1 - (1 - x) ** 4;

export function useContactAnimation(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    
    const canvas = el.querySelector<HTMLCanvasElement>("[data-fabric]");
    const anchor = el.querySelector<HTMLElement>("[data-well]");
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !anchor || !ctx) return;

    const state = { weave: 0, depth: 0, rings: 0, px: 0, t: 0 };
    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0;
    let raf = 0;
    let lastTime = 0;
    let revealStart = -1;
    let armed = true;

    // 1. Measure & Setup
    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      const newW = Math.round(rect.width);
      const newH = Math.round(rect.height);
      
      if (w !== newW || h !== newH) {
        w = newW;
        h = newH;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
      }

      const a = anchor.getBoundingClientRect();
      cx = a.left - rect.left;
      cy = a.top - rect.top;
    };

    // 2. Draw Logic
    const trace = (horizontal: boolean, i: number, count: number, frac: number) => {
      const sig2 = 2 * Math.max(200, Math.min(w, 1200) * 0.17) ** 2;
      const wx = cx + state.px;
      const n = Math.floor(STEPS * frac);
      if (n < 1) return;

      // FIX: Use the smaller dimension (width on mobile) to calculate spacing
      // This ensures the grid always forms perfect squares.
      const gridSize = Math.min(w, h);
      const spacing = gridSize / ROWS;

      for (let k = 0; k <= n; k++) {
        const u = k / STEPS;
        
        // If horizontal, it spans the full width, but steps down proportionally.
        // If vertical, it spans the full height, but steps across proportionally.
        const x = horizontal ? u * w : i * spacing;
        const y = horizontal ? i * spacing : u * h;

        const dx = x - wx;
        const dy = y - cy;
        const g = Math.exp(-(dx * dx + dy * dy) / sig2) * state.depth;
        const px = x - dx * g * 0.38;
        const py = y - dy * g * 0.38 + g * SAG + Math.sin(x * 0.014 + y * 0.008 + state.t * 1.1) * 1.8;
        
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.setLineDash([]);

      // FIX: Reduce brightness on mobile (width < 768px)
      const isMobile = w < 768;
      const weftAlpha = isMobile ? 0.08 : 0.22;  // Original was 0.22
      const warpAlpha = isMobile ? 0.06 : 0.18;  // Original was 0.18

      const gridSize = Math.min(w, h);
      const spacing = gridSize / ROWS;

      // Weft (horizontal)
      ctx.beginPath();
      for (let i = 0; i <= ROWS; i++) {
        trace(true, i, ROWS, clamp01(state.weave * 1.5 - (i / ROWS) * 0.5));
      }
      ctx.strokeStyle = `rgba(168,85,247,${weftAlpha})`;
      ctx.stroke();

      // Warp (vertical)
      ctx.beginPath();
      // Calculate how many vertical lines fit across the screen based on the spacing
      const actualCols = Math.max(COLS, Math.floor(w / spacing));
      for (let j = 0; j <= actualCols; j++) {
        trace(false, j, actualCols, clamp01(state.weave * 1.5 - (j / actualCols) * 0.5));
      }
      ctx.strokeStyle = `rgba(0,240,255,${warpAlpha})`;
      ctx.stroke();

      // Rings & Needles
      const base = Math.min(w, 640);
      const wx = cx + state.px;
      
      RINGS.forEach((g, i) => {
        const k = clamp01(state.rings * 1.4 - i * 0.25);
        if (!k) return;
        
        const rx = base * g.r * (1.6 - 0.6 * k);
        const ry = rx * 0.3;

        ctx.save();
        ctx.translate(wx, cy);
        ctx.rotate(-0.1);
        ctx.globalAlpha = k * g.a;
        ctx.strokeStyle = `rgb(${g.rgb})`;
        ctx.setLineDash([9, 9]);
        ctx.lineDashOffset = -g.dir * state.t * g.speed;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Needle
        const angle = state.t * g.dir * (0.9 - i * 0.22) + i * 2.1;
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
        for (let n = 0; n < 4; n++) {
          const s0 = angle - g.dir * (n + 1) * 0.22;
          const s1 = angle - g.dir * n * 0.22;
          ctx.globalAlpha = k * (0.55 - n * 0.13);
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, Math.min(s0, s1), Math.max(s0, s1));
          ctx.stroke();
        }

        const nx = Math.cos(angle) * rx;
        const ny = Math.sin(angle) * ry;
        
        ctx.globalAlpha = k;
        ctx.fillStyle = `rgba(${g.rgb}, 0.9)`;
        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    // 3. Animation Loop
    const frame = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      state.t += dt;

      if (revealStart >= 0) {
        const e = (now - revealStart) / 1000;
        state.weave = inOut(clamp01(e / 1.8));
        state.depth = inOut(clamp01((e - 0.5) / 2.2));
        state.rings = out(clamp01((e - 0.9) / 2));
      }

      draw();
      raf = requestAnimationFrame(frame);
    };

    // 4. Event Listeners
    const start = () => {
      if (!raf) {
        lastTime = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      state.px = (e.clientX - r.left - r.width / 2) * 0.05;
    };

    measure();

    // Handle Resize
    const ro = new ResizeObserver(() => {
      measure();
      if (!raf) draw();
    });
    ro.observe(el);

    el.addEventListener("pointermove", onMove, { passive: true });

    // 5. Handle Reduced Motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Object.assign(state, { weave: 1, depth: 0.85, rings: 1 });
      draw();
      return () => {
        ro.disconnect();
        el.removeEventListener("pointermove", onMove);
      };
    }

    // 6. Intersection Observers
    const onScreen = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
        armed = true;
        revealStart = -1;
        state.weave = state.depth = state.rings = 0;
        delete el.dataset.in;
      }
    });
    
    const reveal = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && armed) {
        armed = false;
        revealStart = performance.now();
        el.dataset.in = "1";
      }
    }, { rootMargin: "0px 0px -25% 0px" });

    onScreen.observe(el);
    reveal.observe(el);

    // 7. Cleanup
    return () => {
      onScreen.disconnect();
      reveal.disconnect();
      ro.disconnect();
      stop();
      el.removeEventListener("pointermove", onMove);
      delete el.dataset.js;
      delete el.dataset.in;
    };
  }, [root]);
}