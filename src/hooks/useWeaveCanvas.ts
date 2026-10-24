import { useEffect, type RefObject } from "react";
import gsap from "gsap";

/**
 * Weaving engine
 * ----------------------------------------------------------------------------
 * 1. Reads dress.png once, and picks N target points from its bright pixels
 *    (neon edges are weighted heavier). Each target keeps the pixel's colour.
 * 2. Every thread is a pre-computed S-curve from off-screen to its target,
 *    finishing with a short vertical "warp" strand (so the dress ends up looking
 *    woven, not star-bursted).
 * 3. Per frame we only draw a short moving window of each thread (head + tail),
 *    batched by colour bucket -> ~30 stroke() calls for 1000+ threads.
 * 4. Renders ONLY when scroll progress changed. Idle scroll = zero GPU/CPU.
 */

export type Progress = { p: number };

type Thread = {
  pts: Float32Array;
  start: number;
  dur: number;
};
type Bucket = { color: string; width: number; alpha: number; threads: Thread[] };
type Target = { u: number; v: number; r: number; g: number; b: number };

const SEG = 32; // segments per thread
const TAIL = 0.2; // trail length while flying (fraction of the path)
const STUB = 1 / SEG; // final resting strand = last segment (vertical)
const FLIGHT_START = 0.04;
const BRIGHT_THRESHOLD = 70; // ignore pixels darker than this (background)

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick `count` points on the dress, weighted by brightness. */
function sampleDress(img: HTMLImageElement, count: number): Target[] {
  const S = 300;
  const w = S;
  const h = Math.round(S * (img.naturalHeight / img.naturalWidth));
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const c = off.getContext("2d", { willReadFrequently: true })!;
  c.drawImage(img, 0, 0, w, h);
  const data = c.getImageData(0, 0, w, h).data;

  const cum = new Float32Array(w * h);
  let sum = 0;
  for (let i = 0; i < w * h; i++) {
    const x = i % w;
    const y = (i / w) | 0;
    const m = Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    const inside = x > w * 0.04 && x < w * 0.96 && y > h * 0.04 && y < h * 0.96;
    const wgt =
      inside && m > BRIGHT_THRESHOLD
        ? Math.pow((m - BRIGHT_THRESHOLD) / (255 - BRIGHT_THRESHOLD), 1.6)
        : 0;
    sum += wgt;
    cum[i] = sum;
  }

  const rand = mulberry32(7);
  const out: Target[] = [];
  for (let n = 0; n < count; n++) {
    const r = rand() * sum;
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const px = data[lo * 4];
    const py = data[lo * 4 + 1];
    const pz = data[lo * 4 + 2];
    const boost = (255 / Math.max(px, py, pz, 1)) * 0.85; // push towards neon
    const q = (v: number) => Math.min(255, Math.round((v * boost) / 48) * 48);
    out.push({
      u: ((lo % w) + rand()) / w,
      v: (((lo / w) | 0) + rand()) / h,
      r: q(px),
      g: q(py),
      b: q(pz),
    });
  }
  return out;
}

function layout(W: number, H: number, ratio: number) {
  const desktop = W >= 768;
  const size = desktop ? Math.min(H * 0.94, W * 0.62) : Math.min(W, H * 0.58);
  const cx = desktop ? W * 0.7 : W * 0.5;
  const cy = desktop ? H * 0.5 : H * 0.36;
  return { x: cx - size / 2, y: cy - (size * ratio) / 2, w: size, h: size * ratio };
}

export function useWeaveCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  imgRef: RefObject<HTMLImageElement | null>,
  progress: Progress,
  src: string
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = imgRef.current;
    if (!canvas || !reveal) return;
    const ctx = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;

    let cancelled = false;
    let targets: Target[] = [];
    let ratio = 1;
    let buckets: Bucket[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;
    let lastP = -1;

    const isSmall = () => window.innerWidth < 768;
    const threadCount = () => {
      const weak = (navigator.hardwareConcurrency || 8) <= 4;
      return isSmall() ? 550 : weak ? 800 : 1100;
    };

    function build() {
      if (!targets.length) return;
      const rect = layout(W, H, ratio);
      reveal!.style.cssText += `;left:${rect.x}px;top:${rect.y}px;width:${rect.w}px;height:${rect.h}px`;

      const rand = mulberry32(42);
      const cx = rect.x + rect.w / 2;
      const cy = rect.y + rect.h / 2;
      const R = Math.hypot(W, H) * 0.75;
      const map = new Map<string, Bucket>();
      const n = Math.min(threadCount(), targets.length);

      for (let i = 0; i < n; i++) {
        const t = targets[i];
        const tx = rect.x + t.u * rect.w;
        const ty = rect.y + t.v * rect.h;

        // origin: any direction, always off the dress
        const ang = rand() * Math.PI * 2;
        const rad = 0.8 + rand() * 0.4;
        const ox = cx + Math.cos(ang) * R * rad;
        const oy = cy + Math.sin(ang) * R * rad;

        // end of the curve: a little above target, then a vertical warp strand
        const drape = (10 + rand() * 26) * (rect.w / 700);
        const ax = tx;
        const ay = ty - drape;
        const dx = ax - ox;
        const dy = ay - oy;
        const L = Math.hypot(dx, dy) || 1;

        // alternate swirl direction => threads cross each other (the "weave")
        const swirl = (i % 2 ? 1 : -1) * (0.15 + rand() * 0.35);
        const p1x = ox + dx * 0.3 - (dy / L) * swirl * L;
        const p1y = oy + dy * 0.3 + (dx / L) * swirl * L;
        const p2x = ax + (rand() - 0.5) * L * 0.08;
        const p2y = ay - Math.min(L * 0.25, H * 0.3);

        const pts = new Float32Array((SEG + 1) * 2);
        const steps = SEG - 1;
        for (let k = 0; k <= steps; k++) {
          const u = k / steps;
          const iu = 1 - u;
          const a = iu * iu * iu;
          const b = 3 * iu * iu * u;
          const c = 3 * iu * u * u;
          const d = u * u * u;
          pts[k * 2] = a * ox + b * p1x + c * p2x + d * ax;
          pts[k * 2 + 1] = a * oy + b * p1y + c * p2y + d * ay;
        }
        pts[SEG * 2] = tx;
        pts[SEG * 2 + 1] = ty;

        // top of the dress weaves first, hem last
        const delay = 0.55 * t.v + 0.45 * rand();
        const thread: Thread = {
          pts,
          start: FLIGHT_START + delay * 0.42,
          dur: 0.24 + rand() * 0.1,
        };

        const thick = rand() < 0.25;
        const key = `${t.r},${t.g},${t.b},${thick ? 1 : 0}`;
        let bucket = map.get(key);
        if (!bucket) {
          bucket = {
            color: `rgb(${t.r},${t.g},${t.b})`,
            width: thick ? 1.3 : 0.7,
            alpha: thick ? 0.7 : 0.55,
            threads: [],
          };
          map.set(key, bucket);
        }
        bucket.threads.push(thread);
      }
      buckets = [...map.values()];
      lastP = -1; // force redraw
    }

    function resize() {
      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, isSmall() ? 1.5 : 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      build();
    }

    function draw(P: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter"; // overlaps glow, no blur filter needed
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const bk of buckets) {
        ctx.strokeStyle = bk.color;
        ctx.lineWidth = bk.width;
        ctx.globalAlpha = bk.alpha;
        ctx.beginPath();
        for (const th of bk.threads) {
          let lp = (P - th.start) / th.dur;
          if (lp <= 0) continue;
          if (lp > 1) lp = 1;

          const head = easeOutCubic(lp);
          const tail = lerp(TAIL, STUB, smooth(0.7, 1, lp));
          const a = Math.max(0, head - tail) * SEG;
          const b = head * SEG;
          const ia = Math.min(Math.floor(a), SEG - 1);
          const ib = Math.min(Math.floor(b), SEG - 1);
          const pts = th.pts;

          const fa = a - ia;
          ctx.moveTo(
            pts[ia * 2] + (pts[ia * 2 + 2] - pts[ia * 2]) * fa,
            pts[ia * 2 + 1] + (pts[ia * 2 + 3] - pts[ia * 2 + 1]) * fa
          );
          for (let k = ia + 1; k <= ib; k++) ctx.lineTo(pts[k * 2], pts[k * 2 + 1]);
          const fb = b - ib;
          ctx.lineTo(
            pts[ib * 2] + (pts[ib * 2 + 2] - pts[ib * 2]) * fb,
            pts[ib * 2 + 1] + (pts[ib * 2 + 3] - pts[ib * 2 + 1]) * fb
          );
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    const tick = () => {
      if (progress.p === lastP || !buckets.length) return;
      lastP = progress.p;
      draw(lastP);
    };

    // ---- boot ---------------------------------------------------------------
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      ratio = img.naturalHeight / img.naturalWidth;
      targets = sampleDress(img, 1100);
      resize();
    };
    img.src = src;

    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(resize);
    });
    ro.observe(parent);

    gsap.ticker.add(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [canvasRef, imgRef, progress, src]);
}