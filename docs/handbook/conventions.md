# Conventions

This is the house style for next.wadehammes.com: how we format TypeScript and React, how we structure CSS and tests, and the habits that keep reviews short. When something here conflicts with a local shortcut, follow the doc (or open a PR to change the doc if the rule is wrong).

If you are unsure, copy a nearby file that already does the right thing and run **`pnpm lint`** before you push.

## TypeScript

- **Use arrow functions always.** Prefer `const fn = () => {}` over `function fn() {}`.
- **If blocks always use `{}`.** Same for `else`, `for`, `while`, and `do`—never omit braces for single-line bodies.
- **Never use `any`.** Use proper types for all props, state, and function signatures.
- **Components**: Use arrow functions for component definitions (e.g. `export const MyComponent = (props: Props) => { ... }`). Do not use `React.FC` / `FC` or `function` declarations.
- **Never use non-null assertion (`!`).** Use optional chaining, nullish coalescing (`??`), or explicit checks instead.
- **No barrel files.** Do not add `index.ts` (or `index.tsx`) files that re-export from other modules. Import directly from the target module file (e.g. `from "src/components/Button/Button.component"`). The scaffold script may create an `index.ts`—delete it and import from the component file instead.
- **Absolute imports (`src/…`).** Import application TypeScript and JavaScript modules with paths rooted at `src/` (e.g. `import { Bio } from "src/components/Bio/Bio.component"`). Do not use relative paths (`./`, `../`) to reach another module under `src/` unless an exception below applies.
- **Exceptions to absolute imports:** (1) **CSS Modules** and other static assets co-located with the importing file (e.g. `import styles from "./MyComponent.module.css"`). (2) **`src/prismic/types/prismic.generated.ts`**—generated; do not hand-edit.
- **Prismic types**: Generated into `src/prismic/types/` (run `pnpm types:prismic`). Use generated document types and **parsed** types from `src/prismic/parse*.ts` (e.g. `ParsedPage`) in components. Do not edit generated types by hand.
- **App-level types**: Prefer colocating types with a feature when they are not cross-cutting (e.g. `Button.interfaces.ts` next to the component). Add shared contracts under `src/interfaces/` when multiple features need them.
- **Semantic names**: Avoid generic placeholders (`raw`, `tmp`, `val`, `foo`, `bar`, `stuff`) for bindings and parameters — use names that describe domain meaning (enforced by Cursor hooks).

## React / JSX

- **Component types**: Do not use `FC` or `React.FC`. Type props explicitly and let the return type be inferred.
- **Conditional components**: Use a ternary (`condition ? <Component /> : null`) instead of short-circuit (`condition && <Component />`) so the render branch is explicit and avoids accidentally rendering falsy values (e.g. `0`).
- **Multiple or conditional class names**: Use the `classnames` package (import as `classNames`) with **object notation** for conditional classes: `classNames(styles.a, { [styles.active]: isActive })`.
- **Client vs server**: Add `"use client"` only when the component needs hooks, browser APIs, or event handlers. Keep data fetching in Server Components (`page.tsx`, async parents).
- **Prismic Rich Text**: Use `@prismicio/react` (`PrismicRichText`) and guard with `prismic.isFilled.richText()` before rendering—see [Bio.component.tsx](../../src/components/Bio/Bio.component.tsx).

### Large components and state

- **Extract state into a custom hook or context when a component grows.** Spirals state lives in [SpiralsContext.tsx](../../src/contexts/SpiralsContext.tsx); theme preference in [usePreferredTheme.ts](../../src/hooks/usePreferredTheme.ts); responsive layout queries in [useMediaQuery.ts](../../src/hooks/useMediaQuery.ts). Follow the same pattern for new interactive features.

## Formatting and linting

We standardize on **Biome** for lint and format of TS/JS/JSON/CSS. **Stylelint** runs in CI via **`pnpm lint:css`** — see [platform.md](platform.md).

- **Commands**:
  - `pnpm lint` – Biome `check` (no writes)
  - `pnpm lint:fix` – Biome `check --fix`
  - `pnpm tsc:ci` – TypeScript strict check (matches CI)
- **Config**: [biome.json](../../biome.json). Generated Prismic types are excluded from lint.
- Run lint before committing so CI passes.

## CSS and styling

### Technology choice

- **Components use CSS Modules** (`.module.css`) co-located with the component when styles are component-specific.
- **Global layout and tokens** live in [src/styles/global.css](../../src/styles/global.css) and [src/styles/critical.css](../../src/styles/critical.css).
- **Design tokens** are in [src/styles/variables.css](../../src/styles/variables.css); runtime-only custom properties (Next.js fonts, component inline vars) are registered in [src/styles/runtime-variables.json](../../src/styles/runtime-variables.json) for Stylelint.

### File naming and location

Place the CSS module next to the component, e.g. `MyComponent.component.tsx` and `MyComponent.module.css`. Import the module and use the class names object (e.g. `styles.wrapper`).

### Layout rules (enforced by Cursor hooks)

These rules are also enforced by [`.cursor/hooks/`](../../.cursor/hooks/README.md) on agent edits:

- **Nested `@media` only** — Write mobile-first base styles, then nest `@media (width >= …)` inside each selector. Do not add top-level `@media` blocks that wrap multiple rules.
- **Range syntax** — Use `@media (width >= 768px)`, not `@custom-media` or `@media (--breakpoint)`.
- **No `margin-top` for spacing** — Use flex containers with `gap` instead. `margin-top: 0` and `scroll-margin-top` are allowed.
- **Nesting depth** — Up to 3 selector levels is fine; beyond that, flatten with a full selector path.

### Modern CSS

Use nesting, custom properties, and logical properties where they improve clarity. Prefer `var(--color-*)` tokens from global CSS over hard-coded hex in modules.

## Testing

Jest with **jsdom** ([`jest.config.ts`](../../jest.config.ts), [`.jest/setupTests.ts`](../../.jest/setupTests.ts)). Prefer **`screen`** and **`userEvent`** in specs; keep setup helpers in page objects or `beforeEach` when it reduces duplication.

### Page object pattern (lightweight)

- **Base class**: [`src/tests/basePageObject.po.ts`](../../src/tests/basePageObject.po.ts).
- **Per-component page object** (when useful): `<Name>.po.tsx` extends `BasePageObject`, sets **`testId = "rh<ComponentName>"`**, holds **test data and setup/render helpers only**—not wrappers around every `screen.getBy*`. **POs never assert and never call `screen.find*` / `getBy*` / `queryBy*` / `waitFor`.** A `find*` call throws when missing, which is an implicit assertion; both the wait and the assert belong in the spec, even when waiting for async resolution (e.g. a `next/dynamic` component). The PO renders and exposes mocks/data; the spec drives interactions and asserts.
- **Specs**: In `<Name>.spec.tsx`, import **`screen`** and **`userEvent`** from [`test-utils.tsx`](../../test-utils.tsx) (or `@jest/globals` for `describe` / `it` / `expect`). The page object does setup; assertions stay in the spec file.
- **Assert on literal user-visible strings, not `po.<field>`.** A query like `screen.getByRole("button", { name: po.buttonText })` passes whenever the PO and the rendered output drift together—so the spec stops catching the bug it was meant to catch. Inline the literal: `screen.getByRole("button", { name: "Randomize" })`. PO fields like `buttonText` exist to feed the **render setup** (e.g. as props) and stay; specs just shouldn't read them back.
- **Providers**: Use [`test-utils.tsx`](../../test-utils.tsx) (repo root). It re-exports everything from `@testing-library/react`, plus a `render` and `renderHook` that wrap with **`RouterContext`** (mocked Next.js router) and **`SpiralsProvider`**. **`next/router`** and **`next/navigation`** are mocked globally in setup ([`mockNextRouter`](../../src/tests/mocks/mockNextRouter.ts), [`mockNextNavigation`](../../src/tests/mocks/mockNextNavigation.ts)); per-test routing state goes through the latter's mutable `params` / `searchParams`.

### Test infrastructure

| Path | Purpose |
|------|---------|
| [`test-utils.tsx`](../../test-utils.tsx) (repo root) | Custom `render` / `renderHook` with app providers; re-exports Testing Library and `userEvent`. |
| [`src/tests/basePageObject.po.ts`](../../src/tests/basePageObject.po.ts) | Base class for page objects (`debug`, `raiseOnFind`). |
| [`src/tests/factories/BaseFactory.ts`](../../src/tests/factories/BaseFactory.ts) | Abstract Faker factory; subclass per type under `src/tests/factories/`. |
| [`src/tests/mocks/`](../../src/tests/mocks/) | Shared Jest doubles (`IntersectionObserver`, `matchMedia`, `next/navigation`, SVG imports, `@prismicio/react`, API responses). |

Global setup: [.jest/setupTests.ts](../../.jest/setupTests.ts) loads `@testing-library/jest-dom/jest-globals` (required when specs import `expect` from `@jest/globals`), mocks Next.js router/navigation, and installs browser API mocks. TypeScript matcher types come from [`src/@types/jest-dom.d.ts`](../../src/@types/jest-dom.d.ts).

### Test data and factories

- Factories use **@faker-js/faker** and extend [`BaseFactory`](../../src/tests/factories/BaseFactory.ts). Each factory exposes `.build(attributes?)` / `.buildList(n, attributes?)`—pass partial `attributes` to pin specific fields in a test while every other field gets a fresh fake value.
- **Examples**: [`SpiralsConfig.factory.ts`](../../src/tests/factories/SpiralsConfig.factory.ts) (Spirals), [`RichText.factory.ts`](../../src/tests/factories/RichText.factory.ts) and [`HomeDocument.factory.ts`](../../src/tests/factories/HomeDocument.factory.ts) (Prismic). `HomeDocumentFactory.buildParsedPage()` returns a `ParsedPage` via [`parseHomeDocument`](../../src/prismic/parsePage.ts)—use it for component specs that take parsed CMS data.
- **Adding a factory**: build the `instance` with `satisfies <TargetType>`. Use `faker.helpers.arrayElement(...)` for symbol-union fields—pin via `attributes` in specs that depend on a specific value rather than relying on the random pick.

### Mocking modules

When a component imports a utility that must be stubbed in tests, wire the mock in the **page object** (not the spec) and export typed helpers for the spec to assert against.

- **App utilities**: manual mock under **`src/<module>/__mocks__/`** and **`jest.mock("src/<module>")`** without a factory—see [`src/utils/__mocks__/helpers.ts`](../../src/utils/__mocks__/helpers.ts) for `saveSvg`.
- **External npm packages**: manual mock under **[`__mocks__/`](../../__mocks__/)** (for node modules) or shared helpers under **`src/tests/mocks/`**, then opt-in with **`jest.mock("package-name")`** in the PO—see [`__mocks__/@prismicio/react.tsx`](../../__mocks__/@prismicio/react.tsx) and [`prismicReactMock.tsx`](../../src/tests/mocks/prismicReactMock.tsx). Do **not** use `jest.requireActual("@prismicio/react")` in mock factories (ESM; Jest cannot load it). Avoid unit-testing [`getPage.ts`](../../src/prismic/getPage.ts) directly—it pulls `@prismicio/next` and Next server modules; cover getters indirectly via parser specs + `HomePage` integration specs.

### Jest and SVG imports

SVG icons under [`src/styles/icons/`](../../src/styles/icons/) are imported as React components (e.g. `import Icon from "src/styles/icons/Icon.svg"`). At build time `@svgr/webpack` transforms them; under Jest, [`src/tests/mocks/svgMock.tsx`](../../src/tests/mocks/svgMock.tsx) stands in via a `moduleNameMapper` entry in [`jest.config.ts`](../../jest.config.ts) that overrides `next/jest`'s default file-mock for `.svg`. New SVG icons need no per-spec wiring—the mapper is global.

### Jest and `next/script`

If a spec asserts on DOM produced by **`next/script`** (e.g. JSON-LD), **mock** `next/script` so output is synchronous under JSDOM. Add a shared mock under **`src/tests/mocks/`** and wire **`jest.mock("next/script", …)`** in the spec.

### Jest and `@prismicio/react`

Specs that render **`PrismicRichText`** should opt in from the page object:

```tsx
jest.mock("@prismicio/react");
```

Assert on user-visible copy in the spec; the manual mock renders `field` text nodes synchronously.

### Responsive layout in tests

[`mockMatchMediaQueries()`](../../src/tests/mocks/mockMatchMedia.ts) overrides the global `matchMedia` stub for a single spec (e.g. desktop footer layout at `(min-width: 72rem)`). Reset in `beforeEach` when tests depend on a specific breakpoint.

## Test IDs

- Root element for tested components: **`data-testid="rh<ComponentName>"`** (e.g. `rhSpiralsActions`, `rhBio`, `rhHomePage`). **PascalCase** matches the component name—see [components.md](components.md).
- Page object **`testId`** must match the component root.
- Avoid generic roots like `data-testid="wrapper"` for primary surfaces.

## Accessibility

- Interactive controls use native elements (`button`, `a`) with appropriate `aria-label` when visible text is absent—see [Button.component.tsx](../../src/components/Button/Button.component.tsx).
- Respect `prefers-reduced-motion` and theme preference when adding motion or color-dependent UI.
- SVG decorative content: existing Spirals SVG follows project a11y settings (`noSvgWithoutTitle` is off in Biome for this repo).

## Exports

Export components as both a **named export** (`export const MyComponent`) and a **default export** (`export default MyComponent`) to match existing folders.
