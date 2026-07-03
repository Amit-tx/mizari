'use client';

import React, { useEffect, useState } from 'react';

interface Lantern {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  horizontalOffset: string;
}

export function LanternEffect() {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);

  useEffect(() => {
    const tempLanterns: Lantern[] = Array.from({ length: 12 }).map((_, idx) => ({
      id: idx,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 12}s`,
      duration: `${15 + Math.random() * 12}s`,
      size: `${20 + Math.random() * 15}px`,
      horizontalOffset: `${-40 + Math.random() * 80}px`,
    }));
    setLanterns(tempLanterns);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {lanterns.map((lantern) => (
        <div
          key={lantern.id}
          className="absolute rounded-md bg-orange-500/30 opacity-70 border border-orange-400/40 animate-lantern flex flex-col justify-between p-0.5"
          style={{
            left: lantern.left,
            width: lantern.size,
            height: `calc(${lantern.size} * 1.3)`,
            animationDelay: lantern.delay,
            animationDuration: lantern.duration,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            bottom: '-15%', // start from bottom and float up
            boxShadow: '0 0 12px rgba(251, 146, 60, 0.4)',
            '--horizontal-offset': lantern.horizontalOffset,
          } as React.CSSProperties}
        >
          {/* Lantern top/bottom black cap style */}
          <div className="h-1 w-full bg-slate-900/40 rounded-t-sm" />
          <div className="flex-1 bg-gradient-to-b from-red-500/40 to-orange-400/40" />
          <div className="h-1 w-full bg-slate-900/40 rounded-b-sm" />
        </div>
      ))}
    </div>
  );
}
