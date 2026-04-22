'use client'

import { useLanguage } from '@/lib/language-context'
import { useExpertModal } from '@/lib/expert-modal-context'

function MobileBackground() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
      {/* Purple nebula core */}
      <div style={{
        position: 'absolute', width: '160%', height: '160%', top: '-30%', left: '-30%',
        background: 'radial-gradient(ellipse 55% 55% at 50% 40%, rgba(90,30,180,0.85) 0%, transparent 68%)',
        animation: 'hero-orb-pulse 9s ease-in-out infinite',
        transformOrigin: 'center center',
      }} />
      {/* Blue orb left */}
      <div style={{
        position: 'absolute', width: '130%', height: '130%', top: '-15%', left: '-15%',
        background: 'radial-gradient(ellipse 45% 40% at 25% 65%, rgba(30,70,220,0.65) 0%, transparent 65%)',
        animation: 'hero-orb-drift 13s ease-in-out infinite',
      }} />
      {/* Red/pink orb right */}
      <div style={{
        position: 'absolute', width: '130%', height: '130%', top: '-15%', left: '-15%',
        background: 'radial-gradient(ellipse 40% 35% at 75% 35%, rgba(190,30,110,0.45) 0%, transparent 62%)',
        animation: 'hero-orb-drift-r 11s ease-in-out infinite',
      }} />
      {/* Green hint */}
      <div style={{
        position: 'absolute', width: '120%', height: '120%', top: '-10%', left: '-10%',
        background: 'radial-gradient(ellipse 35% 30% at 60% 75%, rgba(20,180,120,0.25) 0%, transparent 60%)',
        animation: 'hero-orb-drift 17s ease-in-out infinite reverse',
      }} />
      {/* Edge darken vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 38%, rgba(0,0,0,0.82) 100%)',
      }} />
    </div>
  )
}

interface HeroProps {
  lines?: string[]
  description?: string
  ctaText?: string
  secondaryText?: string
  secondaryHref?: string
  onCtaClick?: () => void
}

export default function Hero({
  lines,
  description,
  ctaText,
  secondaryText,
  secondaryHref = '#servicios',
  onCtaClick
}: HeroProps = {}) {
  const { t } = useLanguage()
  const { openModal } = useExpertModal()
  const heroLines         = lines       || t.hero.lines
  const heroDescription   = description || t.hero.description
  const heroCtaText       = ctaText     || t.hero.cta
  const heroSecondaryText = secondaryText || t.hero.secondary
  const handleCtaClick    = onCtaClick  || openModal

  return (
    <section style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>

      <MobileBackground />

      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>

        <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, min(8vw, 10.5vh), 5.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95, color: '#FFFFFF', maxWidth: 1000, margin: '0 auto 32px' }}>
          {heroLines.map((line, i) => (
            <span key={i}>{line}{i < heroLines.length - 1 && <br />}</span>
          ))}
        </h1>

        <p className="font-body" style={{ fontSize: 22, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)', maxWidth: 650, margin: '0 auto 40px', textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}>
          {heroDescription}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <button
            onClick={handleCtaClick}
            className="font-body"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: 999, backgroundColor: '#3560E8', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2B4FCC')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3560E8')}
          >
            {heroCtaText}
          </button>
          <a
            href={secondaryHref}
            className="font-body"
            style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s', pointerEvents: 'auto', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
          >
            {heroSecondaryText}
          </a>
        </div>
      </div>
    </section>
  )
}
