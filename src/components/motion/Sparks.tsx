import { useEffect, useRef } from 'react';

/* ---------------------------------------------------------------------------
   SPARKS — a capped particle field drifting up through the hero.

   Deliberately lazy-loaded from Home.tsx because it is pure decoration: if the
   chunk arrives late, the hero simply has no sparks, which is the correct
   failure mode. It is also:

     · capped at 34 particles on desktop, 14 on phones,
     · paused whenever the hero scrolls out of the viewport or the tab is
       hidden (no background rAF burn on a phone),
     · drawn as squares rather than arcs — square specks suit the angular
       language and fillRect is dramatically cheaper than arc(),
     · skipped entirely under prefers-reduced-motion.
   --------------------------------------------------------------------------- */

interface SparksProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  accent: boolean;
}

const ACCENT: [number, number, number] = [252, 2, 115];
const SILVER: [number, number, number] = [232, 233, 238];

export default function Sparks({ className }: SparksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let frame = 0;
    let lastTime = 0;
    let running = true;

    const makeParticle = (seedY = 1): Particle => ({
      x: Math.random() * width,
      y: seedY >= 1 ? height + Math.random() * 40 : Math.random() * height,
      size: Math.random() < 0.22 ? 2 : 1,
      vx: (Math.random() - 0.5) * 0.16,
      vy: -(0.12 + Math.random() * 0.42),
      alpha: 0.14 + Math.random() * 0.42,
      accent: Math.random() < 0.3,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = width < 768 ? 14 : 34;
      particles = Array.from({ length: target }, () => makeParticle(0));
    };

    const draw = (time: number) => {
      frame = window.requestAnimationFrame(draw);
      if (!running) return;

      const delta = lastTime ? Math.min((time - lastTime) / 16.667, 3) : 1;
      lastTime = time;

      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx * delta;
        p.y += p.vy * delta;

        if (p.y < -8) {
          particles[i] = makeParticle(1);
          continue;
        }

        const [r, g, b] = p.accent ? ACCENT : SILVER;
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        context.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
    };

    resize();
    frame = window.requestAnimationFrame(draw);

    /* Stop the loop when the hero is off screen. IntersectionObserver, never a
       scroll listener — this runs while the visitor is scrolling the rest of a
       long page, which is exactly when frames matter most. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !document.hidden;
        lastTime = 0;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onVisibility = () => {
      running = !document.hidden;
      lastTime = 0;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onResize = () => {
      resize();
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
