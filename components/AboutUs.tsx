'use client'

import { LazyMotion, m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Bot, Workflow, Zap, Code2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

const loadFeatures = () => import('framer-motion').then(mod => mod.domAnimation)

const miniCardIcons = [Bot, Workflow, Zap, Code2]

export default function AboutUs() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  const anim = (delay = 0) => ({
    initial: reduce ? {} : { opacity: 0, y: 16 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay },
  })

  return (
    <LazyMotion features={loadFeatures} strict>
      <section id="nosotros" className="py-14 md:py-20 lg:py-24 px-6" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center" style={{ maxWidth: 1152, margin: '0 auto' }}>

          {/* Text */}
          <div className="lg:col-span-7 pr-0 lg:pr-8">
            <m.p
              className="font-display"
              {...anim(0)}
              style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', marginBottom: 24 }}
            >
              {t.about.eyebrow}
            </m.p>
            <m.h2
              className="font-display"
              {...anim(0.08)}
              style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: 28, lineHeight: 1.25 }}
            >
              {t.about.title}
            </m.h2>
            <m.p
              className="font-body"
              {...anim(0.16)}
              style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}
            >
              {t.about.body}
            </m.p>
          </div>

          {/* Cards */}
          <m.div className="lg:col-span-5" {...anim(0.24)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {t.about.cards.map((label, i) => {
              const Icon = miniCardIcons[i]
              return (
                <div
                  key={label}
                  style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 0.3s', cursor: 'default' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#141924'; el.style.borderColor = 'rgba(79,126,255,0.3)'; el.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#0D1018'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateY(0)' }}
                >
                  <Icon size={36} style={{ color: '#FFFFFF' }} />
                  <p className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#EAECF4', lineHeight: 1.4 }}>{label}</p>
                </div>
              )
            })}
          </m.div>

        </div>
      </section>
    </LazyMotion>
  )
}
