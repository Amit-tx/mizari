'use client';

import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  horizontalOffset: string;
}

export function SakuraEffect() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate 25 random petals with varying animation properties
    const tempPetals: Petal[] = Array.from({ length: 25 }).map((_, idx) => ({
      id: idx,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 15}s`,
      size: `${8 + Math.random() * 12}px`,
      horizontalOffset: `${-50 + Math.random() * 100}px`,
    }));
    setPetals(tempPetals);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute rounded-full bg-pink-200/60 opacity-80 animate-sakura"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            top: '-5%',
            transform: `rotate(${Math.random() * 360}deg)`,
            boxShadow: '0 0 8px rgba(244, 143, 177, 0.4)',
            '--horizontal-offset': petal.horizontalOffset,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
