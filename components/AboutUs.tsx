'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Bot, Workflow, Zap, Code2 } from 'lucide-react'

const miniCards = [
  { icon: Bot,      label: 'Chatbots & Agentes' },
  { icon: Workflow, label: 'Flujos Inteligentes' },
  { icon: Zap,      label: 'Automatización' },
  { icon: Code2,    label: 'Software a la Medida' },
]

export default function AboutUs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  const anim = (delay = 0) => ({
    initial: reduce ? {} : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay },
  })

  return (
    <section id="nosotros" className="px-6 py-24" ref={ref}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.p {...anim(0)} className="text-xs uppercase tracking-widest text-accent-teal mb-4">
            Quiénes Somos
          </motion.p>
          <motion.h2 {...anim(0.1)} className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-6">
            Impulsamos negocios con Inteligencia Artificial
          </motion.h2>
          <motion.p {...anim(0.2)} className="text-text-muted leading-relaxed text-base">
            Somos un equipo especializado en soluciones de IA para empresas y emprendedores de
            Latinoamérica. Diseñamos, construimos y desplegamos tecnología que automatiza, escala
            y transforma negocios reales.
          </motion.p>
        </div>

        <motion.div {...anim(0.3)} className="grid grid-cols-2 gap-4">
          {miniCards.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="bg-bg-card border border-white/[0.07] rounded-xl p-5 flex flex-col items-start gap-3"
            >
              <Icon size={22} className="text-accent-violet" />
              <p className="text-sm font-medium text-text-primary">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
