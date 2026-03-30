'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { WorldMap, type MapMarker } from '@/components/ui/map'
import { useLanguage } from '@/lib/language-context'

// labelOffset: dx/dy in SVG units (viewBox 800×400) to avoid overlaps
const OFFICE_MARKERS: MapMarker[] = [
  { lat: 26.27,  lng: -80.17, flag: '🇺🇸', label: 'Coconut Creek', labelOffset: { dx: -14, dy: -14 } },
  { lat: 25.77,  lng: -80.19, flag: '🇺🇸', label: 'Miami',         labelOffset: { dx:  14, dy:   0 } },
  { lat: 14.64,  lng: -90.51, flag: '🇬🇹', label: 'Guatemala',     labelOffset: { dx: -14, dy:   0 } },
  { lat:  7.12,  lng: -73.13, flag: '🇨🇴', label: 'Bucaramanga',   labelOffset: { dx:  14, dy: -10 } },
  { lat:  4.81,  lng: -75.69, flag: '🇨🇴', label: 'Pereira',       labelOffset: { dx: -14, dy:   0 } },
  { lat: -0.18,  lng: -78.48, flag: '🇪🇨', label: 'Quito',         labelOffset: { dx: -14, dy: -10 } },
  { lat: -2.19,  lng: -79.89, flag: '🇪🇨', label: 'Guayaquil',     labelOffset: { dx: -14, dy:   8 }, isHQ: true },
  { lat: -12.05, lng: -77.04, flag: '🇵🇪', label: 'Lima',          labelOffset: { dx:  14, dy:   0 } },
]

export default function GlobalPresence() {
  const { lang } = useLanguage()
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const copy = lang === 'en'
    ? { eyebrow: 'Global Presence', title: 'Our offices', sub: '9 locations · 5 countries' }
    : { eyebrow: 'Presencia Global', title: 'Nuestras oficinas', sub: '9 ubicaciones · 5 países' }

  return (
    <section className="py-14 hidden lg:block md:py-20 lg:py-2 px-6" ref={ref}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

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
          transition={{ duration: 0.4, delay: 0.16 }}
          style={{ fontSize: 14, color: '#8B9AB5', textAlign: 'center', marginBottom: 40 }}
        >
          {copy.sub}
        </motion.p>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.22 }}
        >
          <WorldMap markers={OFFICE_MARKERS} />
        </motion.div>

        {/* Office pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 32 }}
        >
          {OFFICE_MARKERS.map((o) => (
            <div
              key={o.label}
              className="font-body"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12,
                color: o.isHQ ? '#00FF9D' : '#8B9AB5',
                background: o.isHQ ? 'rgba(0,255,157,0.07)' : 'rgba(79,126,255,0.07)',
                border: `1px solid ${o.isHQ ? 'rgba(0,255,157,0.2)' : 'rgba(79,126,255,0.14)'}`,
                padding: '5px 12px',
                borderRadius: 20,
              }}
            >
              <span style={{ fontSize: 14 }}>{o.flag}</span>
              <span style={{ fontWeight: o.isHQ ? 600 : 400 }}>
                {o.label}{o.isHQ ? ' ★' : ''}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
