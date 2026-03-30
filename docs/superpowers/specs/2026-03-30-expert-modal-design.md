# Expert Modal — Design Spec
Date: 2026-03-30

## Goal
When any "Hablar con un experto" button is clicked anywhere on the landing page, display a modal overlay with two options so the user can choose how to proceed.

## Architecture

### New files
- `lib/expert-modal-context.tsx` — React context providing `openModal()`, `closeModal()`, and `isOpen` state
- `components/ExpertModal.tsx` — The modal UI with two cards

### Modified files
- `app/layout.tsx` — Wrap children with `ExpertModalProvider`; mount `<ExpertModal />` inside the provider
- `components/ui/header-2.tsx` — Desktop and mobile CTA buttons call `openModal()` instead of linking to `#contacto`
- `components/Hero.tsx` — Primary CTA calls `openModal()` instead of linking to `#contacto`
- `components/CtaFinal.tsx` — Button calls `openModal()` instead of `mailto:`

### New dependency
- `@calendly/react-widget` — Calendly inline embed component

## Modal UI

### Layout
Full-screen overlay (`position: fixed, inset: 0, z-index: 100`) with a semi-transparent dark backdrop. Centered container with two cards displayed side by side on desktop, stacked on mobile. A close button (✕) in the top-right corner of the container.

### Card 1 — "Agendar cita"
- Title: "Agendar cita" (ES) / "Schedule a call" (EN)
- Short description: "Elige el horario que mejor te convenga." / "Pick a time that works for you."
- Calendly inline embed (`InlineWidget` from `@calendly/react-widget`) with URL placeholder: `https://calendly.com/PLACEHOLDER/consulta`
- On `calendly.event_scheduled` window event: close modal automatically

### Card 2 — "Te diagnosticamos tu problema"
- Title: "Te diagnosticamos tu problema" (ES) / "We diagnose your problem" (EN)
- Short description: "Cuéntanos tu caso y nuestro equipo lo analiza." / "Tell us your case and our team will analyze it."
- No actions — informational card only, no buttons or links

### Styling
Matches existing site: dark background (`#0A0A0A`), white text (`#FFFFFF`), blue accent (`#4F7EFF`), muted text (`#8B9AB5`). Cards use `rgba(255,255,255,0.04)` background with a `1px solid rgba(255,255,255,0.08)` border and `16px` border radius.

## Behavior
- Clicking outside the modal container closes it
- Clicking ✕ closes it
- `calendly.event_scheduled` event closes it (user finished booking → returns to landing)
- Body scroll is locked while modal is open
- Translations use the existing `useLanguage()` hook and `lib/translations.ts`

## Translations to add
Add to `lib/translations.ts` under both `es` and `en`:
```
expertModal: {
  scheduleTitle: 'Agendar cita' / 'Schedule a call',
  scheduleDesc: 'Elige el horario que mejor te convenga.' / 'Pick a time that works for you.',
  diagnoseTitle: 'Te diagnosticamos tu problema' / 'We diagnose your problem',
  diagnoseDesc: 'Cuéntanos tu caso y nuestro equipo lo analiza.' / 'Tell us your case and our team will analyze it.',
}
```

## Out of scope
- Backend for the "Te diagnosticamos" card (future feature)
- Any form submission logic
- Calendly account configuration (user provides real URL replacing PLACEHOLDER)
