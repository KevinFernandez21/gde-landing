# Tech Stack Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `TechStack` section between `Services` and `HowItWorks` that displays the team's technologies via an animated orbital diagram (desktop) and a color-coded category list (both breakpoints).

**Architecture:** Single new component `components/TechStack.tsx` with no sub-files. i18n strings added to `lib/translations.ts`. Registered in `app/page.tsx` as a dynamic import. Pure CSS animations for the orbit; Framer Motion only for the scroll-triggered entrance — matching the rest of the site.

**Tech Stack:** Next.js 14, React 18, Framer Motion, TypeScript, inline styles (site convention — no Tailwind for custom sections).

---

## File Map

| Action | File | What changes |
|--------|------|--------------|
| Modify | `lib/translations.ts` | Add `techStack` key to both `es` and `en` objects |
| Create | `components/TechStack.tsx` | New section component |
| Modify | `app/page.tsx` | Dynamic import + place between Services and HowItWorks |

---

## Task 1: Add i18n strings

**Files:**
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add `techStack` to the `es` object**

In `lib/translations.ts`, inside the `es` object, after the `services` block and before `howItWorks`, add:

```ts
    techStack: {
      eyebrow: 'Nuestro Stack',
      title:   'Tecnologías que dominamos',
    },
```

- [ ] **Step 2: Add `techStack` to the `en` object**

In `lib/translations.ts`, inside the `en` object, after the `services` block and before `howItWorks`, add:

```ts
    techStack: {
      eyebrow: 'Our Stack',
      title:   'Technologies we master',
    },
```

- [ ] **Step 3: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors. The `T` type is inferred from `typeof translations['es']`, so adding the key to both objects is enough — no manual type declaration needed.

- [ ] **Step 4: Commit**

```bash
git add lib/translations.ts
git commit -m "feat(i18n): add techStack strings for tech section"
```

---

## Task 2: Create TechStack component

**Files:**
- Create: `components/TechStack.tsx`

- [ ] **Step 1: Create the file with data and types**

Create `components/TechStack.tsx`:

```tsx
'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/language-context'

// ─── Data ──────────────────────────────────────────────────────────

type Tech = { label: string; abbr: string }

type Category = {
  name: string
  color: string
  ringSize: number      // diameter in px
  orbitDuration: string // CSS animation duration
  techs: Tech[]
}

const CATEGORIES: Category[] = [
  {
    name: 'Frontend',
    color: '#0ea5e9',
    ringSize: 280,
    orbitDuration: '18s',
    techs: [
      { label: 'Next.js',    abbr: 'Nx' },
      { label: 'Angular',    abbr: 'Ng' },
      { label: 'Vue.js',     abbr: 'Vu' },
      { label: 'TypeScript', abbr: 'TS' },
      { label: 'Vite',       abbr: 'Vi' },
    ],
  },
  {
    name: 'Backend',
    color: '#8b5cf6',
    ringSize: 210,
    orbitDuration: '13s',
    techs: [
      { label: 'FastAPI',    abbr: 'FA' },
      { label: 'Express.js', abbr: 'Ex' },
      { label: 'Django',     abbr: 'Dj' },
      { label: 'Python',     abbr: 'Py' },
      { label: 'Deno',       abbr: 'De' },
    ],
  },
  {
    name: 'Cloud & DevOps',
    color: '#10b981',
    ringSize: 150,
    orbitDuration: '9s',
    techs: [
      { label: 'AWS',          abbr: 'AW' },
      { label: 'Google Cloud', abbr: 'GC' },
      { label: 'Firebase',     abbr: 'Fb' },
      { label: 'Supabase',     abbr: 'Su' },
    ],
  },
  {
    name: 'Mobile & AI',
    color: '#f59e0b',
    ringSize: 90,
    orbitDuration: '6s',
    techs: [
      { label: 'Flutter',    abbr: 'Fl' },
      { label: 'Kotlin',     abbr: 'Ko' },
      { label: 'TensorFlow', abbr: 'TF' },
      { label: 'PyTorch',    abbr: 'PT' },
    ],
  },
]
```

- [ ] **Step 2: Add the OrbitalDiagram sub-component**

Append to `components/TechStack.tsx`, after the data block:

```tsx
// ─── Orbital Diagram ───────────────────────────────────────────────

function OrbitalIcon({ abbr, color }: { abbr: string; color: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        boxShadow: `0 0 14px ${color}70`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 8,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-0.01em',
        // counter-rotate so icon text stays upright
        animation: 'counter-spin var(--orbit-duration) linear infinite',
      }}
    >
      {abbr}
    </div>
  )
}

function Ring({
  category,
  reduced,
}: {
  category: Category
  reduced: boolean | null
}) {
  const { color, ringSize, orbitDuration, techs } = category
  const iconSize = 32

  return (
    <div
      style={{
        position: 'absolute',
        width: ringSize,
        height: ringSize,
        borderRadius: '50%',
        border: `1px solid ${color}25`,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {techs.map((tech, i) => {
        const angle = (360 / techs.length) * i
        const delayFraction = i / techs.length
        const delaySeconds = -(parseFloat(orbitDuration) * delayFraction)

        return (
          <div
            key={tech.label}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              animation: reduced
                ? 'none'
                : `orbit ${orbitDuration} linear infinite`,
              animationDelay: `${delaySeconds}s`,
              // CSS custom property so counter-spin can read the same duration
              ['--orbit-duration' as string]: orbitDuration,
              transform: `rotate(${angle}deg)`,
            }}
          >
            {/* Icon sits at the top of the rotated wrapper */}
            <div
              style={{
                position: 'absolute',
                top: -iconSize / 2,
                left: `calc(50% - ${iconSize / 2}px)`,
              }}
            >
              <OrbitalIcon abbr={tech.abbr} color={color} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function OrbitalDiagram({ reduced }: { reduced: boolean | null }) {
  return (
    <div
      className="hidden md:flex"
      style={{
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        // height matches the outermost ring diameter + icon bleed
        height: 320,
      }}
    >
      {CATEGORIES.map(cat => (
        <Ring key={cat.name} category={cat} reduced={reduced} />
      ))}

      {/* Center */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F7EFF, #6366f1)',
          boxShadow: '0 0 28px #4F7EFF50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 8,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '0.04em',
        }}
      >
        GDE
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(var(--start-angle, 0deg)); }
          to   { transform: rotate(calc(var(--start-angle, 0deg) + 360deg)); }
        }
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 3: Add the CategoryList sub-component**

Append to `components/TechStack.tsx`:

```tsx
// ─── Category List ─────────────────────────────────────────────────

function CategoryList({ inView, reduced }: { inView: boolean; reduced: boolean | null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {CATEGORIES.map((cat, i) => (
        <motion.div
          key={cat.name}
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
        >
          {/* Category label row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: cat.color,
                boxShadow: `0 0 6px ${cat.color}`,
                flexShrink: 0,
              }}
            />
            <span
              className="font-display"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: cat.color,
              }}
            >
              {cat.name}
            </span>
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: 18 }}>
            {cat.techs.map(tech => (
              <span
                key={tech.label}
                className="font-body"
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  background: `${cat.color}12`,
                  border: `1px solid ${cat.color}30`,
                  borderRadius: 5,
                  padding: '4px 10px',
                }}
              >
                {tech.label}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Add the main export**

Append to `components/TechStack.tsx`:

```tsx
// ─── Section ───────────────────────────────────────────────────────

export default function TechStack() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  return (
    <section
      id="stack"
      className="py-14 md:py-20 lg:py-24 px-6"
      ref={ref}
    >
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        {/* Eyebrow */}
        <motion.p
          className="font-display"
          initial={reduced ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#4F7EFF',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          {t.techStack.eyebrow}
        </motion.p>

        {/* Title */}
        <motion.h2
          className="font-display"
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 56,
            lineHeight: 1.1,
          }}
        >
          {t.techStack.title}
        </motion.h2>

        {/* Split layout */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          <OrbitalDiagram reduced={reduced} />
          <CategoryList inView={inView} reduced={reduced} />
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/TechStack.tsx
git commit -m "feat: add TechStack section with orbital diagram"
```

---

## Task 3: Register in page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add dynamic import**

In `app/page.tsx`, after the `Services` dynamic import line, add:

```ts
const TechStack    = dynamic(() => import('@/components/TechStack'))
```

- [ ] **Step 2: Place the component in JSX**

In the `<main>` block, insert `<TechStack />` between `<Services />` and `<HowItWorks />`:

```tsx
      <Services />
      <TechStack />
      <HowItWorks />
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: register TechStack section in page"
```

---

## Verification Checklist

After all tasks are complete, open the site in the browser and verify:

- [ ] Section appears between Services and HowItWorks
- [ ] Eyebrow and title text are visible and centered
- [ ] Orbital diagram is visible on desktop (≥ md breakpoint), hidden on mobile
- [ ] All 4 rings animate at different speeds; icons stay upright (counter-rotation works)
- [ ] Center "GDE" circle glows blue
- [ ] Category list shows all 4 categories with correct colors and pills
- [ ] On mobile, only the category list shows — no broken layout
- [ ] Language switch (EN/ES) updates eyebrow and title
- [ ] `prefers-reduced-motion`: all orbital animations stop; entrance animations skip
- [ ] No TypeScript errors: `npx tsc --noEmit` passes clean
