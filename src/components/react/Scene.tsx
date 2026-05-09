import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
} from "react";
import ThreeWorld, { PAVILION_DATA, INTRO_FOCUS_POS, type SectionId } from "./ThreeWorld";
import VortexTransition from "./VortexTransition";
import { research } from "../../content/research";
import { funItems } from "../../content/fun";
import { manualProjects } from "../../content/projects";
import { strings as t, identity, skills } from "../../content/profile";
import { colors, fonts, motion } from "../../styles/tokens";

type Vec3 = [number, number, number];
type Phase = "intro" | "introVortex" | "idle" | "vortex" | "content" | "contentClosing" | "returnIntroVortex";

const SCROLL_BACKGROUND =
  "radial-gradient(circle at 22% 18%, rgba(255,250,230,0.55), transparent 28%), radial-gradient(circle at 79% 83%, rgba(123,84,42,0.12), transparent 32%), linear-gradient(90deg, rgba(91,56,25,0.16), rgba(255,250,230,0.2) 12%, transparent 22%, transparent 78%, rgba(255,250,230,0.16) 88%, rgba(91,56,25,0.14)), rgba(236,225,200,0.9)";
const SCROLL_SHADOW = "0 38px 120px rgba(35,27,17,0.36), inset 0 0 56px rgba(116,82,41,0.13)";

const ANIM_OPEN_SHEET = `scrollUnfurl ${motion.scrollMs}ms ${motion.ease}`;
const ANIM_CLOSE_SHEET = `scrollIntoInk ${motion.scrollMs}ms ${motion.ease} forwards`;
const ANIM_OPEN_ROD_TOP = `scrollRodTopOpen ${motion.scrollMs}ms ${motion.ease}`;
const ANIM_CLOSE_ROD_TOP = `scrollRodTopClose ${motion.scrollMs}ms ${motion.ease} forwards`;
const ANIM_OPEN_ROD_BOTTOM = `scrollRodBottomOpen ${motion.scrollMs}ms ${motion.ease}`;
const ANIM_CLOSE_ROD_BOTTOM = `scrollRodBottomClose ${motion.scrollMs}ms ${motion.ease} forwards`;

function ScrollPanel({
  closing = false,
  compact = false,
  children,
  onClose,
}: {
  closing?: boolean;
  compact?: boolean;
  children: JSX.Element;
  onClose?: (center: { x: number; y: number }) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetMotion = closing ? styles.scrollSheetClosing : styles.scrollSheetOpening;
  const topRodMotion = closing ? styles.scrollRodTopClosing : styles.scrollRodTopOpening;
  const bottomRodMotion = closing ? styles.scrollRodBottomClosing : styles.scrollRodBottomOpening;

  const closeFromPanel = useCallback(() => {
    const rect = panelRef.current?.getBoundingClientRect();
    onClose?.(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    );
  }, [onClose]);

  useEffect(() => {
    if (!onClose || closing) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFromPanel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeFromPanel, closing, onClose]);

  // Compute the rod's center-to-rest distance once per panel so the
  // rod keyframes can translateY by the right pixel amount.
  // Rod rests at top:1.1rem with height 0.68rem, so its center sits at
  // 1.1rem + 0.34rem from the panel edge.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const offset = panel.offsetHeight / 2 - (1.1 + 0.34) * rem;
    panel.style.setProperty("--rod-offset", `${Math.max(offset, 0)}px`);
  }, []);

  return (
    <div
      style={{ ...styles.modalBackdrop, ...(closing ? styles.modalBackdropClosing : undefined) }}
      onClick={(event) => {
        if (onClose && !closing && event.target === event.currentTarget) closeFromPanel();
      }}
    >
      <div
        ref={panelRef}
        style={{
          ...styles.scrollPanel,
          ...(compact ? styles.introPanel : styles.contentPanel),
          ...(closing ? styles.scrollPanelClosing : undefined),
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ ...styles.scrollPaper, ...sheetMotion }} />
        <div style={{ ...styles.scrollTexture, ...sheetMotion }} />
        <div style={{ ...styles.scrollEdgeLeft, ...sheetMotion }} />
        <div style={{ ...styles.scrollEdgeRight, ...sheetMotion }} />
        <div style={{ ...styles.scrollRodTop, ...topRodMotion }} />
        <div style={{ ...styles.scrollInner, ...sheetMotion }}>
          {children}
        </div>
        <div style={{ ...styles.scrollRodBottom, ...bottomRodMotion }} />
      </div>
    </div>
  );
}

function IntroScroll({
  closing = false,
  onClose,
}: {
  closing?: boolean;
  onClose: (center: { x: number; y: number }) => void;
}) {
  const handleEnter = () => {
    onClose({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  };
  return (
    <ScrollPanel compact closing={closing} onClose={onClose}>
      <>
        <img src={identity.portrait} alt={identity.name} style={styles.portrait} />
        <p style={styles.eyebrow}>{t.eyebrow}</p>
        <h1 style={styles.introTitle}>{identity.name}</h1>
        <p style={styles.introBody}>{t.intro}</p>
        <div style={styles.linkRow}>
          <a style={styles.scrollLink} href={`mailto:${identity.email}`}>Email</a>
          <a style={styles.scrollLink} href={identity.github} target="_blank" rel="noopener">GitHub</a>
          <a style={styles.scrollLink} href={identity.resume} target="_blank" rel="noopener">Resume</a>
        </div>
        <button type="button" style={styles.enterButton} onClick={handleEnter} disabled={closing} aria-label={t.enter}>
          <span style={styles.enterText}>{t.enter}</span>
        </button>
      </>
    </ScrollPanel>
  );
}

function AboutContent() {
  return (
    <>
      {t.aboutParagraphs.map((para, i) => (
        <p key={i} style={styles.body}>{para}</p>
      ))}
      <Divider />
      <Label>{t.skills}</Label>
      <div style={styles.chipWrap}>
        {skills.map((skill) => (
          <Chip key={skill}>{skill}</Chip>
        ))}
      </div>
    </>
  );
}

function Card({
  title,
  meta,
  subtitle,
  body,
  tags,
  href,
}: {
  title: string;
  meta?: string;
  subtitle?: string;
  body?: string | null;
  tags?: string[];
  href?: string;
}) {
  const inner = (
    <>
      <div style={styles.cardTop}>
        <p style={styles.cardTitle}>{title}</p>
        {meta && <span style={styles.cardTime}>{meta}</span>}
      </div>
      {subtitle && <p style={styles.cardMeta}>{subtitle}</p>}
      {body && <p style={styles.cardBody}>{body}</p>}
      {tags && tags.length > 0 && (
        <div style={styles.chipWrap}>
          {tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      )}
    </>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener" style={{ ...styles.card, ...styles.cardLink }}>
        {inner}
      </a>
    );
  }
  return <div style={styles.card}>{inner}</div>;
}

function CardStack({ children }: { children: React.ReactNode }) {
  return <div style={styles.stack}>{children}</div>;
}

function ResearchContent() {
  return (
    <CardStack>
      {research.map((item) => (
        <Card
          key={item.id}
          title={item.lab}
          meta={item.period}
          subtitle={`${item.role} / ${item.institution} / ${item.location}`}
          body={item.summary}
          tags={item.tags}
        />
      ))}
    </CardStack>
  );
}

function ProjectsContent() {
  return (
    <CardStack>
      {manualProjects.map((p) => (
        <Card
          key={p.id}
          title={p.title}
          meta={p.period}
          subtitle={p.subtitle}
          body={p.body}
          href={p.href}
        />
      ))}
    </CardStack>
  );
}

function FunContent() {
  return (
    <CardStack>
      {funItems.map((item) => (
        <Card key={item.title} title={item.title} body={item.description} />
      ))}
    </CardStack>
  );
}

function Divider() {
  return (
    <div style={styles.divider}>
      <span style={styles.dividerLine} />
      <span style={styles.dividerSeal} />
      <span style={styles.dividerLine} />
    </div>
  );
}

function Label({ children }: { children: string }) {
  return <p style={styles.labelText}>{children}</p>;
}

function Chip({ children }: { children: string }) {
  return <span style={styles.chip}>{children}</span>;
}

const CONTENT: Record<SectionId, () => JSX.Element> = {
  about: AboutContent,
  research: ResearchContent,
  projects: ProjectsContent,
  fun: FunContent,
};

function ContentScroll({
  section,
  closing,
  onClose,
}: {
  section: SectionId;
  closing: boolean;
  onClose: (center: { x: number; y: number }) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const meta = t.sectionMeta[section];
  const Content = CONTENT[section];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [section]);

  return (
    <ScrollPanel closing={closing} onClose={onClose}>
      <>
        <header style={styles.contentHeader}>
          <h2 style={styles.contentTitle}>{meta.title}</h2>
        </header>
        <div ref={scrollRef} style={styles.scrollBody}>
          <Content />
        </div>
      </>
    </ScrollPanel>
  );
}

export default function Scene() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [section, setSection] = useState<SectionId>("about");
  const [vortexCenter, setVortexCenter] = useState({ x: 0, y: 0 });
  const [approachPos, setApproachPos] = useState<Vec3 | null>([...INTRO_FOCUS_POS] as Vec3);
  const closeContent = useCallback((center: { x: number; y: number }) => {
    setVortexCenter(center);
    setApproachPos(null);
    setPhase("contentClosing");
  }, []);

  const openSection = useCallback((id: SectionId, screenPos: { x: number; y: number }) => {
    const pavilion = PAVILION_DATA.find((item) => item.id === id);
    setSection(id);
    setVortexCenter(screenPos);
    setApproachPos(pavilion ? ([...pavilion.pos] as Vec3) : null);
    setPhase("vortex");
  }, []);

  const enterWorld = useCallback((center: { x: number; y: number }) => {
    setVortexCenter(center);
    setApproachPos(null);
    setPhase("introVortex");
  }, []);

  const returnIntro = useCallback((center: { x: number; y: number }) => {
    setVortexCenter(center);
    setApproachPos([...INTRO_FOCUS_POS] as Vec3);
    setPhase("returnIntroVortex");
  }, []);

  return (
    <div style={styles.sceneRoot}>
      <div style={styles.namePlate} aria-hidden>
        <span style={styles.namePlateLine}>Wenjun</span>
        <span style={styles.namePlateLine}>Cheng</span>
      </div>
      <ThreeWorld
        approachPos={approachPos}
        onSelectPavilion={openSection}
        onReturnIntro={returnIntro}
        labelsVisible={phase === "idle"}
      />

      {(phase === "intro" || phase === "introVortex") && (
        <IntroScroll closing={phase === "introVortex"} onClose={enterWorld} />
      )}

      {phase === "introVortex" && (
        <VortexTransition
          center={vortexCenter}
          mode="close"
          onComplete={() => {
            setApproachPos(null);
            setPhase("idle");
          }}
        />
      )}

      {phase === "returnIntroVortex" && (
        <VortexTransition
          center={vortexCenter}
          onComplete={() => setPhase("intro")}
        />
      )}

      {phase === "vortex" && <VortexTransition center={vortexCenter} onComplete={() => setPhase("content")} />}

      {phase === "contentClosing" && (
        <VortexTransition
          center={vortexCenter}
          mode="close"
          onComplete={() => {
            setApproachPos(null);
            setPhase("idle");
          }}
        />
      )}

      {(phase === "content" || phase === "contentClosing") && (
        <ContentScroll
          section={section}
          closing={phase === "contentClosing"}
          onClose={closeContent}
        />
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  sceneRoot: {
    position: "fixed",
    inset: 0,
    fontFamily: fonts.body,
  },
  namePlate: {
    position: "fixed",
    right: "1.8rem",
    top: "1.6rem",
    zIndex: 60,
    width: "2.7rem",
    height: "2.7rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: `1.5px solid ${colors.red}`,
    background: "transparent",
    color: colors.red,
    fontFamily: fonts.display,
    fontStyle: "italic",
    fontWeight: 500,
    fontSize: "0.78rem",
    letterSpacing: "0.04em",
    lineHeight: 1.1,
    pointerEvents: "none",
    userSelect: "none",
  },
  namePlateLine: {
    display: "block",
  },
  scrollPanel: {
    position: "relative",
    textAlign: "center",
  },
  introPanel: {
    width: "min(620px, 88vw)",
    padding: "3.05rem 3.15rem",
  },
  portrait: {
    display: "block",
    width: "8.4rem",
    height: "8.4rem",
    margin: "0 auto 1.05rem",
    borderRadius: "50%",
    objectFit: "cover",
    filter: "sepia(0.18) saturate(0.9) contrast(0.96)",
    boxShadow: "0 3px 18px rgba(40,26,14,0.18)",
    border: `1px solid ${colors.border}`,
  },
  contentPanel: {
    width: "min(760px, 92vw)",
    maxHeight: "88vh",
    display: "flex",
    flexDirection: "column",
    padding: "2.45rem 2.15rem 3.35rem",
  },
  scrollPanelClosing: {
    pointerEvents: "none",
  },
  scrollPaper: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    background: SCROLL_BACKGROUND,
    border: "1px solid rgba(78,56,32,0.2)",
    boxShadow: SCROLL_SHADOW,
  },
  scrollSheetOpening: {
    transformOrigin: "50% 50%",
    animation: ANIM_OPEN_SHEET,
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
  },
  scrollSheetClosing: {
    transformOrigin: "50% 50%",
    animation: ANIM_CLOSE_SHEET,
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
  },
  scrollInner: {
    position: "relative",
    zIndex: 2,
  },
  scrollTexture: {
    position: "absolute",
    inset: "0.65rem 0.7rem",
    pointerEvents: "none",
    zIndex: 1,
    opacity: 0.5,
    background:
      "repeating-linear-gradient(90deg, rgba(87,61,35,0.06) 0 1px, transparent 1px 42px), radial-gradient(circle at 30% 24%, rgba(255,255,255,0.38), transparent 20%), radial-gradient(circle at 68% 74%, rgba(85,58,32,0.08), transparent 24%)",
    mixBlendMode: "multiply",
  },
  scrollEdgeLeft: {
    position: "absolute",
    top: "1.7rem",
    bottom: "1.7rem",
    left: "0.65rem",
    width: "1.05rem",
    zIndex: 1,
    pointerEvents: "none",
    background: "linear-gradient(90deg, rgba(70,45,22,0.18), rgba(70,45,22,0.04), transparent)",
  },
  scrollEdgeRight: {
    position: "absolute",
    top: "1.7rem",
    bottom: "1.7rem",
    right: "0.65rem",
    width: "1.05rem",
    zIndex: 1,
    pointerEvents: "none",
    background: "linear-gradient(270deg, rgba(70,45,22,0.16), rgba(70,45,22,0.04), transparent)",
  },
  scrollRodTop: {
    position: "absolute",
    left: "-1.2rem",
    right: "-1.2rem",
    top: "1.1rem",
    zIndex: 3,
    height: "0.68rem",
    background: colors.rodGradient,
    borderRadius: "999px",
    opacity: 0.92,
    boxShadow: "0 2px 5px rgba(40,26,14,0.22)",
  },
  scrollRodTopOpening: {
    animation: ANIM_OPEN_ROD_TOP,
    willChange: "transform, opacity",
  },
  scrollRodTopClosing: {
    animation: ANIM_CLOSE_ROD_TOP,
    willChange: "transform, opacity",
  },
  scrollRodBottom: {
    position: "absolute",
    left: "-1.2rem",
    right: "-1.2rem",
    bottom: "1.1rem",
    zIndex: 3,
    height: "0.68rem",
    background: colors.rodGradient,
    borderRadius: "999px",
    opacity: 0.92,
    boxShadow: "0 -1px 5px rgba(40,26,14,0.18)",
  },
  scrollRodBottomOpening: {
    animation: ANIM_OPEN_ROD_BOTTOM,
    willChange: "transform, opacity",
  },
  scrollRodBottomClosing: {
    animation: ANIM_CLOSE_ROD_BOTTOM,
    willChange: "transform, opacity",
  },
  eyebrow: {
    margin: 0,
    color: colors.muted,
    fontSize: "0.72rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    whiteSpace: "pre-line",
    lineHeight: 1.6,
  },
  introTitle: {
    margin: "0.7rem 0 0.6rem",
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
    fontWeight: 500,
    fontStyle: "italic",
    letterSpacing: "0.01em",
  },
  introBody: {
    margin: "0 auto 1.4rem",
    maxWidth: "34rem",
    color: colors.muted,
    fontSize: "1rem",
    lineHeight: 1.9,
  },
  linkRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0.6rem",
    marginBottom: "1.35rem",
  },
  scrollLink: {
    color: colors.muted,
    textDecoration: "none",
    border: `1px solid ${colors.border}`,
    padding: "0.34rem 0.78rem",
    fontSize: "0.78rem",
  },
  enterButton: {
    display: "inline-block",
    margin: "1.5rem auto 0",
    padding: "0.25rem 0.6rem",
    background: "transparent",
    color: colors.ink,
    border: "none",
    fontFamily: fonts.display,
    fontStyle: "italic",
    fontSize: "1.85rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    lineHeight: 1,
    cursor: "pointer",
    opacity: 0.92,
    textShadow: "0 0 0.6px rgba(26,20,16,0.45)",
    transition: "opacity 180ms ease, transform 220ms ease",
  },
  enterText: {
    display: "block",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 30,
    display: "grid",
    placeItems: "center",
    background: "rgba(158,140,104,0.18)",
    backdropFilter: "blur(1.2px)",
  },
  modalBackdropClosing: {
    background: "rgba(155,145,126,0.1)",
    backdropFilter: "blur(0.5px)",
    pointerEvents: "none",
  },
  contentHeader: {
    position: "relative",
    zIndex: 2,
    padding: "0.45rem 0.25rem 1rem",
    borderBottom: `1px solid ${colors.border}`,
  },
  contentTitle: {
    margin: "0.35rem 0 0",
    color: colors.ink,
    fontFamily: fonts.display,
    fontWeight: 500,
    fontStyle: "italic",
    fontSize: "2.3rem",
    letterSpacing: "0.01em",
  },
  scrollBody: {
    position: "relative",
    zIndex: 2,
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "1.35rem 0.25rem 2.25rem",
  },
  body: {
    color: colors.muted,
    fontSize: "0.92rem",
    lineHeight: 1.9,
    margin: "0 0 0.9rem",
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "0.85rem",
  },
  card: {
    border: `1px solid ${colors.border}`,
    background: "rgba(255,255,255,0.22)",
    padding: "1rem",
    textAlign: "left",
  },
  cardLink: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "flex-start",
  },
  cardTitle: {
    color: colors.ink,
    fontWeight: 650,
    fontSize: "0.9rem",
    margin: "0 0 0.35rem",
  },
  cardTime: {
    color: colors.muted,
    fontSize: "0.68rem",
    whiteSpace: "nowrap",
  },
  cardMeta: {
    color: colors.muted,
    fontSize: "0.76rem",
    margin: "0 0 0.55rem",
  },
  cardBody: {
    color: colors.muted,
    lineHeight: 1.75,
    fontSize: "0.82rem",
    margin: "0 0 0.55rem",
  },
  emptyLink: {
    display: "block",
    border: `1px dashed ${colors.border}`,
    color: colors.muted,
    padding: "2rem",
    textAlign: "center",
    textDecoration: "none",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    margin: "1.15rem 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: colors.border,
  },
  dividerSeal: {
    width: "5px",
    height: "5px",
    background: colors.red,
    transform: "rotate(45deg)",
  },
  labelText: {
    color: colors.muted,
    fontSize: "0.68rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    margin: "0 0 0.6rem",
  },
  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.35rem",
  },
  chip: {
    color: colors.muted,
    border: `1px solid ${colors.border}`,
    background: "rgba(26,20,16,0.04)",
    padding: "0.18rem 0.55rem",
    fontSize: "0.68rem",
  },
};
