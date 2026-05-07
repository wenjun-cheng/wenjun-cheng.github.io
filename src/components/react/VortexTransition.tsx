import { useEffect } from "react";
import { motion } from "../../styles/tokens";

interface Props {
  center: { x: number; y: number };
  onComplete: () => void;
  mode?: "open" | "close";
}

export default function VortexTransition({ center, onComplete, mode = "open" }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, motion.vortexMs);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  const bloomAnim = mode === "close" ? "inkVortexClose" : "inkVortexOpen";
  const washAnim = mode === "close" ? "inkWashClose" : "inkWash";
  const bloomSize = mode === "close" ? "min(30vw, 300px)" : "min(34vw, 340px)";
  const washSize = mode === "close" ? "min(20vw, 200px)" : "min(22vw, 220px)";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: center.x,
          top: center.y,
          width: bloomSize,
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          backgroundImage: "url('/art/ink-bloom-alpha.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
          opacity: 0,
          animation: `${bloomAnim} ${motion.vortexMs}ms ${motion.ease}`,
          filter: mode === "close" ? "contrast(1.18) saturate(0.86)" : "contrast(1.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: center.x,
          top: center.y,
          width: washSize,
          aspectRatio: "1",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(239,230,209,0.42), rgba(239,230,209,0.16) 48%, transparent 72%)",
          animation: `${washAnim} ${motion.vortexMs}ms ${motion.ease}`,
        }}
      />
    </div>
  );
}
