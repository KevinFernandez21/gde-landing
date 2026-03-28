'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export default function CtaFinal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

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
          Empecemos
        </motion.p>

        <motion.h2
          className="font-display"
          {...anim(0.08)}
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#FFFFFF', marginBottom: 24, lineHeight: 1.05 }}
        >
          ¿Listo para automatizar tu negocio?
        </motion.h2>

        <motion.p
          className="font-body"
          {...anim(0.16)}
          style={{ fontSize: 14, color: '#8B9AB5', lineHeight: 1.75, marginBottom: 40, maxWidth: 420, margin: '0 auto 40px' }}
        >
          Hablemos sobre cómo la IA puede transformar tus procesos y escalar tu empresa.
        </motion.p>

        <motion.div {...anim(0.24)}>
          <a
            href="mailto:contacto@gptfy.biz"
            className="font-body"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', borderRadius: 999, backgroundColor: '#4F7EFF', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'background-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3560E8')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4F7EFF')}
          >
            Hablar con un experto
          </a>
        </motion.div>

      </div>
    </section>
  )
}
