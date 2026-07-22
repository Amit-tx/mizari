'use client';
import { useEffect, useRef } from 'react';

// Layered ocean waves for water/beach themes (Mizukaze Wave, Okinawa Blue).
// Three SVG wave paths at different speeds/opacities give real parallax
// depth instead of one flat repeating stripe, plus a soft light-shimmer
// layer on top and small foam highlights riding the front wave crest.
export function WaveEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Foam highlight dots that drift left-to-right along the front wave,
    // giving the sense of light catching moving water.
    const foamEls: HTMLDivElement[] = [];
    for (let i = 0; i < 14; i++) {
      const foam = document.createElement('div');
      const delay = Math.random() * 6000;
      const duration = 5000 + Math.random() * 3000;
      const top = 78 + Math.random() * 14; // sits within the front wave band
      const size = 3 + Math.random() * 4;
      foam.style.cssText = `
        position: absolute;
        left: -5%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 999px;
        background: rgba(255,255,255,0.55);
        filter: blur(0.5px);
        animation: mizari-wave-foam ${duration}ms ${delay}ms linear infinite;
        pointer-events: none;
      `;
      container.appendChild(foam);
      foamEls.push(foam);
    }

    return () => {
      foamEls.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes mizari-wave-scroll-back {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes mizari-wave-scroll-mid {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes mizari-wave-scroll-front {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes mizari-wave-foam {
          0% { transform: translateX(0) translateY(0); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.6; }
          100% { transform: translateX(115vw) translateY(-3px); opacity: 0; }
        }
        @keyframes mizari-wave-shimmer {
          0%, 100% { opacity: 0.10; }
          50% { opacity: 0.22; }
        }
      `}</style>

      {/* Soft light shimmer over the whole water surface */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.25))',
          animation: 'mizari-wave-shimmer 4.5s ease-in-out infinite',
        }}
      />

      {/* Back layer — small, slow, faint */}
      <div
        className="absolute bottom-0 left-0 w-[200%] h-24 opacity-40"
        style={{ animation: 'mizari-wave-scroll-back 14s linear infinite' }}
      >
        <svg viewBox="0 0 1440 100" width="100%" height="100%" preserveAspectRatio="none">
          <path
            d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 C1680,90 1920,10 2160,50 L2160,100 L0,100 Z"
            fill="rgba(255,255,255,0.35)"
          />
        </svg>
      </div>

      {/* Mid layer */}
      <div
        className="absolute bottom-0 left-0 w-[200%] h-20 opacity-60"
        style={{ animation: 'mizari-wave-scroll-mid 9s linear infinite reverse' }}
      >
        <svg viewBox="0 0 1440 90" width="100%" height="100%" preserveAspectRatio="none">
          <path
            d="M0,40 C220,80 460,5 720,40 C980,75 1220,5 1440,40 C1660,75 1900,5 2160,40 L2160,90 L0,90 Z"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
      </div>

      {/* Front layer — big, fast, brightest */}
      <div
        className="absolute bottom-0 left-0 w-[200%] h-16"
        style={{ animation: 'mizari-wave-scroll-front 6s linear infinite' }}
      >
        <svg viewBox="0 0 1440 70" width="100%" height="100%" preserveAspectRatio="none">
          <path
            d="M0,30 C200,60 460,0 720,30 C980,60 1240,0 1440,30 C1660,60 1900,0 2160,30 L2160,70 L0,70 Z"
            fill="rgba(255,255,255,0.7)"
          />
        </svg>
      </div>
    </div>
  );
}
