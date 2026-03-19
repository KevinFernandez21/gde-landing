'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Youtube, Mic, Calendar, Zap, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const services = [
  {
    icon: Youtube,
    title: 'YouTube & Contenido',
    description: 'Canal educativo con videos de valor para importadores y emprendedores.',
    accent: 'teal',
  },
  {
    icon: Mic,
    title: 'Podcast',
    description: 'Episodios con casos reales de negocios digitales.',
    accent: 'teal',
  },
  {
    icon: Calendar,
    title: 'Eventos & Ferias',
    description: 'Encuentros presenciales y virtuales para conectar la comunidad.',
    accent: 'teal',
  },
  {
    icon: Zap,
    title: 'Automatizaciones',
    description: 'Flujos automatizados para optimizar procesos de negocio.',
    accent: 'violet',
  },
  {
    icon: Code2,
    title: 'Software a la Medida',
    description: 'Desarrollo personalizado adaptado a las necesidades del cliente.',
    accent: 'violet',
  },
]

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  return (
    <section id="servicios" className="px-6 py-24" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-xs uppercase tracking-widest text-accent-teal text-center mb-3"
        >
          Servicios
        </motion.p>
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary text-center mb-14"
        >
          Todo lo que necesitas para crecer digitalmente
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon
            const isTeal = s.accent === 'teal'
            return (
              <motion.div
                key={s.title}
                initial={reduce ? {} : { opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className={cn(
                  'bg-bg-card border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-4',
                  'transition-all duration-300 hover:scale-[1.02]',
                  isTeal
                    ? 'hover:shadow-[0_0_24px_rgba(6,214,160,0.2)] hover:border-accent-teal/30'
                    : 'hover:shadow-[0_0_24px_rgba(124,58,237,0.2)] hover:border-accent-violet/30',
                  i === 4 && 'sm:col-start-1 lg:col-start-2'
                )}
              >
                <div
                  className={cn(
                    'p-2 w-fit rounded-lg',
                    isTeal ? 'bg-accent-teal/10' : 'bg-accent-violet/10'
                  )}
                >
                  <Icon
                    size={22}
                    className={isTeal ? 'text-accent-teal' : 'text-accent-violet'}
                  />
                </div>
                <h3 className="text-base font-semibold text-text-primary">{s.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{s.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
