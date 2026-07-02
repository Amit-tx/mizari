'use client';
import { useEffect, useRef } from 'react';

export function RainEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements: HTMLDivElement[] = [];

    // Three depth layers: far (small, slow, faint), mid, near (big, fast, bright).
    // This parallax gives the rain real depth instead of a flat single layer.
    const layers = [
      { count: 35, minH: 8, maxH: 14, minDur: 900, maxDur: 1300, opacity: 0.18, width: 1 },
      { count: 35, minH: 14, maxH: 22, minDur: 650, maxDur: 950, opacity: 0.32, width: 1.5 },
      { count: 25, minH: 20, maxH: 32, minDur: 450, maxDur: 700, opacity: 0.5, width: 2 },
    ];

    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const left = Math.random() * 100;
        const height = Math.random() * (layer.maxH - layer.minH) + layer.minH;
        const duration = Math.random() * (layer.maxDur - layer.minDur) + layer.minDur;
        const delay = Math.random() * 2500;

        const drop = document.createElement('div');
        drop.style.cssText = `
          position: absolute;
          left: ${left}%;
          top: -${height}px;
          width: ${layer.width}px;
          height: ${height}px;
          background: linear-gradient(180deg, transparent, rgba(180,215,255,${layer.opacity}));
          border-radius: 999px;
          animation: mizari-rain-fall ${duration}ms ${delay}ms linear infinite;
          pointer-events: none;
          will-change: transform, opacity;
        `;
        container.appendChild(drop);
        elements.push(drop);

        // A small splash ring at the ground, synced to when its drop lands.
        const splash = document.createElement('div');
        splash.style.cssText = `
          position: absolute;
          left: ${left}%;
          bottom: 0;
          width: 6px;
          height: 6px;
          margin-left: -3px;
          border: 1px solid rgba(180,215,255,${layer.opacity * 0.9});
          border-radius: 50%;
          animation: mizari-rain-splash ${duration}ms ${delay}ms linear infinite;
          pointer-events: none;
          opacity: 0;
        `;
        container.appendChild(splash);
        elements.push(splash);
      }
    });

    // Occasional soft lightning flash for atmosphere — subtle, not a strobe.
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: absolute;
      inset: 0;
      background: rgba(200, 220, 255, 0);
      pointer-events: none;
    `;
    container.appendChild(flash);
    elements.push(flash);

    let flashTimeout: ReturnType<typeof setTimeout>;
    const scheduleFlash = () => {
      const wait = 8000 + Math.random() * 14000;
      flashTimeout = setTimeout(() => {
        flash.animate(
          [{ background: 'rgba(200,220,255,0)' }, { background: 'rgba(200,220,255,0.06)' }, { background: 'rgba(200,220,255,0)' }],
          { duration: 400, easing: 'ease-out' }
        );
        scheduleFlash();
      }, wait);
    };
    scheduleFlash();

    return () => {
      elements.forEach((el) => el.remove());
      clearTimeout(flashTimeout);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes mizari-rain-fall {
          0% { transform: translate(0, -20px) rotate(8deg); opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 0.9; }
          100% { transform: translate(28px, 100vh) rotate(8deg); opacity: 0; }
        }
        @keyframes mizari-rain-splash {
          0%, 88% { opacity: 0; transform: scale(0.4); }
          92% { opacity: 0.8; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(1.4); }
        }
      `}</style>
      <div ref={containerRef} className="pointer-events-none fixed inset-0 overflow-hidden z-0" />
    </>
  );
}
