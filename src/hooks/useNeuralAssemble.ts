import { useEffect, type RefObject } from "react";
import gsap from "gsap";

/**
 * Neural assembly engine (time-based, plays once - NOT scroll-scrubbed)
 * ----------------------------------------------------------------------------
 *  Layer 1  "Hardware"   The robot image is cut into COLS x ROWS panels. Each panel
 *                        flies in rotated + oversized, snaps into place with a small
 *                        overshoot, and flashes a neon seam when it lands.
 *  Layer 2  "Network"    ~160 nodes are sampled from the robot's glowing contours.
 *                        They fly in on curved paths and link to their nearest
 *                        neighbours, so the net gathers into the robot's outline.
 *  Layer 3  "Alive"      After assembly, a few data pulses travel along the network
 *                        (30fps, paused when off-screen).
 *
 *  A single canvas, no DOM nodes per piece, no blur filters.
 */

export const NN_TOTAL = 3.8; // seconds for the full intro
export type NNProgress = { t: number }; // seconds into the intro

const COLS = 7;
const ROWS = 6;
const BRIGHT_THRESHOLD = 95; // neon pixels only (0-255)

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (x: number) => {
  const c1 = 1.3;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Node = {
  tx: number; ty: number; sx: number; sy: number; px: number; py: number;
  t0: number; dur: number; col: string; r: number;
  x: number; y: number; e: number;
};
type Tile = {
  sx: number; sy: number; sw: number; sh: number;
  dx: number; dy: number; dw: number; dh: number;
  ox: number; oy: number; rot: number; sc: number;
  t0: number; dur: number; violet: boolean;
};
type Pulse = { edge: number; p: number; speed: number };

/** Image + soft elliptical feather, so its rectangular edges dissolve into the page. */
function makeSource(img: HTMLImageElement) {
  const k = Math.min(1, 1100 / img.naturalWidth);
  const w = Math.round(img.naturalWidth * k);
  const h = Math.round(img.naturalHeight * k);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d")!;
  x.drawImage(img, 0, 0, w, h);
  x.globalCompositeOperation = "destination-in";
  x.translate(w / 2, h / 2);
  x.scale(1, h / w);
  const g = x.createRadialGradient(0, 0, 0, 0, 0, w / 2);
  g.addColorStop(0, "#000");
  g.addColorStop(0.72, "#000");
  g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g;
  x.fillRect(-w / 2, -w / 2, w, w);
  return c;
}

/** Weighted pick of bright (neon) pixels -> node positions in 0..1 image space. */
function sampleNodes(src: HTMLCanvasElement, count: number) {
  const w = 220;
  const h = Math.round((220 * src.height) / src.width);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.drawImage(src, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data;

  const cum = new Float32Array(w * h);
  let sum = 0;
  for (let i = 0; i < w * h; i++) {
    const m = Math.max(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]) * (d[i * 4 + 3] / 255);
    if (m > BRIGHT_THRESHOLD) sum += Math.pow((m - BRIGHT_THRESHOLD) / (255 - BRIGHT_THRESHOLD), 1.6);
    cum[i] = sum;
  }

  const rand = mulberry32(11);
  const out: { u: number; v: number; col: string }[] = [];
  for (let n = 0; n < count && sum > 0; n++) {
    const r = rand() * sum;
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const R = d[lo * 4], G = d[lo * 4 + 1], B = d[lo * 4 + 2];
    const k = (255 / Math.max(R, G, B, 1)) * 0.9;
    const mix = (v: number) => Math.min(255, Math.round(v * k * 0.78 + 255 * 0.22));
    out.push({
      u: ((lo % w) + rand()) / w,
      v: (((lo / w) | 0) + rand()) / h,
      col: `${mix(R)},${mix(G)},${mix(B)}`,
    });
  }
  return out;
}

export function useNeuralAssemble(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  progress: NNProgress,
  imageSrc: string
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let visible = false;
    let src: HTMLCanvasElement | null = null;
    let samples: ReturnType<typeof sampleNodes> = [];
    let nodes: Node[] = [];
    let tiles: Tile[] = [];
    let edges: [number, number][] = [];
    let pulses: Pulse[] = [];
    let W = 0, H = 0, dpr = 1;
    let lastT = -1;
    let lastDraw = 0;

    const small = () => window.innerWidth < 768;
    const nodeCount = () => {
      const weak = (navigator.hardwareConcurrency || 8) <= 4;
      return small() ? 90 : weak ? 120 : 160;
    };

    function build() {
      if (!src || !W) return;
      // object-cover, anchored a bit towards the top so the head is never cropped
      const s = Math.max(W / src.width, H / src.height);
      const rw = src.width * s;
      const rh = src.height * s;
      const rx = (W - rw) / 2;
      const ry = (H - rh) * 0.3;
      const rand = mulberry32(5);

      // ---- hardware panels
      tiles = [];
      const tw = rw / COLS, th = rh / ROWS;
      const sw = src.width / COLS, sh = src.height / ROWS;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const ccx = (c + 0.5) / COLS - 0.5;
          const ccy = (r + 0.5) / ROWS - 0.5;
          const ang = Math.atan2(ccy, ccx) + (rand() - 0.5) * 1.2;
          const dist = (0.25 + rand() * 0.4) * Math.min(W, H);
          tiles.push({
            sx: c * sw, sy: r * sh, sw, sh,
            dx: rx + c * tw, dy: ry + r * th, dw: tw, dh: th,
            ox: Math.cos(ang) * dist, oy: Math.sin(ang) * dist,
            rot: (rand() - 0.5) * 1.1,
            sc: 0.15 + rand() * 0.3,
            t0: 0.8 + clamp(Math.hypot(ccx, ccy) / 0.7) * 0.9 + rand() * 0.35,
            dur: 0.7 + rand() * 0.15,
            violet: (r + c) % 2 === 0,
          });
        }
      }

      // ---- network nodes
      const R0 = Math.hypot(W, H) * 0.5;
      nodes = samples.slice(0, nodeCount()).map((p) => {
        const tx = rx + p.u * rw;
        const ty = ry + p.v * rh;
        const ang = rand() * Math.PI * 2;
        const rad = R0 * (0.55 + rand() * 0.45);
        const sx = W / 2 + Math.cos(ang) * rad;
        const sy = H / 2 + Math.sin(ang) * rad;
        const dx = tx - sx, dy = ty - sy;
        const L = Math.hypot(dx, dy) || 1;
        const amp = (rand() - 0.5) * 0.35 * L;
        return {
          tx, ty, sx, sy,
          px: (-dy / L) * amp, py: (dx / L) * amp,
          t0: rand() * 0.6, dur: 1.1 + rand() * 0.7,
          col: p.col, r: 0.8 + rand() * 0.9,
          x: sx, y: sy, e: 0,
        };
      });

      // ---- edges: 3 nearest neighbours each
      const maxD = rw * 0.14;
      const seen = new Set<number>();
      edges = [];
      nodes.forEach((a, i) => {
        nodes
          .map((b, j) => ({ j, d: j === i ? Infinity : Math.hypot(a.tx - b.tx, a.ty - b.ty) }))
          .sort((p, q) => p.d - q.d)
          .slice(0, 3)
          .forEach(({ j, d }) => {
            if (d > maxD) return;
            const key = Math.min(i, j) * 1000 + Math.max(i, j);
            if (seen.has(key)) return;
            seen.add(key);
            edges.push([i, j]);
          });
      });

      pulses = edges.length
        ? Array.from({ length: Math.min(14, edges.length) }, () => ({
            edge: (rand() * edges.length) | 0,
            p: rand(),
            speed: 0.5 + rand() * 0.6,
          }))
        : [];
      lastT = -1;
    }

    function resize() {
      const r = parent.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, small() ? 1.5 : 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      build();
    }

    function draw(t: number, dt: number) {
      if (!src) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // 1. hardware panels
      ctx.globalCompositeOperation = "source-over";
      for (const T of tiles) {
        const lp = clamp((t - T.t0) / T.dur);
        if (lp <= 0) continue;
        const k = 1 - easeOutBack(lp);
        ctx.globalAlpha = Math.min(1, lp * 2.2);
        ctx.save();
        ctx.translate(T.dx + T.dw / 2 + T.ox * k, T.dy + T.dh / 2 + T.oy * k);
        ctx.rotate(T.rot * k);
        const s = 1 + T.sc * k;
        ctx.scale(s, s);
        ctx.drawImage(src, T.sx, T.sy, T.sw, T.sh, -T.dw / 2 - 0.5, -T.dh / 2 - 0.5, T.dw + 1, T.dh + 1);
        ctx.restore();
      }
      // seam flash right after each panel lands
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1.2;
      for (const T of tiles) {
        const fl = (t - T.t0 - T.dur) / 0.5;
        if (fl <= 0 || fl >= 1) continue;
        ctx.globalAlpha = (1 - fl) * (1 - fl) * 0.9;
        ctx.strokeStyle = T.violet ? "#a78bfa" : "#38e1ff";
        ctx.strokeRect(T.dx + 0.5, T.dy + 0.5, T.dw - 1, T.dh - 1);
      }

      // 2. network
      for (const n of nodes) {
        const e = easeOutCubic(clamp((t - n.t0) / n.dur));
        n.e = e;
        n.x = n.sx + (n.tx - n.sx) * e + n.px * Math.sin(Math.PI * e);
        n.y = n.sy + (n.ty - n.sy) * e + n.py * Math.sin(Math.PI * e);
      }
      const settle = smooth(2.4, 3.5, t);
      const base = lerp(0.8, 0.22, settle);
      ctx.lineWidth = 0.8;
      for (const [i, j] of edges) {
        const a = nodes[i], b = nodes[j];
        const m = Math.min(a.e, b.e);
        if (m <= 0.02) continue;
        ctx.globalAlpha = base * m * m;
        ctx.strokeStyle = `rgb(${a.col})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      const rScale = lerp(2.6, 1.5, settle);
      for (const n of nodes) {
        if (n.e <= 0.01) continue;
        ctx.fillStyle = `rgb(${n.col})`;
        const a = clamp(n.e * 3);
        ctx.globalAlpha = a * 0.16;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * rScale * 3, 0, 6.2832);
        ctx.fill();
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * rScale, 0, 6.2832);
        ctx.fill();
      }

      // 3. data pulses (only once assembled)
      const amb = clamp((t - 3.2) / 0.6);
      if (amb > 0 && !reduced) {
        ctx.fillStyle = "#bff3ff";
        ctx.strokeStyle = "#7dd3fc";
        ctx.lineWidth = 1.4;
        for (const p of pulses) {
          p.p += p.speed * dt;
          if (p.p >= 1) {
            p.p = 0;
            p.edge = (Math.random() * edges.length) | 0;
          }
          const [i, j] = edges[p.edge];
          const a = nodes[i], b = nodes[j];
          const x = lerp(a.x, b.x, p.p), y = lerp(a.y, b.y, p.p);
          const q = Math.max(0, p.p - 0.18);
          ctx.globalAlpha = amb * 0.8;
          ctx.beginPath();
          ctx.moveTo(lerp(a.x, b.x, q), lerp(a.y, b.y, q));
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.globalAlpha = amb;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    const tick = (time: number) => {
      if (!src) return;
      const t = progress.t;
      const ambient = t >= NN_TOTAL && visible && !reduced;
      if (!ambient && t === lastT) return;
      if (ambient && time - lastDraw < 1 / 30) return;
      const dt = Math.min(0.1, Math.max(0, time - lastDraw));
      lastT = t;
      lastDraw = time;
      draw(t, dt);
    };

    // ---- boot
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      src = makeSource(img);
      samples = sampleNodes(src, 160);
      resize();
    };
    img.src = imageSrc;

    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(resize);
    });
    ro.observe(parent);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(parent);

    gsap.ticker.add(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [canvasRef, progress, imageSrc]);
}