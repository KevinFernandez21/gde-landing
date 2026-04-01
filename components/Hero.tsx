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

        <p className="font-body" style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', maxWidth: 380, margin: '0 auto 40px', textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}>
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
            style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s', pointerEvents: 'auto', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
          >
            {t.hero.secondary}
          </a>
        </div>
      </div>
    </section>
  )
}
