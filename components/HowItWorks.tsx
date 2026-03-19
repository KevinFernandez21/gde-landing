'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  { n: '01', title: 'Únete', desc: 'Ingresa a la comunidad GDE y conecta con emprendedores afines.' },
  { n: '02', title: 'Aprende', desc: 'Accede a contenido, podcasts y eventos exclusivos.' },
  { n: '03', title: 'Conéctate', desc: 'Colabora con socios, mentores y aliados estratégicos.' },
  { n: '04', title: 'Escala', desc: 'Lanza o crece tu negocio con apoyo real.' },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  return (
    <section className="px-6 py-24" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-widest text-accent-teal text-center mb-3"
        >
          Proceso
        </motion.p>
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary text-center mb-16"
        >
          De la idea al negocio en 4 pasos
        </motion.h2>

        <div className="relative flex flex-col md:flex-row gap-8 md:gap-0">
          <div
            className="hidden md:block absolute top-8 left-[calc(12.5%)] right-[calc(12.5%)] h-[2px]"
            style={{ background: 'linear-gradient(to right, #7c3aed, #06d6a0)' }}
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={reduce ? {} : { opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              className="flex-1 flex flex-col items-center text-center px-4"
            >
              <div className="relative z-10 w-16 h-16 rounded-full bg-accent-violet flex items-center justify-center text-white font-bold text-sm mb-5 shrink-0">
                {s.n}
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">{s.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
