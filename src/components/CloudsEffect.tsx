'use client';
import { useEffect, useRef } from 'react';

export function CloudsEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cloudData = [
      { top: 8, width: 180, height: 55, duration: 35, delay: 0, opacity: 0.75 },
      { top: 18, width: 240, height: 65, duration: 50, delay: -10, opacity: 0.6 },
      { top: 5, width: 130, height: 40, duration: 28, delay: -5, opacity: 0.85 },
      { top: 25, width: 200, height: 58, duration: 45, delay: -20, opacity: 0.5 },
      { top: 12, width: 160, height: 48, duration: 38, delay: -15, opacity: 0.7 },
    ];

    const clouds: HTMLDivElement[] = [];

    cloudData.forEach((c) => {
      const cloud = document.createElement('div');
      cloud.style.cssText = `
        position: absolute;
        top: ${c.top}%;
        left: -${c.width + 50}px;
        width: ${c.width}px;
        height: ${c.height}px;
        background: radial-gradient(ellipse, rgba(255,255,255,${c.opacity}) 0%, rgba(255,255,255,${c.opacity * 0.5}) 70%, transparent 100%);
        border-radius: 50%;
        filter: blur(6px);
        animation: cloudFloat ${c.duration}s ${c.delay}s linear infinite;
        pointer-events: none;
      `;
      container.appendChild(cloud);
      clouds.push(cloud);
    });

    return () => clouds.forEach((c) => c.remove());
  }, []);

  return (
    <>
      <style>{`
        @keyframes cloudFloat {
          0% { transform: translateX(-200px); }
          100% { transform: translateX(120vw); }
        }
      `}</style>
      <div ref={containerRef} className="pointer-events-none fixed inset-0 overflow-hidden z-0" />
    </>
  );
}
