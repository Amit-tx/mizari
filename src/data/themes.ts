export type Particle = "petal" | "firefly" | "none";
export type Mood = "calm" | "warm" | "dark" | "energetic";

export interface JapanTheme {
  slug: string;
  name: string;
  tags: Mood[];
  art: string; // fallback gradient for card thumbnail
  particle: Particle;
  headline: string;
  price: string;
  cat: "japan";
}

export interface AnimeReactivePhase {
  end: number; // hour (0-24.01) this phase ends at
  sky: string;
  starsOpacity: number;
  celestial: "orb" | "none";
  celestialColor: [string, string]; // [core, glow] hex colors
  label: string;
  headline: string;
  body: string;
  text: string;
  accent: string;
  particle: { kind: "orb" | "leaf" | "none"; color?: string };
}

export interface AnimeTheme {
  slug: string;
  name: string;
  tags: string[];
  art: string;
  price: string;
  cat: "anime";
  /** If present, this theme gets a full time-of-day reactive preview
   *  (own color science + particles) instead of the static gradient. */
  reactivePhases?: AnimeReactivePhase[];
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const japanRaw: Omit<JapanTheme, "slug" | "cat">[] = [
  { name: "Sakura Dream", tags: ["calm"], art: "linear-gradient(160deg,#F6C9D3,#E8A0AF 45%,#C6607A)", particle: "petal", headline: "Wake gently, like sunlight through paper screens.", price: "Free" },
  { name: "Fuji Sunset", tags: ["warm"], art: "linear-gradient(180deg,#F6B99A,#E08A3C 55%,#7A2E1E)", particle: "petal", headline: "Momiji red, matsuri gold — the sky puts on a show.", price: "₹99" },
  { name: "Fuji Golden Dawn", tags: ["calm"], art: "linear-gradient(180deg,#FCE3D6,#F6B99A 55%,#C6607A)", particle: "petal", headline: "The first blush before sunrise.", price: "₹99" },
  { name: "Kyoto Rain", tags: ["calm"], art: "linear-gradient(160deg,#7C8B96,#4E5C68 55%,#232C33)", particle: "firefly", headline: "Soft rain over old rooftops.", price: "₹129" },
  { name: "Kyoto Night", tags: ["dark"], art: "linear-gradient(160deg,#181C3A,#241E3D 60%,#0B0E23)", particle: "firefly", headline: "Lantern light on quiet stone streets.", price: "₹129" },
  { name: "Gion Night", tags: ["dark"], art: "linear-gradient(150deg,#2A1B3D,#5B2A6E 50%,#D46A3C)", particle: "firefly", headline: "Silk and shadow in the geisha district.", price: "₹149" },
  { name: "Neon Tokyo", tags: ["energetic"], art: "linear-gradient(150deg,#1A1030,#3A1750 40%,#8B1E6F 80%,#E14C9E)", particle: "firefly", headline: "Neon begins to hum as the sky goes violet.", price: "₹149" },
  { name: "Cyber Tokyo", tags: ["energetic"], art: "linear-gradient(150deg,#0B0E23,#241E3D 40%,#00E5C7 100%)", particle: "firefly", headline: "Glass towers, glowing signs, electric hum.", price: "₹149" },
  { name: "Torii Gate", tags: ["warm"], art: "linear-gradient(160deg,#B23B32,#7C231E 55%,#3A1210)", particle: "petal", headline: "Step through vermilion into something sacred.", price: "₹99" },
  { name: "Moon Shrine", tags: ["dark"], art: "linear-gradient(160deg,#181C3A,#3A2140 55%,#0B0E23)", particle: "firefly", headline: "Moonlight on old wood and stone steps.", price: "₹129" },
  { name: "Bamboo Forest", tags: ["calm"], art: "linear-gradient(160deg,#3E5C3E,#274B2E 55%,#132A17)", particle: "firefly", headline: "Green light filtered through a thousand stalks.", price: "₹99" },
  { name: "Bamboo Moonlight", tags: ["dark"], art: "linear-gradient(160deg,#1E2E24,#0F1C16 55%,#0A130D)", particle: "firefly", headline: "Silver light between the green.", price: "₹99" },
  { name: "Samurai Sunset", tags: ["warm"], art: "linear-gradient(160deg,#B4552A,#7A2E1E 55%,#241B1E)", particle: "petal", headline: "A blade catches the last of the light.", price: "₹149" },
  { name: "Dark Samurai", tags: ["dark"], art: "linear-gradient(160deg,#1B1B1F,#3A2E1B 50%,#0B0908)", particle: "firefly", headline: "Discipline in the dark, honor in the quiet.", price: "₹149" },
  { name: "Kitsune Spirit", tags: ["warm"], art: "linear-gradient(160deg,#E08A3C,#B4552A 55%,#3A1B10)", particle: "petal", headline: "Nine tails, one trickster spirit.", price: "₹129" },
  { name: "Lantern Festival", tags: ["warm"], art: "linear-gradient(150deg,#241B3D,#8B3A2E 55%,#E08A3C)", particle: "firefly", headline: "Ten thousand lanterns lifting into the dark.", price: "₹149" },
  { name: "Zen Garden", tags: ["calm"], art: "linear-gradient(160deg,#E9E4D8,#CBC3AE 50%,#9B9074)", particle: "petal", headline: "Raked sand, still water, quiet mind.", price: "Free" },
  { name: "Koi Pond", tags: ["calm"], art: "linear-gradient(160deg,#274B4A,#3A6B63 50%,#1B2E2C)", particle: "firefly", headline: "Orange shapes moving under green water.", price: "₹99" },
  { name: "Autumn Japan", tags: ["warm"], art: "linear-gradient(160deg,#7A2E1E,#B4552A 45%,#E08A3C)", particle: "petal", headline: "Every leaf a small, deliberate fire.", price: "₹99" },
  { name: "Winter Fuji", tags: ["calm"], art: "linear-gradient(180deg,#DCE7EF,#B9CDDD 45%,#5E7A93)", particle: "firefly", headline: "Snow on the mountain, stillness in the air.", price: "₹129" },
  { name: "Hokusai Wave", tags: ["energetic"], art: "linear-gradient(160deg,#1E5A7A,#2C6E8E 50%,#0B2E42)", particle: "firefly", headline: "A great wave, frozen mid-motion.", price: "₹149" },
  { name: "Firefly Village", tags: ["calm"], art: "linear-gradient(160deg,#1B2E2C,#0F1C16 55%,#070E0A)", particle: "firefly", headline: "Small lights, big quiet.", price: "₹99" },
  { name: "Edo Street", tags: ["warm"], art: "linear-gradient(160deg,#B7873F,#7A5A2E 55%,#3A2A16)", particle: "petal", headline: "Lanterns, wooden signs, footsteps on stone.", price: "₹99" },
  { name: "Aurora Fuji", tags: ["dark"], art: "linear-gradient(160deg,#0B0E23,#1E5A4A 50%,#3A2140)", particle: "firefly", headline: "Northern light over a southern mountain.", price: "₹149" },
  { name: "Ink Wash Japan", tags: ["calm"], art: "linear-gradient(160deg,#E9E4D8,#8A8578 55%,#3A3630)", particle: "none", headline: "Everything said in a single brushstroke.", price: "Free" },
];

const foxSpiritPhases: AnimeReactivePhase[] = [
  {
    end: 5,
    sky: "linear-gradient(180deg,#0D0D1A 0%,#C83E00 50%,#1A0A00 100%)",
    starsOpacity: 1,
    celestial: "orb",
    celestialColor: ["#8B0000", "rgba(255,0,0,0.6)"],
    label: "Fox Spirit Night",
    headline: "The fox spirit's energy leaks... feel the power.",
    body: "Even shadows hold power. Rest now, warrior.",
    text: "#FF6B00",
    accent: "#C83E00",
    particle: { kind: "orb", color: "#FF4500" },
  },
  {
    end: 8,
    sky: "linear-gradient(180deg,#1A1A2E 0%,#E94560 40%,#FF9A3C 100%)",
    starsOpacity: 0.3,
    celestial: "orb",
    celestialColor: ["#0040FF", "rgba(0,128,255,0.6)"],
    label: "Training Dawn",
    headline: "Wake up. The ninja way waits for no one.",
    body: "Training starts before sunrise. This is the ninja way.",
    text: "#FFE4C4",
    accent: "#FF6B00",
    particle: { kind: "orb", color: "#00BFFF" },
  },
  {
    end: 17,
    sky: "linear-gradient(180deg,#FF6B00 0%,#FF9A3C 40%,#87CEEB 100%)",
    starsOpacity: 0,
    celestial: "orb",
    celestialColor: ["#0040FF", "rgba(0,128,255,0.6)"],
    label: "Hidden Leaf Day",
    headline: "Dat-te-bayo! The village is alive.",
    body: "Ichiraku Ramen tastes best at noon. Believe it!",
    text: "#1A0A00",
    accent: "#FF6B00",
    particle: { kind: "leaf", color: "#2E8B57" },
  },
  {
    end: 20,
    sky: "linear-gradient(180deg,#C83E00 0%,#FF6B00 50%,#2C1810 100%)",
    starsOpacity: 0.4,
    celestial: "orb",
    celestialColor: ["#8B0000", "rgba(255,0,0,0.6)"],
    label: "Will of Fire",
    headline: "Hard work is worthless for those that don't believe in themselves.",
    body: "The Will of Fire burns brightest at dusk.",
    text: "#FFDAB9",
    accent: "#C83E00",
    particle: { kind: "orb", color: "#FF4500" },
  },
  {
    end: 24.01,
    sky: "linear-gradient(180deg,#0D0D1A 0%,#C83E00 50%,#1A0A00 100%)",
    starsOpacity: 1,
    celestial: "orb",
    celestialColor: ["#8B0000", "rgba(255,0,0,0.6)"],
    label: "Fox Spirit Night",
    headline: "The fox spirit's energy leaks... feel the power.",
    body: "Even shadows hold power. Rest now, warrior.",
    text: "#FF6B00",
    accent: "#C83E00",
    particle: { kind: "orb", color: "#FF4500" },
  },
];

const animeRaw: Omit<AnimeTheme, "slug" | "cat">[] = [
  { name: "Ninja Way", tags: ["shonen"], art: "linear-gradient(155deg,#1B1B1F,#3A2E1B 45%,#E8781F)", price: "₹149", reactivePhases: foxSpiritPhases },
  { name: "Power Level", tags: ["shonen"], art: "linear-gradient(155deg,#0B2E42,#1E5A7A 45%,#E8B62A)", price: "₹149" },
  { name: "Grand Voyage", tags: ["shonen"], art: "linear-gradient(155deg,#0B2E5A,#1E7ABE 45%,#E8C22A)", price: "₹149" },
  { name: "Crimson Blade", tags: ["shonen"], art: "linear-gradient(155deg,#0B0E23,#241E3D 45%,#8B1E1E)", price: "₹179" },
  { name: "Cursed Technique", tags: ["dark"], art: "linear-gradient(155deg,#0B0B0F,#241E3D 45%,#5B2A6E)", price: "₹179" },
  { name: "Beyond the Walls", tags: ["dark"], art: "linear-gradient(155deg,#241B1E,#4A2E1B 45%,#8B3A1E)", price: "₹179" },
  { name: "Plus Ultra Hero", tags: ["shonen"], art: "linear-gradient(155deg,#0B1E3D,#1E4A8B 45%,#D4222E)", price: "₹149" },
  { name: "Hunter's Exam", tags: ["shonen"], art: "linear-gradient(155deg,#1B2E1B,#3A6B2E 45%,#8B9B2E)", price: "₹149" },
  { name: "Masked City", tags: ["dark"], art: "linear-gradient(155deg,#0B0B0F,#3A1010 45%,#8B1E1E)", price: "₹149" },
  { name: "Silent Verdict", tags: ["dark"], art: "linear-gradient(155deg,#0B0B0F,#241E1E 45%,#8B1E1E)", price: "₹149" },
  { name: "Full Dive", tags: ["isekai"], art: "linear-gradient(155deg,#0B1E3D,#1E4A8B 45%,#4AC2E8)", price: "₹149" },
  { name: "Grimoire Knight", tags: ["shonen"], art: "linear-gradient(155deg,#0B0B0F,#241E3D 45%,#2E4A8B)", price: "₹149" },
  { name: "Shadow Ascension", tags: ["dark"], art: "linear-gradient(155deg,#0B0B14,#1E1E3D 45%,#5A2EE8)", price: "₹179" },
  { name: "Devil Hunter", tags: ["dark"], art: "linear-gradient(155deg,#0B0B0F,#3A1010 45%,#E8781F)", price: "₹179" },
  { name: "Secret Family", tags: ["slice"], art: "linear-gradient(155deg,#2E1B3D,#5B2A6E 45%,#E8A0AF)", price: "₹129" },
  { name: "Match Point", tags: ["shonen"], art: "linear-gradient(155deg,#0B1E3D,#1E4A8B 45%,#E8781F)", price: "₹129" },
  { name: "Striker's Cage", tags: ["shonen"], art: "linear-gradient(155deg,#0B0B0F,#1E1E3D 45%,#2E5AE8)", price: "₹129" },
  { name: "Bizarre Stand", tags: ["shonen"], art: "linear-gradient(155deg,#5B1E8B,#2E4A8B 45%,#E8C22A)", price: "₹149" },
  { name: "Moonlight Guardian", tags: ["shojo"], art: "linear-gradient(155deg,#1E1E5B,#5B2A8B 45%,#E8A0C2)", price: "₹129" },
  { name: "Unit Pilot", tags: ["dark"], art: "linear-gradient(155deg,#0B0B0F,#3A1010 45%,#8B1E1E)", price: "₹149" },
  { name: "Space Bounty", tags: ["isekai"], art: "linear-gradient(155deg,#1B2E3D,#4A5A6E 45%,#E8781F)", price: "₹129" },
  { name: "Rebel Command", tags: ["dark"], art: "linear-gradient(155deg,#0B0B0F,#3A1010 45%,#2E1E8B)", price: "₹149" },
  { name: "Black Swordsman", tags: ["dark"], art: "linear-gradient(155deg,#0B0B0F,#241E1E 45%,#5B1E1E)", price: "₹149" },
  { name: "Second Chance", tags: ["isekai"], art: "linear-gradient(155deg,#1E1E3D,#5B2A6E 45%,#E8A0AF)", price: "₹129" },
  { name: "Throne of Bones", tags: ["isekai", "dark"], art: "linear-gradient(155deg,#0B0B0F,#241E1E 45%,#8B1E1E)", price: "₹149" },
  { name: "One Hit Hero", tags: ["shonen"], art: "linear-gradient(155deg,#1E1E3D,#E8C22A 55%,#E8781F)", price: "₹129" },
  { name: "Psychic Overflow", tags: ["shonen"], art: "linear-gradient(155deg,#1E1E3D,#5B2A8B 45%,#E8A0C2)", price: "₹129" },
  { name: "Wandering Mage", tags: ["isekai", "calm"], art: "linear-gradient(155deg,#3E5C3E,#8B9B6E 45%,#E8E4C2)", price: "₹149" },
  { name: "Dark Fantasy Realm", tags: ["dark"], art: "linear-gradient(155deg,#0B0B0F,#241E1E 45%,#3A1B1B)", price: "₹129" },
  { name: "Mecha Pilot", tags: ["shonen"], art: "linear-gradient(155deg,#1B1E24,#4A5A6E 45%,#2EE8C2)", price: "₹149" },
];

export const japanThemes: JapanTheme[] = japanRaw.map((t) => ({ ...t, slug: slugify(t.name), cat: "japan" }));

/* ---- Auto-generate a day/night cycle for every anime theme that ----
   ---- doesn't already have a hand-crafted one (hand-crafted, reactive ones).    ---- */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
function mix(hexA: string, hexB: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(hexA);
  const [br, bg, bb] = hexToRgb(hexB);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}
function extractAccent(gradient: string): string {
  const matches = gradient.match(/#[0-9a-fA-F]{6}/g) || ["#8B5CF6"];
  return matches[matches.length - 1];
}
function readableText(bgHex: string): string {
  const [r, g, b] = hexToRgb(bgHex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1A1410" : "#F5EFE8";
}

export function buildAutoPhases(seriesName: string, accent: string): AnimeReactivePhase[] {
  const black = "#0A0A0F";
  const white = "#FAF6EE";
  const nightSky = `linear-gradient(180deg, ${mix(black, accent, 0.18)} 0%, ${mix(black, accent, 0.32)} 55%, ${black} 100%)`;
  const dawnSky = `linear-gradient(180deg, ${mix(accent, white, 0.55)} 0%, ${mix(accent, black, 0.1)} 45%, ${mix(black, accent, 0.25)} 100%)`;
  const daySky = `linear-gradient(180deg, ${mix(accent, white, 0.7)} 0%, ${mix(accent, white, 0.45)} 55%, ${mix(accent, white, 0.2)} 100%)`;
  const duskSky = `linear-gradient(180deg, ${mix(accent, black, 0.15)} 0%, ${accent} 45%, ${mix(accent, black, 0.55)} 100%)`;

  const dayText = readableText(mix(accent, white, 0.55));
  const nightText = readableText(mix(black, accent, 0.25));

  return [
    { end: 5, sky: nightSky, starsOpacity: 1, celestial: "orb", celestialColor: [mix(accent, black, 0.3), `${accent}99`], label: `${seriesName} · Night`, headline: "The world sleeps. The story doesn't stop.", body: "Quiet hours, same universe.", text: nightText, accent, particle: { kind: "orb", color: accent } },
    { end: 8, sky: dawnSky, starsOpacity: 0.35, celestial: "orb", celestialColor: [mix(accent, white, 0.3), `${accent}99`], label: `${seriesName} · Dawn`, headline: "First light. The story picks back up.", body: "A new arc begins with every sunrise.", text: nightText, accent, particle: { kind: "orb", color: accent } },
    { end: 17, sky: daySky, starsOpacity: 0, celestial: "orb", celestialColor: [mix(accent, white, 0.3), `${accent}99`], label: `${seriesName} · Day`, headline: "Full color, full energy — peak hours.", body: "The theme at its brightest and boldest.", text: dayText, accent, particle: { kind: "orb", color: accent } },
    { end: 20, sky: duskSky, starsOpacity: 0.3, celestial: "orb", celestialColor: [mix(accent, black, 0.2), `${accent}99`], label: `${seriesName} · Dusk`, headline: "Shadows lengthen. Tension rises.", body: "The mood deepens as light fades.", text: nightText, accent, particle: { kind: "orb", color: accent } },
    { end: 24.01, sky: nightSky, starsOpacity: 1, celestial: "orb", celestialColor: [mix(accent, black, 0.3), `${accent}99`], label: `${seriesName} · Night`, headline: "The world sleeps. The story doesn't stop.", body: "Quiet hours, same universe.", text: nightText, accent, particle: { kind: "orb", color: accent } },
  ];
}

export const animeThemes: AnimeTheme[] = animeRaw.map((t) => {
  const slug = slugify(t.name);
  if (t.reactivePhases) return { ...t, slug, cat: "anime" };
  const seriesName = t.name.replace(/ Theme$/, "");
  const accent = extractAccent(t.art);
  return { ...t, slug, cat: "anime", reactivePhases: buildAutoPhases(seriesName, accent) };
});

export type AnyTheme = JapanTheme | AnimeTheme;
export const allThemes: AnyTheme[] = [...japanThemes, ...animeThemes];
