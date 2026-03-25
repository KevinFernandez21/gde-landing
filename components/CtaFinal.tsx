'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export default function CtaFinal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  const anim = (delay = 0) => ({
    initial: reduce ? {} : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay },
  })

  return (
    <section
      id="contacto"
      className="relative px-6 py-28 text-center border-t border-[rgba(124,58,237,0.3)]"
      style={{ background: 'linear-gradient(135deg, #0d0820 0%, #180830 100%)' }}
      ref={ref}
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          {...anim(0)}
          className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-6"
        >
          ¿Listo para automatizar tu negocio con IA?
        </motion.h2>
        <motion.p {...anim(0.1)} className="text-lg text-text-muted leading-relaxed mb-10">
          Hablemos sobre cómo la inteligencia artificial puede transformar tus procesos y escalar tu empresa.
        </motion.p>
        <motion.div {...anim(0.2)}>
          <a
            href="mailto:contacto@gptfy.biz"
            className="inline-flex items-center px-10 py-5 rounded-full bg-accent-violet text-white text-lg font-semibold hover:bg-accent-violet/80 transition-all hover:scale-105 active:scale-95"
          >
            Hablar con un experto
          </a>
        </motion.div>
      </div>
    </section>
  )
}
