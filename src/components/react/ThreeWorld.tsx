import { useEffect, useMemo, useState } from "react";
import { colors, fonts } from "../../styles/tokens";
import { strings } from "../../content/profile";

export type SectionId = "about" | "research" | "projects" | "fun";
type Vec3 = [number, number, number];

type Hotspot = {
  id: SectionId;
  pos: Vec3;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const PAVILION_DATA: Hotspot[] = [
  { id: "research", pos: [-3, 0, -6], label: "Research", x: 25, y: 41, w: 12, h: 13 },
  { id: "projects", pos: [4, 0, -8], label: "Projects", x: 80, y: 43, w: 14, h: 15 },
  { id: "fun", pos: [0, 0, -10], label: "Fun", x: 52, y: 41, w: 14, h: 15 },
];

const INTRO_LABEL = { id: "about" as const, label: "Intro", x: 46, y: 77, w: 24, h: 18 };
export const INTRO_FOCUS_POS: Vec3 = [0, 0, 2];

type FocusTarget = { x: number; y: number; pos: Vec3 };
const FOCUS_POOL: FocusTarget[] = [
  ...PAVILION_DATA.map((p) => ({ x: p.x, y: p.y, pos: p.pos })),
  { x: INTRO_LABEL.x, y: INTRO_LABEL.y, pos: INTRO_FOCUS_POS },
];
const ART_URL = "/art/ink-landscape-main.png";
const ASPECT = 16 / 9;

function getCoverSize(viewport: { w: number; h: number }) {
  if (viewport.w / viewport.h > ASPECT) return { w: viewport.w, h: viewport.w / ASPECT };
  return { w: viewport.h * ASPECT, h: viewport.h };
}

export default function ThreeWorld({
  approachPos,
  onSelectPavilion,
  onReturnIntro,
  labelsVisible,
}: {
  approachPos: Vec3 | null;
  onSelectPavilion: (id: SectionId, screenPos: { x: number; y: number }) => void;
  onReturnIntro: (screenPos: { x: number; y: number }) => void;
  labelsVisible: boolean;
}) {
  const t = strings;
  const [viewport, setViewport] = useState({ w: 1440, h: 900 });
  const [hovered, setHovered] = useState<SectionId | "about" | null>(null);
  const [focusOrigin, setFocusOrigin] = useState<FocusTarget | null>(null);

  const focused = useMemo(
    () => FOCUS_POOL.find((t) => approachPos && t.pos.every((v, i) => Math.abs(v - approachPos[i]) < 0.01)),
    [approachPos]
  );

  useEffect(() => {
    const syncSize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    syncSize();
    window.addEventListener("resize", syncSize);
    return () => window.removeEventListener("resize", syncSize);
  }, []);

  useEffect(() => {
    if (focused) setFocusOrigin(focused);
  }, [focused]);

  const base = getCoverSize(viewport);
  const artLeft = (viewport.w - base.w) / 2;
  const artTop = (viewport.h - base.h) / 2;
  const origin = focused ?? focusOrigin;

  return (
    <div style={styles.root}>
      <div style={styles.backdropArt} />
      <div
        style={{
          ...styles.stage,
          left: `${artLeft}px`,
          top: `${artTop}px`,
          width: `${base.w}px`,
          height: `${base.h}px`,
          transformOrigin: origin ? `${origin.x}% ${origin.y}%` : "50% 50%",
          transform: focused ? "scale(1.18)" : "scale(1)",
        }}
      >
        <div style={styles.art} />
        <div style={styles.artVeil} />
        <div style={styles.paperTone} />
        <div style={styles.mistBack} />
        <div style={styles.mistFront} />
        <div style={styles.vignette} />

        {labelsVisible &&
          PAVILION_DATA.map((p) => {
            const label = t.pavilions[p.id as Exclude<SectionId, "about">];
            return (
              <button
                key={p.id}
                aria-label={label}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  onSelectPavilion(p.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                }}
                onPointerEnter={() => setHovered(p.id)}
                onPointerLeave={() => setHovered(null)}
                style={{
                  ...styles.hotspot,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.w}%`,
                  height: `${p.h}%`,
                  transform: `translate(-50%, -50%) scale(${hovered === p.id ? 1.04 : 1})`,
                }}
              >
                <span style={{ ...styles.label, opacity: hovered === p.id ? 1 : 0.94 }}>{label}</span>
              </button>
            );
          })}

        {labelsVisible && (
          <button
            aria-label={t.pavilions.intro}
            onClick={(event) => onReturnIntro({ x: event.clientX, y: event.clientY })}
            onPointerEnter={() => setHovered("about")}
            onPointerLeave={() => setHovered(null)}
            style={{
              ...styles.returnZone,
              transform: `scale(${hovered === "about" ? 1.04 : 1})`,
            }}
          >
            <span style={{ ...styles.label, ...styles.introLabel, opacity: hovered === "about" ? 1 : 0.94 }}>
              {t.pavilions.intro}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "fixed",
    inset: 0,
    overflow: "hidden",
    background: colors.paperWarm,
    fontFamily: fonts.serif,
  },
  backdropArt: {
    position: "absolute",
    inset: "-8%",
    backgroundImage: `url(${ART_URL})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    filter: "blur(24px)",
    opacity: 0.32,
    transform: "scale(1.06)",
  },
  stage: {
    position: "absolute",
    overflow: "hidden",
    transformOrigin: "50% 50%",
    transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
    boxShadow: "0 0 90px rgba(50, 38, 24, 0.12)",
  },
  art: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${ART_URL})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    filter: "sepia(0.1) saturate(1.05) brightness(1.02)",
  },
  artVeil: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 1,
    background:
      "radial-gradient(circle at 52% 38%, rgba(246,232,190,0.22), rgba(242,224,178,0.12) 34%, transparent 68%), linear-gradient(90deg, rgba(244,226,177,0.11), rgba(245,229,184,0.2), rgba(244,226,177,0.1))",
    backdropFilter: "blur(0.65px)",
  },
  paperTone: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 2,
    background:
      "radial-gradient(circle at 50% 57%, rgba(255,246,217,0.06), transparent 30%), linear-gradient(90deg, rgba(47,36,22,0.08), transparent 22%, transparent 76%, rgba(47,36,22,0.1))",
    mixBlendMode: "multiply",
  },
  mistBack: {
    position: "absolute",
    left: "-18%",
    right: "-18%",
    top: "27%",
    height: "26%",
    pointerEvents: "none",
    zIndex: 2,
    background:
      "linear-gradient(90deg, transparent, rgba(242,232,202,0.36), rgba(242,232,202,0.16), transparent)",
    filter: "blur(30px)",
  },
  mistFront: {
    position: "absolute",
    left: "-22%",
    right: "-22%",
    bottom: 0,
    height: "36%",
    pointerEvents: "none",
    zIndex: 2,
    background:
      "linear-gradient(90deg, rgba(235,226,197,0), rgba(239,228,196,0.42), rgba(239,228,196,0.24), rgba(235,226,197,0))",
    filter: "blur(36px)",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 2,
    background:
      "radial-gradient(circle at 50% 52%, transparent 42%, rgba(36,28,19,0.16) 100%), linear-gradient(0deg, rgba(45,35,24,0.16), transparent 28%, transparent 82%, rgba(255,248,226,0.12))",
  },
  hotspot: {
    position: "absolute",
    zIndex: 4,
    border: 0,
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    transition: "transform 200ms ease",
  },
  label: {
    position: "absolute",
    left: "50%",
    bottom: "-0.05rem",
    transform: "translateX(-50%)",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.26rem",
    padding: "0.04rem 0.1rem",
    pointerEvents: "none",
    color: "rgba(31,24,18,0.94)",
    fontFamily: fonts.display,
    fontSize: "clamp(1rem, 1.25vw, 1.25rem)",
    fontStyle: "italic",
    fontWeight: 500,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    textShadow: "0 1px 0 rgba(246,238,219,0.95), 0 0 10px rgba(238,229,207,0.92)",
    transition: "opacity 180ms ease",
  },
  introLabel: {
    left: "50%",
    bottom: "42%",
  },
  returnZone: {
    position: "absolute",
    left: `${INTRO_LABEL.x - INTRO_LABEL.w / 2}%`,
    top: `${INTRO_LABEL.y - INTRO_LABEL.h / 2}%`,
    width: `${INTRO_LABEL.w}%`,
    height: `${INTRO_LABEL.h}%`,
    zIndex: 3,
    border: 0,
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    transformOrigin: "50% 50%",
    transition: "transform 200ms ease",
  },
};
