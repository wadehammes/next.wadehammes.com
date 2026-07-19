# Components

New UI lives under `src/components/<Name>/`. This page describes the files we expect in that folder and how Spirals-related pieces fit together.

## Folder layout

One directory per component under `src/components/<ComponentName>/`. Use **PascalCase** for the folder and file names.

### File types and when to use them

| File | Purpose |
|------|--------|
| **`<Name>.component.tsx`** | Main React component. Use CSS Modules or global classes as appropriate. |
| **`<Name>.interfaces.ts`** | Public props or enums when they are not already defined by a Prismic parser. |
| **`<Name>.module.css`** | Component-scoped layout and visuals. |
| **`<Name>.utils.ts`** | Pure helpers used only by this feature (e.g. Spirals geometry). |
| **`use<Something>.ts`** | Optional hook colocated with the component when not shared app-wide. |
| **`<Name>.po.tsx`** | Page object: render helpers and mock wiring only—no assertions. |
| **`<Name>.spec.tsx`** | Jest tests using Testing Library. |

When adding component tests, follow [conventions.md](conventions.md#testing) — page object in `<Name>.po.tsx`, factory in `src/tests/factories/`, spec uses `screen` and `userEvent` from [test-utils.tsx](../../test-utils.tsx).

## Scaffold

Run **`scripts/scaffold_component.sh <ComponentName>`** for a starting point:

```bash
./scripts/scaffold_component.sh MyWidget
```

The script creates the component, CSS module, and an **`index.ts` barrel file**. **Delete the barrel** and import from `<Name>.component.tsx` directly—see [conventions.md](conventions.md).

**Test IDs:** when adding tests, set **`data-testid="rh<ComponentName>"`** on the component root (for example `rhSpiralsActions`). Keep that prefix so specs and page objects stay consistent—see [conventions.md](conventions.md#test-ids).

For Prismic-driven components, type props from parser output (e.g. `ParsedPage`, `RichTextField`) rather than generic scaffold interfaces.

## Exports

Export the component as both a **named export** and a **default export** so imports stay consistent with existing folders:

```tsx
export const Bio = ({ copy }: BioProps) => { /* ... */ };
export default Bio;
```

## Dynamic imports

Use **`next/dynamic`** or **`React.lazy`** when a component is heavy or client-only.

- **[HomePage.component.tsx](../../src/components/HomePage/HomePage.component.tsx)** lazy-loads `SpiralsSVG` inside `Suspense` so the main thread stays responsive on first paint.
- Pass `ssr: false` via `dynamic()` when a module depends on `window` and must not run on the server.

## Spirals components

Full architecture, config fields, geometry, GSAP behavior, and extension guide: **[spirals.md](spirals.md)**.

| Component | Role |
|-----------|------|
| [SpiralsSVG.component.tsx](../../src/components/Spirals/SpiralsSVG.component.tsx) | Root `<svg class="fractal">`; batches config rendering. |
| [Spirals.component.tsx](../../src/components/Spirals/Spirals.component.tsx) | One set per config: rotation, scale, inner `Spiral` arms. |
| [SpiralsControls.component.tsx](../../src/components/Spirals/SpiralsControls.component.tsx) | Slide-out playground with sliders and color picker. |
| [SpiralsActions.component.tsx](../../src/components/Spirals/SpiralsActions.component.tsx) | Footer icon buttons (playground, randomize, download, theme). Custom span tooltips (not `Button` `hasTooltip`). |
| [Spirals.utils.ts](../../src/components/Spirals/Spirals.utils.ts) | `SpiralsConfig`, random generation, OKLCH helpers, shape math. |

State is centralized in [SpiralsContext.tsx](../../src/contexts/SpiralsContext.tsx)—prefer dispatching actions over prop drilling through deep trees.

## Other notable components

| Component | Role |
|-----------|------|
| [Bio.component.tsx](../../src/components/Bio/Bio.component.tsx) | Prismic rich text in the footer (`rhBio`). |
| [Header.component.tsx](../../src/components/Header/Header.component.tsx) | Site header (logo link). |
| [HomePage.component.tsx](../../src/components/HomePage/HomePage.component.tsx) | Client home shell: Bio, Spirals actions/controls, lazy SVG (`rhHomePage` on `PageContainer`). |
| [PageContainer/Page.component.tsx](../../src/components/PageContainer/Page.component.tsx) | Page wrapper with ref forwarding for intersection observer; optional `testId` prop. |
| [PreviewModeOverlay.component.tsx](../../src/components/PreviewModeOverlay/PreviewModeOverlay.component.tsx) | Banner when Prismic preview is active (`rhPreviewModeOverlay`). |
| [SVG.component.tsx](../../src/components/SVG/SVG.component.tsx) | Inline SVG icon helper. |
| [Button.component.tsx](../../src/components/Button/Button.component.tsx) | Shared button with variants; optional pseudo-element tooltips via `hasTooltip`. |

## Links

This site is mostly a single-page experience today. If you add routes, use **`next/link`**'s **`Link`** for internal navigation and set **`target`** / **`rel="noopener noreferrer"`** for external links that open in a new tab.
