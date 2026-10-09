# Spirals modernization backlog

Companion to [spirals.md](spirals.md). Items below were implemented in the 2026 refresh unless marked **Deferred**.

## Completed

| Item | Implementation |
|------|----------------|
| Context selectors | `useSpiralsDispatch`, `useSpiralsState`, `useSpiralsConfigs`; split React contexts for stable dispatch. |
| Stable shape refs | [Shape.component.tsx](../../src/components/Spirals/Shape.component.tsx) registers via `useLayoutEffect` + stable `registerShapeRef`. |
| `gsap.context` on `Spiral` | Pulse + layout tweens scoped to arm `<g>`. |
| Simpler gating | Removed `clientReady`; mount when `initialized` only (`HomePageSpiralsLayer`). |
| Cache caps | [lruMap.ts](../../src/helpers/lruMap.ts) used by shape + OKLCH caches. |
| Drop SVG batching | [SpiralsSVG.component.tsx](../../src/components/Spirals/SpiralsSVG.component.tsx) mounts all paint-ordered sets; opacity via `SVG` `visible`. |
| Split components | `Shape`, `Spiral`, `Spirals` in separate files under `src/components/Spirals/`. |
| Theme on toggle | `resolveLightnessForTheme` at render + `usePreferredTheme` in `Spirals` / `SpiralsControls` (stored config lightness is theme-neutral). |
| Slider throttling | 50ms throttle on range inputs in `SpiralsControls` (matches color picker). |
| Memoized spirals layer | [HomePageSpiralsLayer.component.tsx](../../src/components/HomePage/HomePageSpiralsLayer.component.tsx) skips re-render when props unchanged. |
| Trim manual `memo` | Removed `memo()` wrappers; rely on React Compiler + clearer props. |

## Deferred

| Item | Notes |
|------|--------|
| **`@gsap/react` `useGSAP`** | Current `gsap.context` pattern is sufficient; add dependency only if hooks simplify further refactors. |
| **Lazy `SpiralsSVG`** | Wait for Turbopack + React Compiler lazy-chunk stability before reintroducing `React.lazy`. |

## Tests added

- [SpiralsContext.spec.tsx](../../src/contexts/SpiralsContext.spec.tsx) — reducer + stable dispatch
- [SpiralsSVG.spec.tsx](../../src/components/Spirals/SpiralsSVG.spec.tsx) — paint order + mounted when hidden
- [HomePageSpiralsLayer.spec.tsx](../../src/components/HomePage/HomePageSpiralsLayer.spec.tsx)
- [Shape.spec.tsx](../../src/components/Spirals/Shape.spec.tsx)
- [lruMap.spec.ts](../../src/helpers/lruMap.spec.ts)
