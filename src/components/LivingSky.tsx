"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getPhase, isDaytime } from "@/data/timePhases";
import type { Particle } from "@/data/themes";

interface LivingSkyProps {
  particle: Particle;
  headline?: string;
  showClock?: boolean;
  showContent?: boolean;
  /** Controlled minutes-of-day (0-1439). If provided, component won't self-sync to real time. */
  minutes?: number;
  className?: string;
}

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Firefly {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

function makePetals(n: number): Petal[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 8 + Math.random() * 8,
    duration: 8 + Math.random() * 8,
    delay: Math.random() * 8,
    opacity: 0.4 + Math.random() * 0.4,
  }));
}

function makeFireflies(n: number): Firefly[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: 20 + Math.random() * 55,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 4,
  }));
}

const STAR_COUNT = 60;
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 70,
  delay: Math.random() * 3,
}));

export default function LivingSky({
  particle,
  headline,
  showClock = true,
  showContent = true,
  minutes,
  className = "",
}: LivingSkyProps) {
  const [liveMinutes, setLiveMinutes] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  const effectiveMinutes = minutes ?? liveMinutes;

  useEffect(() => {
    if (minutes !== undefined) return; // controlled externally, don't self-tick
    const id = setInterval(() => {
      const now = new Date();
      setLiveMinutes(now.getHours() * 60 + now.getMinutes());
    }, 30000);
    return () => clearInterval(id);
  }, [minutes]);

  const hourFloat = effectiveMinutes / 60;
  const phase = getPhase(hourFloat);
  const day = isDaytime(hourFloat);

  const lastLabelRef = useRef<string>("");
  const [petals, setPetals] = useState<Petal[]>([]);
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    if (phase.label === lastLabelRef.current) return;
    lastLabelRef.current = phase.label;

    if (particle === "none") {
      setPetals([]);
      setFireflies([]);
      return;
    }
    if (particle === "petal") {
      if (day) {
        setPetals(makePetals(18));
        setFireflies([]);
      } else {
        setFireflies(makeFireflies(14));
        setPetals([]);
      }
      return;
    }
    // firefly particle type: always fireflies, day or night
    setFireflies(makeFireflies(16));
    setPetals([]);
  }, [phase.label, particle, day]);

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
            className="absolute w-[2px] h-[2px] rounded-full bg-white animate-pulse"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDelay: `${s.delay}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      {/* ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {petals.map((p) => (
          <span
            key={p.id}
            className="absolute -top-[5%] rounded-tl-[0%] rounded-br-[0%]"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: "#F3AABB",
              borderRadius: "0% 60% 0% 60%",
              opacity: p.opacity,
              animation: `mizari-fall ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
        {fireflies.map((f) => (
          <span
            key={f.id}
            className="absolute rounded-full"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: 5,
              height: 5,
              background: "#F4E27A",
              boxShadow: "0 0 8px 3px rgba(244,226,122,0.8)",
              animation: `mizari-drift ${f.duration}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </div>

      {/* content */}
      {showContent && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
          <div
            className="text-xs tracking-[0.28em] uppercase mb-4 font-semibold transition-colors duration-1000"
            style={{ color: phase.color }}
          >
            {phase.label}
          </div>
          <div
            className="font-display text-2xl md:text-4xl max-w-xl transition-colors duration-1000"
            style={{ color: phase.color }}
          >
            {headline || phase.headlineFallback}
          </div>
          <div
            className="mt-3 text-sm max-w-sm opacity-85 leading-relaxed transition-colors duration-1000"
            style={{ color: phase.color }}
          >
            {phase.body}
          </div>
          {showClock && (
            <div
              className="mt-6 font-display text-xl transition-colors duration-1000"
              style={{ color: phase.color }}
            >
              {hh}:{mm}
            </div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mizari-fall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); }
          100% { transform: translateY(110vh) translateX(36px) rotate(320deg); }
        }
        @keyframes mizari-drift {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(18px, -26px); opacity: 1; }
        }
      `}} />
    </div>
  );
}
