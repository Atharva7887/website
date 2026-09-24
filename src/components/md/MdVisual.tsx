"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useCanvasPresence } from "@/components/three/useCanvasPresence";
import type { MdSceneKey } from "./scenes";
import type { Drag } from "./MdCanvas";

const MdCanvas = dynamic(() => import("./MdCanvas"), { ssr: false });

export const MD_SCENE_ALT: Record<MdSceneKey, string> = {
  protein: "Illustrative MD simulation: a two-domain protein ribbon fluctuating in solvent, one domain swinging about a gold hinge loop",
  proteinLigand: "Illustrative MD simulation: a small-molecule ligand moving inside a helical binding pocket while hydrogen-bond contacts form and break",
  proteinProtein: "Illustrative MD simulation: two docked proteins with interface side chains and transient contacts across the interface",
  antibodyAntigen: "Illustrative MD simulation: an antibody Fab with flexible gold CDR loops making changing contacts with an antigen",
  mutationVariant: "Illustrative MD simulation: matched wild-type and variant proteins side by side, the variant more flexible around the mutated residue",
  freeEnergy: "Illustrative free-energy landscape: a walker samples basin A, crosses a barrier and settles in basin B",
  heroComplex: "Illustrative molecular dynamics visualization: a protein with blue helices and gold β-strands holds a small-molecule ligand inside a translucent pocket surface, the whole complex fluctuating gently over time",
};

/** WT / variant sequence strip for the mutation scene (A → W at position 6). */
function SequenceStrip() {
  const wt = "KVLGEATDIS", variant = "KVLGEWTDIS", at = 5;
  const row = (s: string, mark: boolean) => (
    <div className="flex gap-[3px]">
      {[...s].map((c, i) => (
        <span
          key={i}
          className={`flex h-[14px] w-[14px] items-center justify-center rounded-[3px] border text-[8px] font-semibold leading-none ${
            mark && i === at ? "border-gold-600 bg-[#FBE7A6] text-[#7a5a06] motion-safe:animate-pulse" : "border-navy/60 bg-[#E4E8F0] text-navy"
          }`}
        >
          {c}
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden className="pointer-events-none absolute bottom-2.5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-[5px]">
      {row(wt, false)}
      {row(variant, true)}
    </div>
  );
}

/**
 * An animated MD scene that costs nothing until it's needed: the WebGL canvas
 * mounts only within about a screen of the viewport, runs only while visible,
 * and is torn down again when scrolled well away. Reduced motion renders a
 * single still frame (drag still rotates it). Drag rotates with a mouse; on
 * touch, only horizontal swipes rotate, so vertical page scrolling is never
 * captured.
 */
export default function MdVisual({
  scene,
  t0 = 0,
  compact = false,
  className = "",
}: {
  scene: MdSceneKey;
  t0?: number;
  /** Small cards: drop secondary overlays (the mutation sequence strip). */
  compact?: boolean;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const { near, visible, lite } = useCanvasPresence(box);
  const reduced = useReducedMotion() ?? false;
  const drag = useRef<Drag>({ yaw: 0, pitch: 0 });
  const invalidate = useRef<(() => void) | null>(null);
  const ptr = useRef<{ id: number; x: number; y: number; mouse: boolean } | null>(null);

  const onDown = (e: React.PointerEvent) => {
    const mouse = e.pointerType === "mouse";
    if (mouse && e.button !== 0) return;
    ptr.current = { id: e.pointerId, x: e.clientX, y: e.clientY, mouse };
    if (mouse) e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const p = ptr.current;
    if (!p || p.id !== e.pointerId) return;
    drag.current.yaw += (e.clientX - p.x) * 0.008;
    if (p.mouse) drag.current.pitch = Math.max(-1, Math.min(1, drag.current.pitch + (e.clientY - p.y) * 0.006));
    p.x = e.clientX;
    p.y = e.clientY;
    invalidate.current?.();
  };
  const onUp = () => { ptr.current = null; };

  return (
    <div
      ref={box}
      role="img"
      aria-label={MD_SCENE_ALT[scene]}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className={`relative overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing ${/\bbg-/.test(className) ? "" : "bg-[radial-gradient(ellipse_at_50%_45%,#FFFFFF_0%,#FAF7F0_72%)]"} ${className}`}
    >
      {near && (
        <MdCanvas scene={scene} lite={lite} reduced={reduced} running={visible} t0={t0} drag={drag} invalidateRef={invalidate} />
      )}
      {scene === "mutationVariant" && !compact && <SequenceStrip />}
    </div>
  );
}
