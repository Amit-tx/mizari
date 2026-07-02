'use client';
import { useEffect, useRef } from 'react';

export function ShootingStarsEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      const star = document.createElement('div');
      const size = Math.random() * 2 + 1;
      const top = Math.random() * 60;
      const left = Math.random() * 100;
      const duration = Math.random() * 1500 + 800;
      const delay = Math.random() * 4000;

      star.style.cssText = `
        position: absolute;
        top: ${top}%;
        left: ${left}%;
        width: ${size * 60}px;
        height: ${size}px;
        background: linear-gradient(90deg, rgba(255,255,255,0.9), transparent);
        border-radius: 999px;
        animation: shoot ${duration}ms ${delay}ms ease-out forwards;
        transform: rotate(-35deg);
        pointer-events: none;
      `;
      container.appendChild(star);
      setTimeout(() => star.remove(), duration + delay + 100);
    };

    const interval = setInterval(createStar, 1200);
    for (let i = 0; i < 3; i++) createStar();
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes shoot {
          0% { opacity: 0; transform: rotate(-35deg) translateX(0); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: rotate(-35deg) translateX(300px); }
        }
      `}</style>
      <div ref={containerRef} className="pointer-events-none fixed inset-0 overflow-hidden z-0" />
    </>
  );
}
