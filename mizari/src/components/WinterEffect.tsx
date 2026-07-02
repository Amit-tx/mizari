'use client';

import React, { useEffect, useState } from 'react';

interface Flake {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  horizontalOffset: string;
}

export function WinterEffect() {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    const tempFlakes: Flake[] = Array.from({ length: 30 }).map((_, idx) => ({
      id: idx,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${8 + Math.random() * 8}s`,
      size: `${4 + Math.random() * 8}px`,
      horizontalOffset: `${-30 + Math.random() * 60}px`,
    }));
    setFlakes(tempFlakes);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white/80 opacity-90 animate-winter"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            top: '-5%',
            filter: 'blur(0.5px)',
            '--horizontal-offset': flake.horizontalOffset,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
