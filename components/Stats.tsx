'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'

const statValues: (number | string)[] = [6, '100%', '24/7']

function Counter({ value }: { value: number | string }) {
  const [display, setDisplay] = useState<number | string>(
    typeof value === 'number' ? 0 : value
  )
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (typeof value !== 'number' || !inView) return
    if (reduce) { setDisplay(value); return }
    let n = 0
    const inc = value / (1200 / 16)
    const timer = setInterval(() => {
      n += inc
      if (n >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(n))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value, reduce])

  return <span ref={ref}>{display}</span>
}

export default function Stats() {
  const { t } = useLanguage()
  return (
    <section style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px' }}>
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ maxWidth: 896, margin: '0 auto' }}>
        {t.stats.map((s, i) => (
          <div
            key={s.label}
            className={
              i < 2
                ? 'border-b border-white/[0.08] md:border-b-0 md:border-r'
                : ''
            }
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px' }}
          >
            <p className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#FFFFFF', lineHeight: 1, marginBottom: 8 }}>
              <Counter value={statValues[i]} />
            </p>
            <p className="font-body" style={{ fontSize: 12, color: '#8B9AB5' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
