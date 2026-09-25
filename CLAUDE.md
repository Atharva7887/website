# IndiskaAI Website — Project Notes

Marketing site for IndiskaAI (generative AI for drug discovery / structural biology).
Stack: Next.js 14 App Router · TypeScript · Tailwind 3 · React Three Fiber + drei · Framer Motion · Lenis · Sanity CMS.

## Design tokens
Cream `#FAF7F0` bg · navy `#1E5BA8` · gold `#F4C430` · ink `#1A1A1A`.
Display font: Fraunces. Body: Inter.

## Routing
- `(site)/` route group wraps Nav + Footer + Lenis smooth scroll.
- `studio/[[...index]]/` lives outside the group so it renders without site chrome.

## CMS
Sanity Studio embedded at `/studio`. Content (Capabilities, Stats, Team) is fetched via `safeFetch` in `sanity/lib/fetch.ts`, which falls back to in-code defaults when env vars aren't set. Required env: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`. See `.env.example`.

## Visual system (services & platform)
Pages follow SHOW → EXPLAIN → GUIDE: one-sentence copy, every card/step carries a visual.
- `src/components/science/` — `Illustrations` (240×160 schematics), `Glyphs` (48×48 icons for steps/cards/deliverables), `MotionStory` (hero "video" built from schematics; pauses offscreen, reduced-motion aware), `VisualPipeline` (horizontal ≥lg, vertical timeline below), `PersistenceComparison` (MD, seeded illustrative curves).
- Service detail pages are data-driven from `src/lib/services-data.ts`; each entry's `layout` sets section order so pages don't share one rhythm.
- Positioning is **AI-assisted computational biology**, never "accelerated"/"faster". "GPU-accelerated" is allowed only as a technical statement about simulation infrastructure.
- Service-page IA: "What comes in → process → what goes out" (`inputs`, `ioProcess`, `deliverables`, rendered by `InputsOutputs`) is used where it helps; the MD page deliberately has none — just a concise `deliverables` section.
- MD "What we analyse" is `AnalysisExplorer`: desktop list + side panel (hover / focus / click), tap-to-expand accordion below `lg`. Animated illustrative plots come from `components/md/MdPlots.tsx` (React SVG, rAF paused offscreen) keyed by `chart`; series are "Candidate A/B/C" plus "AI-assisted candidate D" (per explicit request) — none of the four is called better than another, and no comparative/ranking claims are made between them.
- MD scenes (`components/md/`): `molecular.ts` (procedural ribbon/atom builder) + `scenes.ts` (six systems) rendered by `MdCanvas` (R3F + drei `Html` labels), wrapped by `MdVisual`, which lazy-loads the 3D chunk, mounts the canvas only within ~1 screen of the viewport, pauses offscreen, renders a still frame under reduced motion, and rotates on mouse drag / horizontal touch swipe only (`touch-action: pan-y`). Use via `scene:` on a card (`variant: "scene"` for visual-first product cards), on a `realImages` row, or as `heroScene` (the MD hero is `heroComplex`, an original protein–ligand scene art-directed from a supplied reference render — not a PDB entry; never give it a PDB ID). Ported from the supplied md-sim-visuals / analyse-plots HTML; do not embed those pages.
- Docking "What we analyse" (`variant: "feature"`, card `dock:` + `caption:`) uses `components/docking/`: `pdb.ts` (PDB parser + cartoon ribbons) and `dockScenes.ts` build live scenes from real coordinates in `public/pdb/` (1HSG / 1BRS / 3HFM, trimmed by `scripts/trim-pdb.mjs`); `DockVisual` shares `three/useCanvasPresence` with `MdVisual`. Pockets, interfaces (4.5 Å) and contact distances are computed from the coordinates — never type them in. Trial-pose docking scores are labelled illustrative. `CandidateComparison` is illustrative data and says so inside the figure.
- Every service sets its own closing CTA (`ctaTitle` / `ctaDescription`, or props on custom pages) — never reuse one generic sentence.
- Docking scores / predicted rankings are never called affinities; label them "predicted / computational".
- No stock photography; all visuals are original SVG. Charts/frames are schematic and labelled as such.
- Real imagery = `src/lib/media.ts` (asset inventory: source, licence, where used). Structure renders in `public/structures/` are drawn from CC0 PDB coordinates by `scripts/render-pdb.mjs` (full raw .pdb not committed; only the trimmed files in `public/pdb/`); rendered via `MediaFigure` with a credit link. `public/hero-video.mp4` is the owned antibody render (Antibody Discovery hero, `LoopVideo`).
- Services with bespoke pages (`genomics` = WES, `genomics/oncology-somatic-variant-analysis`, `biomarker-identification`) set `custom: true` in services-data and live in their own route folders; `[slug]` skips them. Genomics pages share `GenomicsNav`; `navLabel` sets their Nav dropdown text.
- "What comes in → process → what goes out" is the shared `InputsOutputs` component (ServiceSections.tsx) — use it on every service page rather than a bespoke deliverables block.
- Oncology copy: findings "support review by qualified clinical professionals"; never "diagnoses" or "determines treatment"; tumour-only calls are "likely somatic"; every capability is qualified "where supported by panel design and data quality".
- `PendingContent` wraps copy that states an unconfirmed operational/legal/clinical commitment (turnaround, data protection, ownership, clinical use). Shown in dev, stripped from production builds. Remove the wrapper only once the business confirms the wording.
- No submission backend exists for the Partner or WES request forms, and there are no Terms/Privacy pages yet.
- Third-party video only via `ExternalVideoCard` (click-to-load youtube-nocookie facade, visible credit + source link), and only for videos whose owner allows embedding. None are configured yet.

## On Ice / Post-Launch

### Molecular Interaction Scrollytelling (`BindingSection`)
**Status:** Built and verified, currently disabled for launch.
**Files:** `src/components/BindingSection.tsx`, `src/components/BindingScene.tsx`.
**Re-enable:** Uncomment the import and `<BindingSection />` placement in `src/app/(site)/page.tsx` (placed between Capabilities and the divider before Approach).
**State at pause:**
- 320vh sticky scroll-scrubbed section, antigen + antibody dock vertically (y +3.5 → +0.2 and -3.5 → -0.2) and meet centered around y = 0.
- Lock + glow timing aligned to "Step 03 — Bound" reaching ~50% opacity (scrollYProgress ≈ 0.66).
- Responsive x-shift via `useThree().viewport.aspect` so the complex sits on viewport-right on landscape, centered on portrait.
- Geometries already optimized (low-poly icosahedrons, flatShading, reduced cylinder segments).
**Open considerations before re-enabling:**
- Verify mobile portrait composition end-to-end (the responsive offset was tuned but not photo-verified on a real phone).
- Decide whether to add a reduced-motion fallback that swaps the 3D for a static still.
