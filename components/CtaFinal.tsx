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
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        <motion.p
          className="font-display"
          {...anim(0)}
          style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', marginBottom: 24 }}
        >
          {t.cta.eyebrow}
        </motion.p>

        <motion.h2
          className="font-display"
          {...anim(0.08)}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#FFFFFF', marginBottom: 32, lineHeight: 1.05 }}
        >
          {t.cta.title}
        </motion.h2>

        <motion.p
          className="font-body"
          {...anim(0.16)}
          style={{ fontSize: 18, color: '#8B9AB5', lineHeight: 1.75, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}
        >
          {t.cta.description}
        </motion.p>

        <motion.div {...anim(0.24)}>
          <button
            onClick={openModal}
            className="font-body"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '16px 40px', borderRadius: 999, backgroundColor: '#4F7EFF', color: '#fff', fontSize: 16, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
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
