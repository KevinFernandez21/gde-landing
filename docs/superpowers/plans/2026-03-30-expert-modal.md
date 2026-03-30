# Expert Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global modal that opens when any "Hablar con un experto" button is clicked, showing two cards: Calendly inline embed (schedule) and a static diagnosis card.

**Architecture:** A React context (`ExpertModalContext`) manages open/close state globally. A single `ExpertModal` component is mounted once in `app/layout.tsx` inside the existing `LanguageProvider`. All three CTA buttons (Navbar, Hero, CtaFinal) call `openModal()` from the context instead of navigating. Calendly fires a `calendly.event_scheduled` window event on booking completion, which closes the modal.

**Tech Stack:** Next.js 14, React 18, TypeScript, Framer Motion, `@calendly/react-widget`, Tailwind CSS (inline styles to match existing pattern)

---

### Task 1: Add translations

**Files:**
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add `expertModal` key to ES translations**

In `lib/translations.ts`, inside the `es` object (after the `cta` block, before `footer`):

```typescript
    expertModal: {
      scheduleTitle: 'Agendar cita',
      scheduleDesc:  'Elige el horario que mejor te convenga.',
      diagnoseTitle: 'Te diagnosticamos tu problema',
      diagnoseDesc:  'Cuéntanos tu caso y nuestro equipo lo analiza.',
    },
```

- [ ] **Step 2: Add `expertModal` key to EN translations**

In `lib/translations.ts`, inside the `en` object (after the `cta` block, before `footer`):

```typescript
    expertModal: {
      scheduleTitle: 'Schedule a call',
      scheduleDesc:  'Pick a time that works for you.',
      diagnoseTitle: 'We diagnose your problem',
      diagnoseDesc:  'Tell us your case and our team will analyze it.',
    },
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/hombrenaranja/Desktop/project/MEGAMENTE/gde-landing && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/translations.ts
git commit -m "feat: add expertModal translation keys"
```

---

### Task 2: Install Calendly widget

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Install the package**

```bash
cd /home/hombrenaranja/Desktop/project/MEGAMENTE/gde-landing && pnpm add @calendly/react-widget
```
Expected: package added, no errors.

- [ ] **Step 2: Verify types are available**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: install @calendly/react-widget"
```

---

### Task 3: Create ExpertModalContext

**Files:**
- Create: `lib/expert-modal-context.tsx`

- [ ] **Step 1: Create the context file**

Create `lib/expert-modal-context.tsx` with this exact content:

```typescript
'use client'

import React from 'react'

type ExpertModalContextValue = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ExpertModalContext = React.createContext<ExpertModalContextValue>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
})

export function ExpertModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const openModal = React.useCallback(() => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = React.useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }, [])

  return (
    <ExpertModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ExpertModalContext.Provider>
  )
}

export function useExpertModal() {
  return React.useContext(ExpertModalContext)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/hombrenaranja/Desktop/project/MEGAMENTE/gde-landing && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/expert-modal-context.tsx
git commit -m "feat: add ExpertModalContext"
```

---

### Task 4: Create ExpertModal component

**Files:**
- Create: `components/ExpertModal.tsx`

- [ ] **Step 1: Create the modal component**

Create `components/ExpertModal.tsx` with this exact content:

```typescript
'use client'

import React from 'react'
import { InlineWidget } from '@calendly/react-widget'
import { useExpertModal } from '@/lib/expert-modal-context'
import { useLanguage } from '@/lib/language-context'

const CALENDLY_URL = 'https://calendly.com/PLACEHOLDER/consulta'

export default function ExpertModal() {
  const { isOpen, closeModal } = useExpertModal()
  const { t } = useLanguage()

  // Close modal when Calendly booking is completed
  React.useEffect(() => {
    function handleCalendlyEvent(e: MessageEvent) {
      if (e.data?.event === 'calendly.event_scheduled') {
        closeModal()
      }
    }
    window.addEventListener('message', handleCalendlyEvent)
    return () => window.removeEventListener('message', handleCalendlyEvent)
  }, [closeModal])

  // Close on Escape key
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, closeModal])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={closeModal}
    >
      {/* Container — stops click propagation so clicking inside doesn't close */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 20,
          backgroundColor: '#0A0A0A',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8B9AB5',
            fontSize: 24,
            lineHeight: 1,
            padding: 4,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
        >
          ✕
        </button>

        {/* Cards row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          {/* Card 1 — Schedule */}
          <div
            style={{
              flex: '1 1 320px',
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '28px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <p
              className="font-display"
              style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
            >
              {t.expertModal.scheduleTitle}
            </p>
            <p
              className="font-body"
              style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.6, marginBottom: 8 }}
            >
              {t.expertModal.scheduleDesc}
            </p>
            <div style={{ borderRadius: 12, overflow: 'hidden', minHeight: 580 }}>
              <InlineWidget
                url={CALENDLY_URL}
                styles={{ height: 580, minWidth: 280 }}
              />
            </div>
          </div>

          {/* Card 2 — Diagnose */}
          <div
            style={{
              flex: '1 1 280px',
              borderRadius: 16,
              backgroundColor: 'rgba(79,126,255,0.05)',
              border: '1px solid rgba(79,126,255,0.15)',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <p
              className="font-display"
              style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
            >
              {t.expertModal.diagnoseTitle}
            </p>
            <p
              className="font-body"
              style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.6 }}
            >
              {t.expertModal.diagnoseDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/hombrenaranja/Desktop/project/MEGAMENTE/gde-landing && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ExpertModal.tsx
git commit -m "feat: add ExpertModal component with Calendly embed"
```

---

### Task 5: Mount provider and modal in layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update layout.tsx**

Replace the entire content of `app/layout.tsx` with:

```typescript
import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import { ExpertModalProvider } from '@/lib/expert-modal-context'
import ExpertModal from '@/components/ExpertModal'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

const dm = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'GDE — Grupo Digital Ecommerce',
  description: 'Automatiza, escala y transforma tu empresa con chatbots, flujos inteligentes y agentes de IA.',
  icons: {
    icon: '/Logo/logo.jpeg',
    apple: '/Logo/logo.jpeg',
  },
  openGraph: {
    title: 'GDE — Grupo Digital Ecommerce',
    description: 'Automatiza, escala y transforma tu empresa con chatbots, flujos inteligentes y agentes de IA.',
    url: 'https://gptfy.biz',
    siteName: 'GDE',
    locale: 'es_LA',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dm.variable}`}>
      <body className="bg-base font-body text-fore antialiased">
        <LanguageProvider>
          <ExpertModalProvider>
            {children}
            <ExpertModal />
          </ExpertModalProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/hombrenaranja/Desktop/project/MEGAMENTE/gde-landing && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount ExpertModalProvider and ExpertModal in layout"
```

---

### Task 6: Wire up Navbar CTA buttons

**Files:**
- Modify: `components/ui/header-2.tsx`

- [ ] **Step 1: Update header-2.tsx**

Replace the entire content of `components/ui/header-2.tsx` with:

```typescript
'use client'
import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon'
import { useScroll } from '@/components/ui/use-scroll'
import { useLanguage } from '@/lib/language-context'
import { useExpertModal } from '@/lib/expert-modal-context'
import type { Lang } from '@/lib/translations'

export function Header() {
  const [open, setOpen] = React.useState(false)
  const scrolled = useScroll(10)
  const { lang, setLanguage, t } = useLanguage()
  const { openModal } = useExpertModal()

  const links = [
    { label: t.nav.services,   href: '#servicios' },
    { label: t.nav.howItWorks, href: '#como-funciona' },
    { label: t.nav.about,      href: '#nosotros' },
  ]

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const LangToggle = () => (
    <div className="flex items-center gap-1 font-body" style={{ fontSize: 12 }}>
      {(['es', 'en'] as Lang[]).map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span style={{ color: '#8B9AB5' }}>|</span>}
          <button
            onClick={() => setLanguage(l)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
              color: lang === l ? '#FFFFFF' : '#8B9AB5',
              fontWeight: lang === l ? 600 : 400,
              fontSize: 12,
              transition: 'color 0.2s',
              fontFamily: 'var(--font-dm)',
              textTransform: 'uppercase',
            }}
          >
            {l}
          </button>
        </React.Fragment>
      ))}
    </div>
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-5xl md:rounded-full md:transition-all md:ease-out',
        {
          'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow-lg':
            scrolled && !open,
          'bg-background/90': open,
        },
      )}
    >
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
          { 'md:px-2': scrolled },
        )}
      >
        {/* Logo */}
        <a href="#" className="flex items-center">
          <span style={{ fontSize: 18, fontWeight: 700, color: 'rgb(var(--foreground))', letterSpacing: '0.1em', fontFamily: 'Georgia, serif' }}>
            GDE
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link, i) => (
            <a key={i} className={buttonVariants({ variant: 'ghost' })} href={link.href}
              style={{ fontFamily: 'var(--font-dm)', fontSize: 13 }}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right: lang toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LangToggle />
          <button
            onClick={openModal}
            className={buttonVariants({ variant: 'default' })}
            style={{ fontFamily: 'var(--font-dm)', fontSize: 13 }}
          >
            {t.nav.cta}
          </button>
        </div>

        {/* Mobile hamburger */}
        <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden">
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      {/* Mobile drawer */}
      <div className={cn(
        'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
        open ? 'block' : 'hidden',
      )}>
        <div data-slot={open ? 'open' : 'closed'} className={cn(
          'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
          'flex h-full w-full flex-col justify-between gap-y-2 p-4',
        )}>
          <div className="grid gap-y-2">
            {links.map((link) => (
              <a key={link.label}
                className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
                href={link.href} onClick={() => setOpen(false)}
                style={{ fontFamily: 'var(--font-dm)' }}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <LangToggle />
            </div>
            <button
              onClick={() => { setOpen(false); openModal() }}
              className={buttonVariants({ variant: 'default', className: 'w-full justify-center' })}
              style={{ fontFamily: 'var(--font-dm)' }}
            >
              {t.nav.cta}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/hombrenaranja/Desktop/project/MEGAMENTE/gde-landing && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/header-2.tsx
git commit -m "feat: wire Navbar CTA to openModal"
```

---

### Task 7: Wire up Hero CTA button

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Update Hero.tsx**

Replace the entire content of `components/Hero.tsx` with:

```typescript
'use client'

import { ShaderAnimation } from '@/components/ui/shader-animation'
import { useLanguage } from '@/lib/language-context'
import { useExpertModal } from '@/lib/expert-modal-context'

export default function Hero() {
  const { t } = useLanguage()
  const { openModal } = useExpertModal()

  return (
    <section style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>
      <ShaderAnimation />

      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>

        <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92, color: '#FFFFFF', maxWidth: 800, margin: '0 auto 32px' }}>
          {t.hero.lines.map((line, i) => (
            <span key={i}>{line}{i < t.hero.lines.length - 1 && <br />}</span>
          ))}
        </h1>

        <p className="font-body" style={{ fontSize: 16, lineHeight: 1.7, color: '#8B9AB5', maxWidth: 380, margin: '0 auto 40px' }}>
          {t.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <button
            onClick={openModal}
            className="font-body"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: 999, backgroundColor: '#4F7EFF', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3560E8')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4F7EFF')}
          >
            {t.hero.cta}
          </button>
          <a
            href="#servicios"
            className="font-body"
            style={{ fontSize: 14, color: '#8B9AB5', textDecoration: 'none', transition: 'color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#EAECF4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
          >
            {t.hero.secondary}
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/hombrenaranja/Desktop/project/MEGAMENTE/gde-landing && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: wire Hero CTA to openModal"
```

---

### Task 8: Wire up CtaFinal button

**Files:**
- Modify: `components/CtaFinal.tsx`

- [ ] **Step 1: Update CtaFinal.tsx**

Replace the entire content of `components/CtaFinal.tsx` with:

```typescript
'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useExpertModal } from '@/lib/expert-modal-context'

export default function CtaFinal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const { t } = useLanguage()
  const { openModal } = useExpertModal()

  const anim = (delay = 0) => ({
    initial: reduce ? {} : { opacity: 0, y: 16 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay },
  })

  return (
    <section
      id="contacto"
      className="py-16 md:py-24 lg:py-32 px-6"
      style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      ref={ref}
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        <motion.p
          className="font-display"
          {...anim(0)}
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', marginBottom: 24 }}
        >
          {t.cta.eyebrow}
        </motion.p>

        <motion.h2
          className="font-display"
          {...anim(0.08)}
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#FFFFFF', marginBottom: 24, lineHeight: 1.05 }}
        >
          {t.cta.title}
        </motion.h2>

        <motion.p
          className="font-body"
          {...anim(0.16)}
          style={{ fontSize: 14, color: '#8B9AB5', lineHeight: 1.75, marginBottom: 40, maxWidth: 420, margin: '0 auto 40px' }}
        >
          {t.cta.description}
        </motion.p>

        <motion.div {...anim(0.24)}>
          <button
            onClick={openModal}
            className="font-body"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', borderRadius: 999, backgroundColor: '#4F7EFF', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3560E8')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4F7EFF')}
          >
            {t.cta.button}
          </button>
        </motion.div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/hombrenaranja/Desktop/project/MEGAMENTE/gde-landing && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/CtaFinal.tsx
git commit -m "feat: wire CtaFinal CTA to openModal"
```

---

### Task 9: Smoke test in browser

- [ ] **Step 1: Start dev server**

```bash
cd /home/hombrenaranja/Desktop/project/MEGAMENTE/gde-landing && pnpm dev
```
Expected: server starts on `http://localhost:3000`, no build errors.

- [ ] **Step 2: Manual checklist**

Open `http://localhost:3000` and verify:
- [ ] Clicking "Hablar con un experto" in the Navbar opens the modal
- [ ] Clicking "Hablar con un experto" in the Hero section opens the modal
- [ ] Clicking "Hablar con un experto" in the CtaFinal section opens the modal
- [ ] Both cards are visible side by side (desktop) or stacked (narrow viewport)
- [ ] Clicking the ✕ button closes the modal
- [ ] Clicking the backdrop (outside the modal) closes the modal
- [ ] Pressing Escape closes the modal
- [ ] Body scroll is locked while modal is open and restored on close
- [ ] Calendly embed loads inside Card 1
- [ ] Language toggle (ES/EN) updates both card titles and descriptions

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: expert modal complete — Calendly embed + diagnose card"
```
