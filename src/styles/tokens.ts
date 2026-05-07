export const colors = {
  ink: "#1a1410",
  muted: "#665949",
  red: "#a64232",
  border: "rgba(45,35,24,0.18)",
  paper: "#c0bab0",
  paperWarm: "#c8bdab",
  rodGradient:
    "linear-gradient(90deg, #4f3218, #9b6b34 18%, #d0aa69 48%, #8b5c2c 82%, #4a2f17)",
} as const;

// Single source of truth for all scroll/vortex motion.
// Open and close share one duration so the scroll feels symmetric.
export const motion = {
  scrollMs: 540,
  vortexMs: 540,
  ease: "cubic-bezier(0.22,1,0.36,1)",
} as const;

export const fonts = {
  body: '"Inter Variable", "PingFang SC", "Hiragino Sans GB", ui-sans-serif, sans-serif',
  // Latin → Georgia; CJK → Ma Shan Zheng (running-script).
  serif: 'Georgia, "Ma Shan Zheng", "STKaiti", "KaiTi", "Times New Roman", serif',
  // Display font for hotspot labels and section titles. Cormorant Garamond italic
  // gives a hand-lettered, ink-and-quill feel that pairs with the painting backdrop.
  display:
    '"Cormorant Garamond", "Ma Shan Zheng", "STKaiti", "KaiTi", Georgia, serif',
} as const;
