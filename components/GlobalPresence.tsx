'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import WorldMap, { type MapMarker } from '@/components/ui/world-map'
import { useLanguage } from '@/lib/language-context'

const OFFICE_MARKERS: MapMarker[] = [
  { lat: -2.19,  lng: -79.89, label: 'Guayaquil',     color: '#00FF9D', pulse: true  }, // HQ
  { lat: -0.18,  lng: -78.48, label: 'Quito',          color: '#4F7EFF' },
  { lat:  4.71,  lng: -74.07, label: 'Bogotá',         color: '#4F7EFF' },
  { lat:  4.81,  lng: -75.69, label: 'Pereira',        color: '#4F7EFF' },
  { lat:  7.12,  lng: -73.13, label: 'Bucaramanga',    color: '#4F7EFF' },
  { lat: 25.77,  lng: -80.19, label: 'Miami',          color: '#4F7EFF' },
  { lat: 26.27,  lng: -80.17, label: 'Coconut Creek',  color: '#4F7EFF' },
  { lat: 14.64,  lng: -90.51, label: 'Guatemala',      color: '#4F7EFF' },
  { lat: -12.05, lng: -77.04, label: 'Lima',           color: '#4F7EFF' },
]


export default function GlobalPresence() {
  const { lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const copy = lang === 'en'
    ? { eyebrow: 'Global Presence', title: 'Our offices', sub: '9 locations across 5 countries' }
    : { eyebrow: 'Presencia Global', title: 'Nuestras oficinas', sub: '9 ubicaciones en 5 países' }

  return (
    <section className="py-14 md:py-20 lg:py-24 px-6" ref={ref}>
      <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Heading */}
        <motion.p
          className="font-display"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', textAlign: 'center', marginBottom: 16 }}
        >
          {copy.eyebrow}
        </motion.p>

        <motion.h2
          className="font-display"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#FFFFFF', textAlign: 'center', marginBottom: 8, lineHeight: 1.1 }}
        >
          {copy.title}
        </motion.h2>

        <motion.p
          className="font-body"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.18 }}
          style={{ fontSize: 14, color: '#8B9AB5', marginBottom: 40 }}
        >
          {copy.sub}
        </motion.p>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ width: '100%', maxWidth: 900 }}
        >
          <WorldMap markers={OFFICE_MARKERS} />
        </motion.div>

        {/* Location pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.35 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 32, maxWidth: 600 }}
        >
          {OFFICE_MARKERS.map((m) => (
            <span
              key={m.label}
              className="font-body"
              style={{
                fontSize: 11,
                color: m.pulse ? '#00FF9D' : '#8B9AB5',
                background: m.pulse ? 'rgba(0,255,157,0.07)' : 'rgba(79,126,255,0.07)',
                border: `1px solid ${m.pulse ? 'rgba(0,255,157,0.2)' : 'rgba(79,126,255,0.15)'}`,
                padding: '4px 12px',
                borderRadius: 20,
                letterSpacing: '0.04em',
              }}
            >
              {m.label}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
