'use client'

import dynamic from 'next/dynamic'
import { useLanguage } from '@/lib/language-context'
import { useExpertModal } from '@/lib/expert-modal-context'

// Three.js shader — loaded only on desktop; mobile never downloads this chunk
const ShaderAnimation = dynamic(
  () => import('@/components/ui/shader-animation').then(m => ({ default: m.ShaderAnimation })),
  { ssr: false }
)

function MobileBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 90% 70% at 50% 30%, #1a0840 0%, #0a051f 45%, #000 100%)',
      }}
    />
  )
}

interface HeroProps {
  isMobile?: boolean
  lines?: string[]
  description?: string
  ctaText?: string
  secondaryText?: string
  secondaryHref?: string
  onCtaClick?: () => void
}

export default function Hero({
  isMobile = false,
  lines,
  description,
  ctaText,
  secondaryText,
  secondaryHref = '#servicios',
  onCtaClick
}: HeroProps = {}) {
  const { t } = useLanguage()
  const { openModal } = useExpertModal()

  const heroLines       = lines       || t.hero.lines
  const heroDescription = description || t.hero.description
  const heroCtaText     = ctaText     || t.hero.cta
  const heroSecondaryText = secondaryText || t.hero.secondary
  const handleCtaClick  = onCtaClick  || openModal

  return (
    <section style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>

      {isMobile ? <MobileBackground /> : <ShaderAnimation />}

      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>

        <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95, color: '#FFFFFF', maxWidth: 1000, margin: '0 auto 32px' }}>
          {heroLines.map((line, i) => (
            <span key={i}>{line}{i < heroLines.length - 1 && <br />}</span>
          ))}
        </h1>

        <p className="font-body" style={{ fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)', maxWidth: 600, margin: '0 auto 40px', textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}>
          {heroDescription}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <button
            onClick={handleCtaClick}
            className="font-body"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: 999, backgroundColor: '#4F7EFF', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3560E8')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4F7EFF')}
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
