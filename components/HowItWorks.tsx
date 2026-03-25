'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  { n: '01', title: 'Diagnóstico',  desc: 'Analizamos tus procesos y detectamos dónde la IA genera mayor impacto.' },
  { n: '02', title: 'Diseño',       desc: 'Creamos la arquitectura de solución adaptada a tus sistemas y objetivos.' },
  { n: '03', title: 'Desarrollo',   desc: 'Construimos e integramos la solución con pruebas rigurosas en cada etapa.' },
  { n: '04', title: 'Despliegue',   desc: 'Lanzamos, monitoreamos y optimizamos continuamente tu solución de IA.' },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  return (
    <section id="como-funciona" className="px-6 py-24" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-widest text-accent-teal text-center mb-3"
        >
          Metodología
        </motion.p>
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary text-center mb-16"
        >
          Cómo Trabajamos
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
