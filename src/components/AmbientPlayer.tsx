'use client';

import React, { useState, useRef } from 'react';

export function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synthesize a beautiful Japanese Wind Chime (Furin 🎐) sound using Web Audio API
  const playChime = () => {
    if (!audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    
    // Create oscillator nodes for metallic chime sound (high frequency + harmonics)
    const now = ctx.currentTime;
    
    // Fundamental frequency (crystal clear high pitch)
    const baseFreq = 1200 + Math.random() * 800;
    
    const frequencies = [baseFreq, baseFreq * 1.5, baseFreq * 2.2];
    
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Chime decay (exponential fade out)
      gainNode.gain.setValueAtTime(idx === 0 ? 0.08 : 0.03, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 2.5);
    });
  };

  const togglePlayback = () => {
    if (isPlaying) {
      // Stop chimes
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Initialize Audio Context
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Immediately play one chime
      playChime();
      
      // Randomly play chimes every 4 to 8 seconds (like a gentle wind breeze)
      intervalRef.current = setInterval(() => {
        playChime();
      }, 4000 + Math.random() * 4000);
      
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={togglePlayback}
      className={`fixed left-3 z-50 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all backdrop-blur-md sm:left-4 ${
        isPlaying 
          ? 'bg-emerald-500 border-emerald-400 text-white animate-pulse' 
          : 'bg-white/80 border-gray-200 text-gray-700 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-200'
      }`}
      style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      title={isPlaying ? 'Mute Wind Chime 🎐' : 'Play Japanese Wind Chime 🎐'}
    >
      <span className="text-lg">{isPlaying ? '🎐' : '🔕'}</span>
    </button>
  );
}
