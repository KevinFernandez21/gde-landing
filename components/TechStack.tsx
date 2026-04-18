'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/language-context'

// ─── Data ──────────────────────────────────────────────────────────

type Tech = { label: string; abbr: string }

type Category = {
  name: string
  color: string
  ringSize: number
  orbitDuration: string
  techs: Tech[]
}

const CATEGORIES: Category[] = [
  {
    name: 'Frontend',
    color: '#0ea5e9',
    ringSize: 280,
    orbitDuration: '18s',
    techs: [
      { label: 'Next.js',    abbr: 'Nx' },
      { label: 'Angular',    abbr: 'Ng' },
      { label: 'Vue.js',     abbr: 'Vu' },
      { label: 'TypeScript', abbr: 'TS' },
      { label: 'Vite',       abbr: 'Vi' },
    ],
  },
  {
    name: 'Backend',
    color: '#8b5cf6',
    ringSize: 210,
    orbitDuration: '13s',
    techs: [
      { label: 'FastAPI',    abbr: 'FA' },
      { label: 'Express.js', abbr: 'Ex' },
      { label: 'Django',     abbr: 'Dj' },
      { label: 'Python',     abbr: 'Py' },
      { label: 'Deno',       abbr: 'De' },
    ],
  },
  {
    name: 'Cloud & DevOps',
    color: '#10b981',
    ringSize: 150,
    orbitDuration: '9s',
    techs: [
      { label: 'AWS',          abbr: 'AW' },
      { label: 'Google Cloud', abbr: 'GC' },
      { label: 'Firebase',     abbr: 'Fb' },
      { label: 'Supabase',     abbr: 'Su' },
    ],
  },
  {
    name: 'Mobile & AI',
    color: '#f59e0b',
    ringSize: 90,
    orbitDuration: '6s',
    techs: [
      { label: 'Flutter',    abbr: 'Fl' },
      { label: 'Kotlin',     abbr: 'Ko' },
      { label: 'TensorFlow', abbr: 'TF' },
      { label: 'PyTorch',    abbr: 'PT' },
    ],
  },
]

// ─── Orbital Diagram ───────────────────────────────────────────────

function OrbitalIcon({ abbr, color, reduced }: { abbr: string; color: string; reduced: boolean | null }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        boxShadow: `0 0 14px ${color}70`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 8,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-0.01em',
        animation: reduced ? 'none' : 'counter-spin var(--orbit-duration) linear infinite',
      }}
    >
      {abbr}
    </div>
  )
}

function Ring({
  category,
  reduced,
}: {
  category: Category
  reduced: boolean | null
}) {
  const { color, ringSize, orbitDuration, techs } = category
  const iconSize = 32

  return (
    <div
      style={{
        position: 'absolute',
        width: ringSize,
        height: ringSize,
        borderRadius: '50%',
        border: `1px solid ${color}25`,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {techs.map((tech, i) => {
        const angle = (360 / techs.length) * i
        const delaySeconds = -((parseFloat(orbitDuration) * i) / techs.length)

        return (
          <div
            key={tech.label}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              animation: reduced ? 'none' : `orbit ${orbitDuration} linear infinite`,
              animationDelay: `${delaySeconds}s`,
              ['--orbit-duration' as string]: orbitDuration,
              transform: `rotate(${angle}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -iconSize / 2,
                left: `calc(50% - ${iconSize / 2}px)`,
              }}
            >
              <OrbitalIcon abbr={tech.abbr} color={color} reduced={reduced} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function OrbitalDiagram({ reduced }: { reduced: boolean | null }) {
  return (
    <div
      className="hidden md:flex"
      style={{
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        height: 320,
      }}
    >
      {CATEGORIES.map(cat => (
        <Ring key={cat.name} category={cat} reduced={reduced} />
      ))}

      {/* Center */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F7EFF, #6366f1)',
          boxShadow: '0 0 28px #4F7EFF50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 8,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '0.04em',
        }}
      >
        GDE
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}

// ─── Category List ─────────────────────────────────────────────────

function CategoryList({ inView, reduced }: { inView: boolean; reduced: boolean | null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {CATEGORIES.map((cat, i) => (
        <motion.div
          key={cat.name}
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: cat.color,
                boxShadow: `0 0 6px ${cat.color}`,
                flexShrink: 0,
              }}
            />
            <span
              className="font-display"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: cat.color,
              }}
            >
              {cat.name}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: 18 }}>
            {cat.techs.map(tech => (
              <span
                key={tech.label}
                className="font-body"
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  background: `${cat.color}12`,
                  border: `1px solid ${cat.color}30`,
                  borderRadius: 5,
                  padding: '4px 10px',
                }}
              >
                {tech.label}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────

export default function TechStack() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  return (
    <section
      id="stack"
      className="py-14 md:py-20 lg:py-24 px-6"
      ref={ref}
    >
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        <motion.p
          className="font-display"
          initial={reduced ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#4F7EFF',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          {t.techStack.eyebrow}
        </motion.p>

        <motion.h2
          className="font-display"
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 56,
            lineHeight: 1.1,
          }}
        >
          {t.techStack.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <OrbitalDiagram reduced={reduced} />
          <CategoryList inView={inView} reduced={reduced} />
        </div>

      </div>
    </section>
  )
}
