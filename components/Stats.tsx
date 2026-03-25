'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const stats: { value: number | string; label: string }[] = [
  { value: 6,       label: 'Servicios de IA' },
  { value: '100%',  label: 'Personalizado' },
  { value: '24/7',  label: 'Agentes activos' },
  { value: 'LATAM', label: 'Mercado objetivo' },
]

function Counter({ value }: { value: number | string }) {
  const [display, setDisplay] = useState<number | string>(
    typeof value === 'number' ? 0 : value
  )
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (typeof value !== 'number') return
    if (!inView) return
    if (reduce) { setDisplay(value); return }

    let start = 0
    const duration = 1500
    const step = 16
    const increment = value / (duration / step)

    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, step)

    return () => clearInterval(timer)
  }, [inView, value, reduce])

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-accent-violet">
      {display}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-bg-card border border-white/[0.07] rounded-2xl p-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-2">
              <Counter value={s.value} />
              <p className="text-sm text-text-muted leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
