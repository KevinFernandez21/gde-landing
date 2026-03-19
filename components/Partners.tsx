'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const partners = [
  'Importadora El Mayorista',
  'Fund4U',
  'Padrinos Ecuador',
  'GDE Community',
  'Digital Latam',
  'Ecommerce Pro',
  'StartupEC',
  'Negocios Digitales',
]

export default function Partners() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()

  return (
    <section className="px-6 py-16 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="text-xs uppercase tracking-widest text-accent-teal text-center mb-10"
        >
          Confían en nosotros
        </motion.p>
      </div>

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <div className={`flex gap-4 w-max ${reduce ? '' : 'animate-marquee'}`}>
          {[...partners, ...partners].map((name, i) => (
            <span
              key={i}
              className="shrink-0 border border-white/[0.1] rounded-full px-5 py-2.5 text-sm text-text-muted grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:border-white/20 hover:text-text-primary transition-all duration-300 cursor-default whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
