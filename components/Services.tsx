'use client'

import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bot, Workflow, Cpu, Zap, LineChart, Code2, Volume2, VolumeX } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

// ─── Data ──────────────────────────────────────────────────────────
type ServiceMeta = {
  icon: LucideIcon
  video: string        // landscape — desktop popup
  videoMobile?: string // portrait 9:16 — mobile inline
}

type Service = ServiceMeta & {
  title: string
  description: string
}

const VIDEO_NAMES = [
  'chatbots',
  'flujos',
  'agentes',
  'automatizacion',
  'consultoria',
  'software',
]

const VIDEO_ICONS = [Bot, Workflow, Cpu, Zap, LineChart, Code2]

function buildServicesMeta(lang: string): ServiceMeta[] {
  const folder = lang === 'en' ? 'ingles' : 'español'
  return VIDEO_NAMES.map((name, i) => ({
    icon: VIDEO_ICONS[i],
    video: `/videos/Desktop/${folder}/${name}.mp4`,
    videoMobile: `/videos/mobil/${folder}/${name}.mp4`,
  }))
}

// ─── Video popup (renders in document.body via portal) ─────────────
function VideoPopup({ service }: { service: Service }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const Icon = service.icon
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
    return () => { videoRef.current?.pause() }
  }, [])

  return createPortal(
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        pointerEvents: 'none', // mouse events pass through — card onMouseLeave still fires
      }}
    >
      <motion.div
        key="popup"
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1,    y: 0,  opacity: 1 }}
        exit={{    scale: 0.94, y: 12, opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 'min(62vw, 780px)',
          borderRadius: 20,
          overflow: 'hidden',
          background: '#0D1018',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 48px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(79,126,255,0.08)',
        }}
      >
        {/* Video area */}
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            src={service.video}
            onError={() => setVideoError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Placeholder shown only when video fails to load */}
          {videoError && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 12, pointerEvents: 'none',
            }}>
              <Icon size={36} style={{ color: 'rgba(79,126,255,0.25)' }} />
              <span className="font-body" style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Video próximamente
              </span>
            </div>
          )}
        </div>

        {/* Info bar */}
        <div style={{ padding: '18px 24px 22px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(79,126,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <Icon size={15} style={{ color: '#4F7EFF' }} />
          </div>
          <div>
            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#EAECF4', marginBottom: 5 }}>
              {service.title}
            </h3>
            <p className="font-body" style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.6 }}>
              {service.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

// ─── Individual card ───────────────────────────────────────────────
function ServiceCard({
  service,
  delay,
  inView,
  reduce,
}: {
  service: Service
  delay: number
  inView: boolean
  reduce: boolean | null
}) {
  const [hovered, setHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileVideoError, setMobileVideoError] = useState(false)
  const [muted, setMuted] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const Icon = service.icon

  const isCardInView = useInView(cardRef, { amount: 0.45, once: false })

  // Detect mobile once on mount + on resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Play / pause inline video on mobile based on scroll visibility
  useEffect(() => {
    if (!isMobile || !videoRef.current) return
    if (isCardInView) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [isCardInView, isMobile])

  return (
    <>
      {/* ── Mobile card: reel vertical (hidden on md+) ── */}
      <motion.div
        ref={cardRef}
        className="md:hidden"
        initial={reduce ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '9/16',
          overflow: 'hidden',
          background: '#07090F',
        }}
      >
        {/* Video background */}
        <video
          ref={videoRef}
          muted={muted}
          loop
          playsInline
          src={service.videoMobile ?? service.video}
          onError={() => setMobileVideoError(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Mute / unmute button */}
        <button
          onClick={() => setMuted(m => !m)}
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10,
          }}
        >
          {muted
            ? <VolumeX size={15} style={{ color: 'rgba(255,255,255,0.7)' }} />
            : <Volume2 size={15} style={{ color: '#fff' }} />
          }
        </button>

        {/* Placeholder shown only when video fails to load */}
        {mobileVideoError && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 10, pointerEvents: 'none',
          }}>
            <Icon size={32} style={{ color: 'rgba(79,126,255,0.2)' }} />
            <span className="font-body" style={{ fontSize: 10, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Video próximamente
            </span>
          </div>
        )}

        {/* Fade-in overlay on scroll */}
        <div
          style={{
            position: 'absolute', inset: 0,
            opacity: isCardInView ? 0 : 1,
            background: '#07090F',
            transition: 'opacity 0.7s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Bottom gradient + text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '64px 24px 28px',
          background: 'linear-gradient(to top, rgba(7,9,15,0.96) 0%, rgba(7,9,15,0.6) 60%, transparent 100%)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(79,126,255,0.15)',
            marginBottom: 12,
          }}>
            <Icon size={15} style={{ color: '#4F7EFF' }} />
          </div>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#EAECF4', marginBottom: 6, lineHeight: 1.2 }}>
            {service.title}
          </h3>
          <p className="font-body" style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.6 }}>
            {service.description}
          </p>
        </div>
      </motion.div>

      {/* ── Desktop card: hover + popup (hidden on mobile) ── */}
      <motion.div
        className="hidden md:flex"
        initial={reduce ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#111722' : '#07090F',
          padding: 28,
          flexDirection: 'column',
          gap: 20,
          cursor: 'default',
          transition: 'background 0.25s',
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: hovered ? 'rgba(79,126,255,0.2)' : 'rgba(79,126,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.25s',
        }}>
          <Icon size={17} style={{ color: '#4F7EFF' }} />
        </div>
        <div>
          <h3 className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#EAECF4', marginBottom: 8, lineHeight: 1.3 }}>
            {service.title}
          </h3>
          <p className="font-body" style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.65 }}>
            {service.description}
          </p>
        </div>
      </motion.div>

      {/* Desktop popup only */}
      <AnimatePresence>
        {hovered && <VideoPopup service={service} />}
      </AnimatePresence>
    </>
  )
}

// ─── Section ───────────────────────────────────────────────────────
export default function Services() {
  const { t, lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  const services: Service[] = buildServicesMeta(lang).map((meta, i) => ({
    ...meta,
    title: t.services.items[i].title,
    description: t.services.items[i].description,
  }))

  return (
    <section id="servicios" className="py-14 md:py-20 lg:py-24 px-6" ref={ref}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        <motion.p
          className="font-display"
          initial={reduce ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4F7EFF', textAlign: 'center', marginBottom: 16 }}
        >
          {t.services.eyebrow}
        </motion.p>

        <motion.h2
          className="font-display"
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#FFFFFF', textAlign: 'center', marginBottom: 40, lineHeight: 1.1 }}
        >
          {t.services.title}
        </motion.h2>

        <div
          className="grid grid-cols-1 gap-3 rounded-2xl overflow-hidden md:grid-cols-2 md:gap-px md:bg-[rgba(255,255,255,0.08)] lg:grid-cols-3"
        >
          {services.map((s, i) => (
            <ServiceCard
              key={s.title}
              service={s}
              delay={0.1 + i * 0.06}
              inView={inView}
              reduce={reduce}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
