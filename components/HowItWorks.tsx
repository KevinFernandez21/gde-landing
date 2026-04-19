'use client'

import { LazyMotion, m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/language-context'

const loadFeatures = () => import('framer-motion').then(mod => mod.domAnimation)

const stepNumbers = ['01', '02', '03', '04']

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const { t } = useLanguage()

  return (
    <LazyMotion features={loadFeatures} strict>
      <section id="como-funciona" className="py-14 md:py-20 lg:py-24 px-6" style={{ background: '#0D1018' }} ref={ref}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>

          <m.p
            className="font-display"
            initial={reduce ? {} : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', textAlign: 'center', marginBottom: 16 }}
          >
            {t.howItWorks.eyebrow}
          </m.p>

          <m.h2
            className="font-display"
            initial={reduce ? {} : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#FFFFFF', textAlign: 'center', marginBottom: 40, lineHeight: 1.1 }}
          >
            {t.howItWorks.title}
          </m.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.howItWorks.steps.map((s, i) => (
              <m.div
                key={stepNumbers[i]}
                initial={reduce ? {} : { opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 16,
                  borderTop: '2px solid rgba(79,126,255,0.35)',
                  paddingTop: 24,
                }}
              >
                <span className="font-display" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1, color: 'rgba(79,126,255,0.5)' }}>
                  {stepNumbers[i]}
                </span>
                <div>
                  <h3 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>{s.title}</h3>
                  <p className="font-body" style={{ fontSize: 14, color: '#A8B8D0', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </m.div>
            ))}
          </div>

        </div>
      </section>
    </LazyMotion>
  )
}
