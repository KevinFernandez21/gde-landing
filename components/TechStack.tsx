'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/language-context'

const CATEGORIES = [
  {
    name: 'Frontend',
    color: '#0ea5e9',
    techs: ['Next.js', 'Angular', 'Vue.js', 'TypeScript', 'Vite'],
  },
  {
    name: 'Backend',
    color: '#8b5cf6',
    techs: ['FastAPI', 'Express.js', 'Django', 'Python', 'Deno'],
  },
  {
    name: 'Cloud & DevOps',
    color: '#10b981',
    techs: ['AWS', 'Google Cloud', 'Firebase', 'Supabase'],
  },
  {
    name: 'Mobile & AI',
    color: '#f59e0b',
    techs: ['Flutter', 'Kotlin', 'TensorFlow', 'PyTorch'],
  },
]

export default function TechStack() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  return (
    <section id="stack" className="py-14 md:py-20 lg:py-24 px-6" ref={ref}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        <motion.p
          className="font-display"
          initial={reduced ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', textAlign: 'center', marginBottom: 16 }}
        >
          {t.techStack.eyebrow}
        </motion.p>

        <motion.h2
          className="font-display"
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#FFFFFF', textAlign: 'center', marginBottom: 48, lineHeight: 1.1 }}
        >
          {t.techStack.title}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={reduced ? {} : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              style={{
                background: '#0D1018',
                border: `1px solid ${cat.color}25`,
                borderRadius: 14,
                padding: '24px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, boxShadow: `0 0 6px ${cat.color}`, flexShrink: 0 }} />
                <span
                  className="font-display"
                  style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: cat.color }}
                >
                  {cat.name}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cat.techs.map(tech => (
                  <span
                    key={tech}
                    className="font-body"
                    style={{ fontSize: 12, color: '#94a3b8', background: `${cat.color}12`, border: `1px solid ${cat.color}30`, borderRadius: 5, padding: '4px 10px' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
