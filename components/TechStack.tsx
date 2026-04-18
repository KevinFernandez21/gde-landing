'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/language-context'

import { SiNextdotjs, SiAngular, SiVuedotjs, SiTypescript, SiVite, SiFastapi, SiExpress, SiDjango, SiPython, SiDeno, SiGooglecloud, SiFirebase, SiSupabase, SiFlutter, SiKotlin, SiTensorflow, SiPytorch, SiReact, SiSwift, SiOpenai, SiHuggingface, SiGoogle, SiGooglesearchconsole, SiSemrush, SiWordpress, SiGoogletagmanager } from 'react-icons/si'
import { FaAmazon } from 'react-icons/fa'

const CATEGORIES = [
  {
    name: 'Frontend',
    color: '#0ea5e9',
    techs: [
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Angular', icon: SiAngular },
      { name: 'Vue.js', icon: SiVuedotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Vite', icon: SiVite }
    ],
  },
  {
    name: 'Backend',
    color: '#8b5cf6',
    techs: [
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'Express.js', icon: SiExpress },
      { name: 'Django', icon: SiDjango },
      { name: 'Python', icon: SiPython },
      { name: 'Deno', icon: SiDeno }
    ],
  },
  {
    name: 'Cloud & DevOps',
    color: '#10b981',
    techs: [
      { name: 'AWS', icon: FaAmazon },
      { name: 'Google Cloud', icon: SiGooglecloud },
      { name: 'Firebase', icon: SiFirebase },
      { name: 'Supabase', icon: SiSupabase }
    ],
  },
  {
    name: 'Mobile',
    color: '#ec4899',
    techs: [
      { name: 'Flutter', icon: SiFlutter },
      { name: 'React Native', icon: SiReact },
      { name: 'Kotlin', icon: SiKotlin },
      { name: 'Swift', icon: SiSwift }
    ],
  },
  {
    name: 'Inteligencia Artificial',
    color: '#f59e0b',
    techs: [
      { name: 'OpenAI', icon: SiOpenai },
      { name: 'TensorFlow', icon: SiTensorflow },
      { name: 'PyTorch', icon: SiPytorch },
      { name: 'Hugging Face', icon: SiHuggingface }
    ],
  },
  {
    name: 'Marketing & SEO',
    color: '#14b8a6',
    techs: [
      { name: 'Google', icon: SiGoogle },
      { name: 'Search Console', icon: SiGooglesearchconsole },
      { name: 'Semrush', icon: SiSemrush },
      { name: 'Tag Manager', icon: SiGoogletagmanager },
      { name: 'WordPress', icon: SiWordpress }
    ],
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

        <div className="flex flex-wrap justify-center gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={reduced ? {} : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] flex-grow-0"
              style={{
                background: '#0D1018',
                border: `1px solid ${cat.color}30`,
                borderRadius: 16,
                padding: '28px 24px',
                boxShadow: `0 4px 20px -10px ${cat.color}20`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, boxShadow: `0 0 8px ${cat.color}`, flexShrink: 0 }} />
                <span
                  className="font-display"
                  style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: cat.color }}
                >
                  {cat.name}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                {cat.techs.map(tech => (
                  <div
                    key={tech.name}
                    className="font-body flex flex-col items-center justify-center gap-2 transition-all duration-300"
                    style={{ 
                      fontSize: 12, 
                      color: '#cbd5e1', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      border: `1px solid rgba(255, 255, 255, 0.08)`, 
                      borderRadius: 12, 
                      padding: '14px 10px',
                      minWidth: '85px',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.background = `${cat.color}15`
                      e.currentTarget.style.borderColor = `${cat.color}40`
                      e.currentTarget.style.color = '#ffffff'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.color = '#cbd5e1'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <tech.icon style={{ color: cat.color, fontSize: 28, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                    <span style={{ fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>{tech.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
