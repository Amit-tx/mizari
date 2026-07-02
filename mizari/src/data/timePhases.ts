export interface Phase {
  end: number; // hour (0-24.01) at which this phase ends
  sky: string; // background gradient for the sky only
  starsOpacity: number;
  label: string;
  color: string; // text color that reads well on this sky
  headlineFallback: string;
  body: string;
}

// Sun and mountain silhouette intentionally removed — the feel comes purely
// from sky color, ambient particles (petals / fireflies) and star density.
export const phases: Phase[] = [
  { end: 4.5, sky: "linear-gradient(180deg,#0B0E23 0%,#181C3A 55%,#241E3D 100%)", starsOpacity: 1, label: "Deep Night", color: "#EDE7F6", headlineFallback: "The world rests under a quiet indigo sky.", body: "Stillness for late thoughts." },
  { end: 6, sky: "linear-gradient(180deg,#2C2140 0%,#5A3B5C 45%,#B4657A 100%)", starsOpacity: 0.4, label: "Pre-Dawn", color: "#3A2438", headlineFallback: "The first blush before sunrise.", body: "Color returns slowly, like ink in water." },
  { end: 8.5, sky: "linear-gradient(180deg,#F6B99A 0%,#F3AABB 40%,#FCE3D6 100%)", starsOpacity: 0, label: "Sunrise", color: "#3A2430", headlineFallback: "Wake gently, like sunlight through paper screens.", body: "Soft pinks for a soft start." },
  { end: 11, sky: "linear-gradient(180deg,#AFD8E8 0%,#E6F1E8 60%,#FBF3EE 100%)", starsOpacity: 0, label: "Morning", color: "#22301F", headlineFallback: "Clear skies, calm focus.", body: "Light, unhurried, wide awake." },
  { end: 15, sky: "linear-gradient(180deg,#5AA7D6 0%,#9AD1E6 55%,#E9F5EE 100%)", starsOpacity: 0, label: "Midday", color: "#122633", headlineFallback: "Full sun, full energy.", body: "The most vivid hour of the theme." },
  { end: 17.5, sky: "linear-gradient(180deg,#7FB6D9 0%,#CDE0DE 55%,#F3ECD8 100%)", starsOpacity: 0, label: "Afternoon", color: "#2E2412", headlineFallback: "Light softens, shadows stretch long.", body: "A quieter kind of brightness." },
  { end: 19.5, sky: "linear-gradient(180deg,#C8556B 0%,#E08A3C 45%,#F6C98A 100%)", starsOpacity: 0.15, label: "Sunset", color: "#3A1B10", headlineFallback: "The sky puts on a show.", body: "Lanterns would feel right about now." },
  { end: 21, sky: "linear-gradient(180deg,#241B3D 0%,#5B2A6E 45%,#D46A3C 100%)", starsOpacity: 0.6, label: "Dusk", color: "#F3E7EC", headlineFallback: "Neon begins to hum as the sky goes violet.", body: "The night collection wakes up." },
  { end: 24.01, sky: "linear-gradient(180deg,#0B0E23 0%,#181C3A 55%,#241E3D 100%)", starsOpacity: 1, label: "Night", color: "#EDE7F6", headlineFallback: "The world rests under a quiet indigo sky.", body: "Stillness for late thoughts." },
];

export function getPhase(hourFloat: number): Phase {
  for (const p of phases) {
    if (hourFloat < p.end) return p;
  }
  return phases[phases.length - 1];
}

export function isDaytime(hourFloat: number): boolean {
  return hourFloat >= 5 && hourFloat <= 19;
}
