'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Bot, Workflow, Zap, Code2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

const miniCardIcons = [Bot, Workflow, Zap, Code2]

export default function AboutUs() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  const anim = (delay = 0) => ({
    initial: reduce ? {} : { opacity: 0, y: 16 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay },
  })

  return (
    <section id="nosotros" className="py-14 md:py-20 lg:py-24 px-6" ref={ref}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center" style={{ maxWidth: 1152, margin: '0 auto' }}>

        {/* Text */}
        <div>
          <motion.p
            className="font-display"
            {...anim(0)}
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', marginBottom: 20 }}
          >
            {t.about.eyebrow}
          </motion.p>
          <motion.h2
            className="font-display"
            {...anim(0.08)}
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: 24, lineHeight: 1.15 }}
          >
            {t.about.title}
          </motion.h2>
          <motion.p
            className="font-body"
            {...anim(0.16)}
            style={{ fontSize: 14, color: '#8B9AB5', lineHeight: 1.75 }}
          >
            {t.about.body}
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div {...anim(0.24)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {t.about.cards.map((label, i) => {
            const Icon = miniCardIcons[i]
            return (
              <div
                key={label}
                style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, transition: 'background 0.2s, border-color 0.2s', cursor: 'default' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#141924'; el.style.borderColor = 'rgba(79,126,255,0.25)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#0D1018'; el.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <Icon size={18} style={{ color: '#4F7EFF' }} />
                <p className="font-display" style={{ fontSize: 12, fontWeight: 600, color: '#EAECF4', lineHeight: 1.3 }}>{label}</p>
              </div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
