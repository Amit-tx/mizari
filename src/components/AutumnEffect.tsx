'use client';

import React, { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  horizontalOffset: string;
}

export function AutumnEffect() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const tempLeaves: Leaf[] = Array.from({ length: 20 }).map((_, idx) => ({
      id: idx,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${12 + Math.random() * 10}s`,
      size: `${12 + Math.random() * 14}px`,
      horizontalOffset: `${-60 + Math.random() * 120}px`,
    }));
    setLeaves(tempLeaves);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute rounded-sm bg-orange-600/70 opacity-75 animate-autumn"
          style={{
            left: leaf.left,
            width: leaf.size,
            height: leaf.size,
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            top: '-5%',
            transform: `rotate(${Math.random() * 360}deg)`,
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', // leaf-like shape
            '--horizontal-offset': leaf.horizontalOffset,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
