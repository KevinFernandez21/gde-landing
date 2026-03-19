'use client'

import { useReducedMotion, motion } from 'framer-motion'

export default function Hero() {
  const reduce = useReducedMotion()

  const fadeUp = {
    initial: reduce ? {} : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-widest text-accent-teal mb-6"
        >
          Grupo Digital Ecommerce
        </motion.p>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-tight mb-6"
        >
          El ecosistema digital donde los{' '}
          <span className="text-accent-violet">emprendedores</span> crecen.
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto mb-10"
        >
          GDE es la comunidad que conecta, forma y potencia negocios digitales reales.
        </motion.p>

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }}>
          <a
            href="https://gdesas.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 rounded-full bg-accent-violet text-white text-base font-semibold hover:bg-accent-violet/80 transition-all hover:scale-105 active:scale-95"
          >
            Únete a la comunidad
          </a>
        </motion.div>
      </div>
    </section>
  )
}
