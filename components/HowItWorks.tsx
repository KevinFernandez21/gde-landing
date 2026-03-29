'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/language-context'

const stepNumbers = ['01', '02', '03', '04']

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const { t } = useLanguage()

  return (
    <section id="como-funciona" className="py-14 md:py-20 lg:py-24 px-6" style={{ background: '#0D1018' }} ref={ref}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        <motion.p
          className="font-display"
          initial={reduce ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', textAlign: 'center', marginBottom: 16 }}
        >
          {t.howItWorks.eyebrow}
        </motion.p>

        <motion.h2
          className="font-display"
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#FFFFFF', textAlign: 'center', marginBottom: 40, lineHeight: 1.1 }}
        >
          {t.howItWorks.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.howItWorks.steps.map((s, i) => (
            <motion.div
              key={stepNumbers[i]}
              initial={reduce ? {} : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <span className="font-display" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1, color: 'rgba(79,126,255,0.2)' }}>
                {stepNumbers[i]}
              </span>
              <div>
                <h3 className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#EAECF4', marginBottom: 8 }}>{s.title}</h3>
                <p className="font-body" style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
