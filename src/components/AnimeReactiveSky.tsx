"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimeReactivePhase } from "@/data/themes";

interface AnimeReactiveSkyProps {
  phases: AnimeReactivePhase[];
  minutes?: number; // controlled; undefined = live device time
  showClock?: boolean;
  showContent?: boolean;
  className?: string;
}

interface LeafP {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}
interface OrbP {
  id: number;
  left: number;
  duration: number;
  delay: number;
  color: string;
}

function getPhase(phases: AnimeReactivePhase[], hourFloat: number) {
  for (const p of phases) {
    if (hourFloat < p.end) return p;
  }
  return phases[phases.length - 1];
}

function makeLeaves(n: number): LeafP[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 10 + Math.random() * 8,
    duration: 8 + Math.random() * 8,
    delay: Math.random() * 8,
  }));
}
function makeOrbs(n: number, color: string): OrbP[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 3 + Math.random() * 3,
    delay: Math.random() * 3,
    color,
  }));
}

const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 70,
  delay: Math.random() * 3,
}));

export default function AnimeReactiveSky({
  phases,
  minutes,
  showClock = true,
  showContent = true,
  className = "",
}: AnimeReactiveSkyProps) {
  const [liveMinutes, setLiveMinutes] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  const effectiveMinutes = minutes ?? liveMinutes;

  useEffect(() => {
    if (minutes !== undefined) return;
    const id = setInterval(() => {
      const now = new Date();
      setLiveMinutes(now.getHours() * 60 + now.getMinutes());
    }, 30000);
    return () => clearInterval(id);
  }, [minutes]);

  const hourFloat = effectiveMinutes / 60;
  const phase = getPhase(phases, hourFloat);

  const isDay = hourFloat >= 5 && hourFloat <= 20;
  let progress = isDay ? (hourFloat - 5) / 15 : hourFloat > 20 ? (hourFloat - 20) / 9 : (hourFloat + 4) / 9;
  progress = Math.max(0, Math.min(1, progress));
  const topPct = 65 - Math.sin(progress * Math.PI) * 55;
  const leftPct = 10 + progress * 80;

  const lastLabelRef = useRef<string>("");
  const [leaves, setLeaves] = useState<LeafP[]>([]);
  const [orbs, setOrbs] = useState<OrbP[]>([]);

  useEffect(() => {
    if (phase.label === lastLabelRef.current) return;
    lastLabelRef.current = phase.label;

    if (phase.particle.kind === "leaf") {
      setLeaves(makeLeaves(15));
      setOrbs([]);
    } else if (phase.particle.kind === "orb") {
      setOrbs(makeOrbs(22, phase.particle.color || phase.accent));
      setLeaves([]);
    } else {
      setLeaves([]);
      setOrbs([]);
    }
  }, [phase.label, phase.particle]);

  const hh = String(Math.floor(hourFloat)).padStart(2, "0");
  const mm = String(Math.floor(effectiveMinutes % 60)).padStart(2, "0");

  return (
    <div
      className={`relative w-full h-full overflow-hidden transition-[background] duration-[1200ms] ease-in-out ${className}`}
      style={{ background: phase.sky }}
    >
      {/* stars */}
      <div
        className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
        style={{ opacity: phase.starsOpacity }}
      >
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute w-[2px] h-[2px] rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animation: "mizari-twinkle 3s infinite ease-in-out",
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* celestial body: glowing orb tinted to this theme's own accent color */}
      {phase.celestial !== "none" && (
        <div
          className="absolute w-20 h-20 rounded-full transition-[top,left] duration-[1500ms] ease-in-out"
          style={{
            top: `${topPct}%`,
            left: `${leftPct}%`,
            transform: "translateX(-50%)",
            background: `radial-gradient(circle at 35% 35%, #FFFFFF, ${phase.celestialColor[0]})`,
            boxShadow: `0 0 80px 30px ${phase.celestialColor[1]}, inset 0 0 24px rgba(255,255,255,0.7)`,
            animation: "mizari-orb-pulse 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Hokage mountain silhouette, foreground */}
      <div className="absolute bottom-0 left-0 right-0 h-[38%] z-[3]">
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="w-full h-full block">
          <path
            d="M0,300 L0,200 Q150,140 300,200 Q450,120 600,180 Q750,140 900,200 Q1050,160 1200,210 L1200,300Z"
            fill="#000"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* particles */}
      <div className="absolute inset-0 pointer-events-none z-[4]">
        {leaves.map((l) => (
          <span
            key={l.id}
            className="absolute -top-[5%]"
            style={{
              left: `${l.left}%`,
              width: l.size,
              height: l.size,
              background: "#2E8B57",
              borderRadius: "0% 70% 0% 70%",
              opacity: 0.6,
              animation: `mizari-leaf-fall ${l.duration}s linear infinite`,
              animationDelay: `${l.delay}s`,
            }}
          />
        ))}
        {orbs.map((c) => (
          <span
            key={c.id}
            className="absolute -top-[5%] rounded-full"
            style={{
              left: `${c.left}%`,
              width: 4,
              height: 20,
              opacity: 0.85,
              background: `linear-gradient(180deg, #FFFFFF, ${c.color})`,
              boxShadow: `0 0 10px ${c.color}`,
              animation: `mizari-chakra-rise ${c.duration}s linear infinite`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>

      {/* content */}
      {showContent && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
          <div
            className="text-xs tracking-[0.3em] uppercase mb-4 font-bold transition-colors duration-1000"
            style={{ color: phase.accent }}
          >
            {phase.label}
          </div>
          <div
            className="font-display text-2xl md:text-4xl max-w-xl transition-colors duration-1000"
            style={{ color: phase.text }}
          >
            {phase.headline}
          </div>
          <div
            className="mt-3 text-sm max-w-sm opacity-85 leading-relaxed transition-colors duration-1000"
            style={{ color: phase.text }}
          >
            {phase.body}
          </div>
          {showClock && (
            <div
              className="mt-6 font-display text-xl transition-colors duration-1000"
              style={{ color: phase.text }}
            >
              {hh}:{mm}
            </div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mizari-twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes mizari-orb-pulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.08); }
        }
        @keyframes mizari-leaf-fall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); }
          100% { transform: translateY(110vh) translateX(40px) rotate(340deg); }
        }
        @keyframes mizari-chakra-rise {
          0% { transform: translateY(110vh) rotate(0deg); }
          100% { transform: translateY(-10vh) rotate(360deg); }
        }
      `}} />
    </div>
  );
}
