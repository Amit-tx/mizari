'use client';
import { useEffect, useRef } from 'react';

export function FirefliesEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fireflies: HTMLDivElement[] = [];
    const count = 18;

    for (let i = 0; i < count; i++) {
      const fly = document.createElement('div');
      const size = Math.random() * 4 + 3;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 4000 + 3000;
      const delay = Math.random() * 3000;

      fly.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, #AAFF80 0%, #7FFF00 60%, transparent 100%);
        box-shadow: 0 0 ${size * 2}px ${size}px rgba(170,255,128,0.6);
        animation: firefly ${duration}ms ${delay}ms ease-in-out infinite alternate;
        pointer-events: none;
      `;
      container.appendChild(fly);
      fireflies.push(fly);
    }

    return () => fireflies.forEach((f) => f.remove());
  }, []);

  return (
    <>
      <style>{`
        @keyframes firefly {
          0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
          25% { opacity: 1; }
          50% { opacity: 0.6; transform: translate(30px, -20px) scale(1.2); }
          75% { opacity: 1; transform: translate(-20px, 10px) scale(0.9); }
          100% { opacity: 0; transform: translate(15px, -30px) scale(1.1); }
        }
      `}</style>
      <div ref={containerRef} className="pointer-events-none fixed inset-0 overflow-hidden z-0" />
    </>
  );
}
