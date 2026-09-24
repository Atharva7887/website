"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { applyMotion, buildScene, type MdSceneKey } from "./scenes";
import { disposeTree } from "./molecular";

export type Drag = { yaw: number; pitch: number };

type Props = {
  scene: MdSceneKey;
  lite: boolean;
  reduced: boolean;
  running: boolean;
  /** Start time offset, so the same system reused in another card doesn't look like a copy. */
  t0: number;
  drag: MutableRefObject<Drag>;
  invalidateRef: MutableRefObject<(() => void) | null>;
};

const TONE: Record<string, string> = {
  navy: "border-navy/70 text-navy bg-white/85",
  gold: "border-gold-600 text-[#7a5a06] bg-[#FDF3D2]",
  ghost: "border-dashed border-navy/50 text-navy/80 bg-white/70",
};

function Scene({ scene: key, lite, reduced, t0, drag, invalidateRef }: Omit<Props, "running">) {
  const scene = useMemo(() => buildScene(key, lite), [key, lite]);
  const { camera, size, invalidate } = useThree();
  const t = useRef(t0);
  const amp = reduced ? 0.4 : 1;

  useEffect(() => {
    invalidateRef.current = invalidate;
    return () => { invalidateRef.current = null; };
  }, [invalidate, invalidateRef]);

  useEffect(() => () => disposeTree(scene.root), [scene]);

  // Fit the scene's extent to the card, as the source pages fit the window.
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const { ext, elev, center, fov } = scene.view;
    cam.fov = fov;
    cam.aspect = size.width / Math.max(1, size.height);
    const vf = THREE.MathUtils.degToRad(fov / 2), hf = Math.atan(Math.tan(vf) * cam.aspect);
    // 1.07: a little air so floppy termini don't clip at the card edge.
    const dist = (Math.max(ext.w / Math.tan(hf), ext.h / Math.tan(vf)) + ext.d) * 1.07;
    cam.position.set(center.x, center.y + dist * Math.sin(elev), center.z + dist * Math.cos(elev));
    cam.near = 1;
    cam.far = 3000;
    cam.lookAt(center);
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, size, scene, invalidate]);

  useFrame((_, dt) => {
    if (!reduced) t.current += Math.min(dt, 0.05);
    applyMotion(scene, t.current, drag.current.yaw, drag.current.pitch);
    scene.update(t.current, amp, drag.current.yaw);
  });

  return (
    <>
      <primitive object={scene.root} />
      {/* One portal per parent group: R3F keys portals by container uuid. */}
      {(["root", "pivot"] as const).map((space) => {
        const labels = scene.labels.filter((l) => l.space === space);
        if (!labels.length) return null;
        return (
          <Fragment key={space}>
            {createPortal(
              labels.map((l) => (
                <Html key={l.text} position={l.pos} center zIndexRange={[4, 0]} style={{ pointerEvents: "none" }}>
                  <span className={`whitespace-nowrap rounded-full border px-2 py-[3px] font-sans text-[0.62rem] font-semibold uppercase tracking-[0.08em] ${TONE[l.tone]}`}>
                    {l.text}
                  </span>
                </Html>
              )),
              space === "root" ? scene.root : scene.pivot,
            )}
          </Fragment>
        );
      })}
    </>
  );
}

/**
 * One WebGL canvas per mounted visual. MdVisual decides when it exists; here
 * `running` only switches between a continuous loop and on-demand frames.
 */
export default function MdCanvas({ running, ...p }: Props) {
  return (
    <Canvas
      flat
      frameloop={running && !p.reduced ? "always" : "demand"}
      dpr={p.lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: p.lite ? "low-power" : "high-performance" }}
      camera={{ fov: 24, near: 1, far: 3000, position: [0, 0, 100] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <hemisphereLight args={[0xffffff, 0xe7e0d0, 2.3]} />
      <directionalLight position={[30, 60, 80]} intensity={1.9} />
      {!p.lite && <directionalLight position={[-60, 20, -50]} intensity={0.9} color={0xfff1d0} />}
      <Scene {...p} />
    </Canvas>
  );
}
