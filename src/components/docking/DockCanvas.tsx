"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { loadPdb, disposeTree } from "./pdb";
import { DOCK_BUILDERS, DOCK_PDB, type DockScene, type DockSceneKey } from "./dockScenes";

type Props = {
  scene: DockSceneKey;
  lite: boolean;
  reduced: boolean;
  running: boolean;
  layer: RefObject<HTMLDivElement>;
  setChip: (t: string) => void;
};

function Stage({ built, reduced }: { built: DockScene; reduced: boolean }) {
  const { camera, size, invalidate } = useThree();
  const t = useRef(reduced ? built.still : 0);

  // Frame the whole structure, as the source pages do on resize.
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.aspect = size.width / Math.max(1, size.height);
    const vf = THREE.MathUtils.degToRad(cam.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * cam.aspect);
    const d = (built.rad / Math.sin(Math.min(vf, hf) / 2)) * 1.02;
    cam.position.set(0, d * built.camY, d);
    cam.lookAt(0, 0, 0);
    cam.near = d / 30;
    cam.far = d * 4;
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, size, built, invalidate]);

  useFrame((_, dt) => {
    if (!reduced) t.current += Math.min(dt, 0.05);
    built.update(t.current, camera, size.width, size.height);
  });

  return <primitive object={built.root} />;
}

/** One canvas per docking scene; DockVisual decides when it exists. */
export default function DockCanvas({ scene, lite, reduced, running, layer, setChip }: Props) {
  const [built, setBuilt] = useState<DockScene | null>(null);

  useEffect(() => {
    let live = true, made: DockScene | null = null;
    const id = DOCK_PDB[scene];
    setChip(`Loading PDB ${id}…`);
    loadPdb(id)
      .then((data) => {
        if (!live || !layer.current) return;
        made = DOCK_BUILDERS[scene](data, { layer: layer.current, setChip });
        setBuilt(made);
      })
      .catch(() => live && setChip(`Real structure · PDB ${id}`));
    return () => {
      live = false;
      if (made) disposeTree(made.root);
      layer.current?.replaceChildren();
    };
  }, [scene, layer, setChip]);

  return (
    <Canvas
      flat
      frameloop={running && !reduced ? "always" : "demand"}
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: lite ? "low-power" : "high-performance" }}
      camera={{ fov: 26, near: 1, far: 4000, position: [0, 0, 100] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <hemisphereLight args={[0xffffff, 0xb8ad96, 2.2]} />
      <directionalLight position={[-0.5, 1, 1.2]} intensity={3} />
      {!lite && <directionalLight position={[1, -0.3, -1]} intensity={0.8} color={0xfff4de} />}
      {built && <Stage built={built} reduced={reduced} />}
    </Canvas>
  );
}
