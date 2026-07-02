'use client';
import { useEffect, useRef } from 'react';

export function RainEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const drops: HTMLDivElement[] = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      const left = Math.random() * 100;
      const height = Math.random() * 15 + 10;
      const duration = Math.random() * 500 + 600;
      const delay = Math.random() * 2000;
      const opacity = Math.random() * 0.4 + 0.2;

      drop.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: -${height}px;
        width: 1.5px;
        height: ${height}px;
        background: linear-gradient(180deg, transparent, rgba(150,200,255,${opacity}));
        border-radius: 999px;
        animation: rain ${duration}ms ${delay}ms linear infinite;
        pointer-events: none;
      `;
      container.appendChild(drop);
      drops.push(drop);
    }

    return () => drops.forEach((d) => d.remove());
  }, []);

  return (
    <>
      <style>{`
        @keyframes rain {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0.3; }
        }
      `}</style>
      <div ref={containerRef} className="pointer-events-none fixed inset-0 overflow-hidden z-0" />
    </>
  );
}
