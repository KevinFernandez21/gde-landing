# Tech Stack Section — Design Document

**Date:** 2026-04-17  
**Status:** Approved

---

## Overview

Add a new `TechStack` section to the GDE landing page that visually showcases the technologies the team works with. The section is placed between `Services` and `HowItWorks` in `page.tsx`.

The design uses a split layout: an animated orbital diagram on the left (desktop only) and a categorized tech list on the right. This avoids repeating any existing visual pattern in the site (no card grids, no marquee, no numbered steps).

---

## Architecture

- **File:** `components/TechStack.tsx`
- **Registration:** `app/page.tsx` — dynamic import, inserted between `Services` and `HowItWorks`
- **Pattern:** `'use client'`, Framer Motion (`motion`, `useInView`, `useReducedMotion`), `useLanguage`
- **i18n:** Eyebrow, title, and subtitle strings added to the language context. Tech names and category labels are the same in both languages.

---

## Layout

### Desktop (≥ md)

Two-column split:

| Column | Width | Content |
|--------|-------|---------|
| Left | 45% | Animated orbital diagram |
| Right | 55% | Category list with pills |

### Mobile (< md)

Single column. The orbital diagram is hidden (`hidden md:block`). Only the category list is shown, stacked vertically.

---

## Orbital Diagram (left column, desktop only)

Four concentric rings, one per category, each with its own color and rotation speed:

| Ring | Category | Color | Speed |
|------|----------|-------|-------|
| Outer | Frontend | `#0ea5e9` | 18s |
| 2nd | Backend | `#8b5cf6` | 13s |
| 3rd | Cloud & DevOps | `#10b981` | 9s |
| Inner | Mobile & AI | `#f59e0b` | 6s |

- Each ring border uses the category color at low opacity (`20`).
- Tech icons (colored squares with abbreviated name) orbit their ring using `@keyframes` CSS rotation on a wrapper div, with counter-rotation on the icon to keep it upright.
- Multiple icons per ring use `animation-delay` to distribute them evenly.
- Center: small circle with a gradient (`#4F7EFF → #6366f1`) and a glow shadow, displaying "GDE".
- `useReducedMotion`: if true, all `animation` CSS properties are set to `none`.

---

## Category List (right column)

Each category block:

1. **Dot** — 8×8px circle, category color with `box-shadow` glow
2. **Label** — category name in uppercase, `font-display`, category color
3. **Pills** — tech names as `<span>` elements with `background: {color}15`, `border: 1px solid {color}30`, `color: #94a3b8`, `border-radius: 4px`

### Technologies

| Category | Color | Technologies |
|----------|-------|--------------|
| Frontend | `#0ea5e9` | Next.js, Angular, Vue.js, TypeScript, Vite |
| Backend | `#8b5cf6` | FastAPI, Express.js, Django, Python, Deno |
| Cloud & DevOps | `#10b981` | AWS, Google Cloud, Firebase, Supabase |
| Mobile & AI | `#f59e0b` | Flutter, Kotlin, TensorFlow, PyTorch |

---

## Animation & Entrance

- Section fades in on scroll via `useInView` with `once: true, margin: '-80px'` (same as other sections).
- Eyebrow, title, and category list animate with `opacity: 0 → 1` and `y: 16 → 0`, staggered by `0.08s` per element.
- The orbital diagram appears with `opacity: 0 → 1` on scroll; individual ring animations are pure CSS.

---

## i18n Strings

Keys to add to the language context (both `en` and `es`):

```ts
techStack: {
  eyebrow: 'Our Tech Stack' | 'Nuestro Stack Tecnológico',
  title: 'Tools we master' | 'Herramientas que dominamos',
}
```

Category labels (`Frontend`, `Backend`, `Cloud & DevOps`, `Mobile & AI`) are identical in both languages.

---

## Placement in `page.tsx`

```tsx
// Before:
<Services />
<HowItWorks />

// After:
<Services />
<TechStack />
<HowItWorks />
```

`TechStack` uses `dynamic()` import with default options (SSR enabled, no `ssr: false` needed — no browser-only APIs).

---

## Non-Goals

- No interactivity (hover state, click, drawer) — keep it purely visual.
- No SVG paths or canvas — pure CSS + Framer Motion only.
- No logos/images — abbreviated text labels inside colored squares to avoid asset management overhead.
