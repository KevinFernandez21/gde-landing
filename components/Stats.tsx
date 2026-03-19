'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const stats = [
  { value: 1200, suffix: '+', label: 'Emprendedores en comunidad' },
  { value: 35, suffix: '', label: 'Socios estratégicos' },
  { value: 80, suffix: '+', label: 'Eventos realizados' },
  { value: 5, suffix: '', label: 'Años de experiencia' },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    if (reduce) { setCount(value); return }

    let start = 0
    const duration = 1500
    const step = 16
    const increment = value / (duration / step)

    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, step)

    return () => clearInterval(timer)
  }, [inView, value, reduce])

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-accent-violet">
      {count}{suffix}
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
              <Counter value={s.value} suffix={s.suffix} />
              <p className="text-sm text-text-muted leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
