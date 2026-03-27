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
    initial: reduce ? {} : { opacity: 0, y: 16 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay },
  })

  return (
    <section id="nosotros" style={{ padding: '96px 24px' }} ref={ref}>
      <div style={{ maxWidth: 1152, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

        {/* Text */}
        <div>
          <motion.p
            className="font-display"
            {...anim(0)}
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', marginBottom: 20 }}
          >
            Quiénes Somos
          </motion.p>
          <motion.h2
            className="font-display"
            {...anim(0.08)}
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: 24, lineHeight: 1.15 }}
          >
            Impulsamos negocios con Inteligencia Artificial
          </motion.h2>
          <motion.p
            className="font-body"
            {...anim(0.16)}
            style={{ fontSize: 14, color: '#8B9AB5', lineHeight: 1.75 }}
          >
            Somos un equipo especializado en soluciones de IA para empresas y emprendedores de
            Latinoamérica. Diseñamos, construimos y desplegamos tecnología que automatiza, escala
            y transforma negocios reales.
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div {...anim(0.24)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {miniCards.map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, transition: 'background 0.2s, border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#141924'; el.style.borderColor = 'rgba(79,126,255,0.25)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#0D1018'; el.style.borderColor = 'rgba(255,255,255,0.08)' }}
            >
              <Icon size={18} style={{ color: '#4F7EFF' }} />
              <p className="font-display" style={{ fontSize: 12, fontWeight: 600, color: '#EAECF4', lineHeight: 1.3 }}>{label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
