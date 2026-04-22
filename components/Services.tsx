'use client'

import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bot, Workflow, Cpu, Zap, LineChart, Code2, Volume2, VolumeX, X, Globe, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useExpertModal } from '@/lib/expert-modal-context'

// ─── Feature flag ──────────────────────────────────────────────────
const VIDEOS_ENABLED = false

// ─── Data ──────────────────────────────────────────────────────────
type ServiceMeta = {
  icon: LucideIcon
  video: string
  videoMobile?: string
}

type Service = ServiceMeta & {
  title: string
  description: string
  detail: string
  tags: readonly string[]
}

const VIDEO_NAMES = ['chatbots', 'flujos', 'agentes', 'automatizacion', 'consultoria', 'software', 'landing', 'seo']
const VIDEO_ICONS = [Bot, Workflow, Cpu, Zap, LineChart, Code2, Globe, Search]

function buildServicesMeta(lang: string): ServiceMeta[] {
  const folder = lang === 'en' ? 'ingles' : 'español'
  return VIDEO_NAMES.map((name, i) => ({
    icon: VIDEO_ICONS[i],
    video: `/videos/Desktop/${folder}/${name}.mp4`,
    videoMobile: `/videos/mobil/${folder}/${name}.mp4`,
  }))
}

// ─── Service Drawer ────────────────────────────────────────────────
function ServiceDrawer({
  service,
  index,
  drawerBuild,
  drawerStack,
  drawerCta,
  onClose,
}: {
  service: Service
  index: number
  drawerBuild: string
  drawerStack: string
  drawerCta: string
  onClose: () => void
}) {
  const { openModal } = useExpertModal()
  const Icon = service.icon

  function handleCta() {
    onClose()
    setTimeout(openModal, 220)
  }

  return createPortal(
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Panel */}
      <motion.div
        key="drawer"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(420px, 92vw)',
          zIndex: 301,
          background: '#0D1018',
          borderLeft: '1px solid rgba(255,255,255,0.09)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-display" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4F7EFF' }}>
            Servicio {String(index + 1).padStart(2, '0')}
          </span>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={14} style={{ color: '#8B9AB5' }} />
          </button>
        </div>

        {/* Icon + Title */}
        <div style={{ padding: '20px 24px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(79,126,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={32} style={{ color: '#FFFFFF' }} />
          </div>
          <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#EAECF4', lineHeight: 1.2 }}>
            {service.title}
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 28, flex: 1 }}>

          {/* What you'll get */}
          <div>
            <p className="font-display" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 13 }}>📋</span> {drawerBuild}
            </p>
            <p className="font-body" style={{ fontSize: 14, color: '#C2CDDF', lineHeight: 1.7 }}>
              {service.detail}
            </p>
          </div>

          {/* Tags */}
          <div>
            <p className="font-display" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 13 }}>🔧</span> {drawerStack}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {service.tags.map(tag => (
                <span
                  key={tag}
                  className="font-body"
                  style={{ fontSize: 12, color: '#C2CDDF', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 10px' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* CTA */}
        <div style={{ padding: '0 24px 28px' }}>
          <button
            onClick={handleCta}
            className="font-body"
            style={{
              width: '100%', padding: '14px 0',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid #4F7EFF',
              color: '#4F7EFF',
              fontSize: 14, fontWeight: 500,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4F7EFF'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4F7EFF' }}
          >
            <span style={{ fontSize: 13 }}>{'</>'}</span> {drawerCta}
          </button>
        </div>

      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

// ─── Video popup (desktop hover — only when VIDEOS_ENABLED) ────────
function VideoPopup({ service }: { service: Service }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const Icon = service.icon
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    video?.play().catch(() => {})
    return () => { video?.pause() }
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
        pointerEvents: 'none',
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
          boxShadow: '0 48px 100px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
          <video ref={videoRef} autoPlay loop playsInline src={service.video} onError={() => setVideoError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {videoError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Icon size={36} style={{ color: 'rgba(79,126,255,0.25)' }} />
            </div>
          )}
        </div>
        <div style={{ padding: '18px 24px 22px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(79,126,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <Icon size={24} style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#EAECF4', marginBottom: 5 }}>{service.title}</h3>
            <p className="font-body" style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.6 }}>{service.description}</p>
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
  onOpen,
  featured = false,
  spanTwo = false,
}: {
  service: Service
  delay: number
  inView: boolean
  reduce: boolean | null
  onOpen: () => void
  featured?: boolean
  spanTwo?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileVideoError, setMobileVideoError] = useState(false)
  const [muted, setMuted] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const Icon = service.icon

  const isCardInView = useInView(cardRef, { amount: 0.45, once: false })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!VIDEOS_ENABLED || !isMobile || !videoRef.current) return
    if (isCardInView) { videoRef.current.play().catch(() => {}) }
    else { videoRef.current.pause() }
  }, [isCardInView, isMobile])

  return (
    <>
      {/* ── Mobile card: reel cuando hay video, card normal cuando no ── */}
      {VIDEOS_ENABLED ? (
        <motion.div
          ref={cardRef}
          className="md:hidden"
          initial={reduce ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay }}
          onClick={onOpen}
          style={{ position: 'relative', width: '100%', aspectRatio: '9/16', overflow: 'hidden', background: '#07090F', cursor: 'pointer' }}
        >
          <video ref={videoRef} muted={muted} loop playsInline src={service.videoMobile ?? service.video}
            onError={() => setMobileVideoError(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <button
            onClick={e => { e.stopPropagation(); setMuted(m => !m) }}
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
            style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
          >
            {muted ? <VolumeX size={15} style={{ color: 'rgba(255,255,255,0.7)' }} /> : <Volume2 size={15} style={{ color: '#fff' }} />}
          </button>
          {mobileVideoError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={32} style={{ color: 'rgba(79,126,255,0.2)' }} />
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, opacity: isCardInView ? 0 : 1, background: '#07090F', transition: 'opacity 0.7s ease', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '64px 24px 28px', background: 'linear-gradient(to top, rgba(7,9,15,0.96) 0%, rgba(7,9,15,0.6) 60%, transparent 100%)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 10, background: 'rgba(79,126,255,0.15)', marginBottom: 14 }}>
              <Icon size={28} style={{ color: '#FFFFFF' }} />
            </div>
            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#EAECF4', marginBottom: 6, lineHeight: 1.2 }}>{service.title}</h3>
            <p className="font-body" style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.6 }}>{service.description}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="md:hidden flex flex-col"
          initial={reduce ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay }}
          onClick={onOpen}
          style={{ background: '#07090F', padding: 24, gap: 16, cursor: 'pointer' }}
        >
          <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(79,126,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={32} style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 600, color: '#EAECF4', marginBottom: 6, lineHeight: 1.3 }}>{service.title}</h3>
            <p className="font-body" style={{ fontSize: 14, color: '#8B9AB5', lineHeight: 1.65 }}>{service.description}</p>
          </div>
          <span className="font-body" style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>Ver detalles →</span>
        </motion.div>
      )}

      {/* ── Desktop card ── */}
      <motion.div
        className={`hidden md:flex${featured ? ' lg:col-span-6' : spanTwo ? ' lg:col-span-3' : ' lg:col-span-2'}`}
        initial={reduce ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onOpen}
        style={{
          background: hovered ? '#111722' : '#07090F',
          padding: featured || spanTwo ? '28px 40px' : 28,
          flexDirection: featured || spanTwo ? 'row' : 'column',
          alignItems: featured || spanTwo ? 'center' : undefined,
          gap: featured || spanTwo ? 32 : 20,
          cursor: 'pointer',
          transition: 'background 0.25s',
          position: 'relative',
        }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 12, background: hovered ? 'rgba(79,126,255,0.2)' : 'rgba(79,126,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.25s', flexShrink: 0 }}>
          <Icon size={featured || spanTwo ? 32 : 28} style={{ color: '#FFFFFF' }} />
        </div>
        <div style={{ flex: featured || spanTwo ? 1 : undefined }}>
          <h3 className="font-display" style={{ fontSize: featured || spanTwo ? 18 : 16, fontWeight: 600, color: '#EAECF4', marginBottom: 8, lineHeight: 1.3 }}>{service.title}</h3>
          <p className="font-body" style={{ fontSize: 14, color: '#8B9AB5', lineHeight: 1.65, maxWidth: featured || spanTwo ? 480 : undefined }}>{service.description}</p>
        </div>
        <span className="font-body" style={{ fontSize: 11, color: hovered ? '#4F7EFF' : 'rgba(255,255,255,0.18)', transition: 'color 0.25s', marginTop: featured || spanTwo ? 0 : 'auto', flexShrink: 0 }}>
          Ver detalles →
        </span>

        <AnimatePresence>
          {VIDEOS_ENABLED && hovered && <VideoPopup service={service} />}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

// ─── Section ───────────────────────────────────────────────────────
export default function Services() {
  const { t, lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const services: Service[] = buildServicesMeta(lang).map((meta, i) => ({
    ...meta,
    title:       t.services.items[i].title,
    description: t.services.items[i].description,
    detail:      t.services.items[i].detail,
    tags:        t.services.items[i].tags,
  }))

  const activeService = activeIndex !== null ? services[activeIndex] : null

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

        <div className="grid grid-cols-1 gap-3 rounded-2xl overflow-hidden md:grid-cols-2 md:gap-px md:bg-[rgba(255,255,255,0.08)] lg:grid-cols-6">
          {services.map((s, i) => (
            <ServiceCard
              key={s.title}
              service={s}
              delay={0.1 + i * 0.06}
              inView={inView}
              reduce={reduce}
              onOpen={() => {
                if (!VIDEOS_ENABLED) setActiveIndex(i)
              }}
              featured={services.length % 3 === 1 && i === services.length - 1}
              spanTwo={services.length % 3 === 2 && i >= services.length - 2}
            />
          ))}
        </div>

      </div>

      {/* Drawer */}
      <AnimatePresence>
        {activeService && (
          <ServiceDrawer
            service={activeService}
            index={activeIndex!}
            drawerBuild={t.services.drawerBuild}
            drawerStack={t.services.drawerStack}
            drawerCta={t.services.drawerCta}
            onClose={() => setActiveIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
