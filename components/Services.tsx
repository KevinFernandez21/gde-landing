'use client'

import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, animate as motionAnimate } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { useRef, useState, useEffect, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { Bot, Workflow, Cpu, Zap, LineChart, Code2, Volume2, VolumeX, X, Globe, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useExpertModal } from '@/lib/expert-modal-context'

// ─── Feature flag ──────────────────────────────────────────────────
const VIDEOS_ENABLED = false

// ─── Workflow types & data ─────────────────────────────────────────
type WFTag  = { label: string; color?: 'green' | 'yellow' | 'blue' }
type WFCard = { icon: string; title: string; sub?: string; tags?: WFTag[] }
type WFStep = { num: number; label: string; cards: WFCard[] }
type WFDef  = { title: string; platforms: string[]; steps: WFStep[] }

const SERVICE_WORKFLOWS: WFDef[] = [
  // 0 – Chatbots
  {
    title: 'CHATBOT AUTOMATIZADO · FLUJO COMPLETO',
    platforms: ['WhatsApp', 'Web', 'Instagram'],
    steps: [
      { num: 1, label: 'TRIGGER',         cards: [{ icon: '💬', title: 'Cliente escribe',       sub: 'WhatsApp · Web · Instagram' }] },
      { num: 2, label: 'EN < 1 SEGUNDO',  cards: [{ icon: '🤖', title: 'IA responde',            sub: 'GPT · Llama · Claude' }] },
      { num: 3, label: 'CALIFICACIÓN',    cards: [{ icon: '❓', title: 'Preguntas clave',        sub: 'Scoring automático' }] },
      { num: 4, label: 'SEGMENTACIÓN',    cards: [
        { icon: '🔥', title: 'Lead caliente', tags: [{ label: '+Empresa',    color: 'green' }] },
        { icon: '⚡', title: 'Lead tibio',    tags: [{ label: 'Particular',  color: 'yellow' }] },
      ]},
      { num: 5, label: 'RESULTADO',       cards: [
        { icon: '✅', title: 'Lead en tu CRM',      sub: 'Nombre · Empresa · Necesidad' },
        { icon: '📅', title: 'Reunión agendada',    sub: 'Calendly automático' },
      ]},
    ],
  },
  // 1 – Flujos de trabajo
  {
    title: 'FLUJO AUTOMATIZADO · NUEVO CLIENTE REGISTRADO',
    platforms: ['Make', 'n8n', 'Zapier'],
    steps: [
      { num: 1, label: 'TRIGGER', cards: [
        { icon: '🎯', title: 'Acción detectada',   sub: 'Nuevo cliente · Formulario · CRM' },
        { icon: '⚡', title: 'Trigger activado',   sub: 'Carlos Vega · MiPyme S.A.', tags: [{ label: 'Nuevo', color: 'green' }] },
      ]},
      { num: 2, label: 'NOTIFICACIÓN', cards: [
        { icon: '💬', title: 'Mensaje de bienvenida', sub: 'WhatsApp · Email' },
        { icon: '🤖', title: 'Zetter Bot',            sub: '¡Hola Carlos! Bienvenido a MiPyme S.A.' },
      ]},
      { num: 3, label: 'SINCRONIZACIÓN', cards: [
        { icon: '🔄', title: 'Sistema actualizado',    sub: 'CRM · Google Sheets · ERP' },
        { icon: '📊', title: 'Fila en Google Sheets' },
        { icon: '🔗', title: 'Contacto en HubSpot' },
        { icon: '🔑', title: 'Acceso generado' },
      ]},
      { num: 4, label: 'ALERTA INTERNA', cards: [
        { icon: '🔔', title: 'Equipo notificado',      sub: 'Slack · Email · Teams' },
        { icon: '💬', title: '#ventas · Slack',        sub: 'Carlos Vega de MiPyme S.A. — asignado a ventas' },
      ]},
      { num: 5, label: 'LISTO', cards: [
        { icon: '✅', title: 'Registro completo',      sub: 'CRM · Notificado · Acceso activo' },
      ]},
    ],
  },
  // 2 – Agentes IA
  {
    title: 'AGENTE DE IA · CICLO DE EJECUCIÓN',
    platforms: ['GPT-4o', 'Claude', 'Llama 3'],
    steps: [
      { num: 1, label: 'SOLICITUD',       cards: [{ icon: '📥', title: 'Tarea recibida',        sub: 'Usuario · Sistema · Evento' }] },
      { num: 2, label: 'ANÁLISIS',        cards: [{ icon: '🧠', title: 'Razonamiento',          sub: 'Context · Memory · Tools' }] },
      { num: 3, label: 'DECISIÓN',        cards: [{ icon: '🔎', title: 'Selección de tool',     sub: 'Search · Code · API' }] },
      { num: 4, label: 'EJECUCIÓN',       cards: [{ icon: '🚀', title: 'Acción ejecutada',      sub: 'Resultado obtenido' }] },
      { num: 5, label: 'REPORTE',         cards: [{ icon: '📊', title: 'Respuesta final',       sub: 'Estructurada · Verificada' }] },
    ],
  },
  // 3 – Automatización
  {
    title: 'PIPELINE DE AUTOMATIZACIÓN · END TO END',
    platforms: ['API', 'Webhook', 'Cron'],
    steps: [
      { num: 1, label: 'FUENTE',          cards: [{ icon: '📡', title: 'Entrada de datos',      sub: 'API · CSV · Webhook' }] },
      { num: 2, label: 'PROCESAMIENTO',   cards: [{ icon: '⚙️', title: 'Transformación',        sub: 'Map · Filter · Reduce' }] },
      { num: 3, label: 'VALIDACIÓN',      cards: [{ icon: '🛡️', title: 'Control de calidad',   sub: 'Schema · Rules · Logs' }] },
      { num: 4, label: 'DISTRIBUCIÓN',    cards: [{ icon: '📤', title: 'Envío automático',      sub: 'CRM · DB · Email · Slack' }] },
      { num: 5, label: 'MONITOREO',       cards: [{ icon: '📈', title: 'Dashboard live',        sub: 'Alertas · KPIs · Auditoría' }] },
    ],
  },
  // 4 – Consultoría
  {
    title: 'PROCESO DE CONSULTORÍA · DE INICIO A FIN',
    platforms: ['Zoom', 'Meet', 'Presencial'],
    steps: [
      { num: 1, label: 'DIAGNÓSTICO',     cards: [{ icon: '🔍', title: 'Análisis inicial',      sub: 'Procesos · Herramientas · Equipo' }] },
      { num: 2, label: 'ESTRATEGIA',      cards: [{ icon: '🗺️', title: 'Hoja de ruta',          sub: 'Prioridades · ROI · Timeline' }] },
      { num: 3, label: 'DISEÑO',          cards: [{ icon: '✏️', title: 'Solución a medida',     sub: 'Arquitectura · Stack · Flujos' }] },
      { num: 4, label: 'IMPLEMENTACIÓN',  cards: [{ icon: '🏗️', title: 'Ejecución guiada',      sub: 'Sprint · QA · Capacitación' }] },
      { num: 5, label: 'SEGUIMIENTO',     cards: [{ icon: '📊', title: 'Métricas y mejoras',    sub: 'KPIs · Ajustes · Escala' }] },
    ],
  },
  // 5 – Software a medida
  {
    title: 'CICLO DE DESARROLLO · SOFTWARE A MEDIDA',
    platforms: ['Web', 'Mobile', 'API'],
    steps: [
      { num: 1, label: 'REQUERIMIENTOS',  cards: [{ icon: '📋', title: 'Backlog definido',       sub: 'User stories · Criterios' }] },
      { num: 2, label: 'DISEÑO',          cards: [{ icon: '🎨', title: 'UI/UX + Arquitectura',  sub: 'Figma · Diagram · Stack' }] },
      { num: 3, label: 'DESARROLLO',      cards: [{ icon: '💻', title: 'Sprints de código',      sub: 'TDD · Code review · CI' }] },
      { num: 4, label: 'QA',              cards: [{ icon: '🧪', title: 'Testing completo',       sub: 'Unit · Integration · E2E' }] },
      { num: 5, label: 'ENTREGA',         cards: [{ icon: '🚀', title: 'Deploy & handoff',       sub: 'Docs · Capacitación · Soporte' }] },
    ],
  },
  // 6 – Landing pages
  {
    title: 'LANDING PAGE · DE BRIEF A LIVE',
    platforms: ['Next.js', 'React', 'Webflow'],
    steps: [
      { num: 1, label: 'BRIEFING',        cards: [{ icon: '📝', title: 'Objetivos y audiencia', sub: 'Goal · CTA · Mensaje' }] },
      { num: 2, label: 'DISEÑO',          cards: [{ icon: '🎨', title: 'Mockup aprobado',        sub: 'Figma · Branding · UX' }] },
      { num: 3, label: 'DESARROLLO',      cards: [{ icon: '⚡', title: 'Código optimizado',      sub: 'Performance · Responsive' }] },
      { num: 4, label: 'SEO TÉCNICO',     cards: [{ icon: '🔍', title: 'Optimización on-page',  sub: 'Meta · Schema · Speed' }] },
      { num: 5, label: 'PUBLICACIÓN',     cards: [{ icon: '✅', title: 'Live & midiendo',        sub: 'Analytics · Conversiones' }] },
    ],
  },
  // 7 – SEO
  {
    title: 'ESTRATEGIA SEO · POSICIONAMIENTO ORGÁNICO',
    platforms: ['Google', 'Bing', 'Analytics'],
    steps: [
      { num: 1, label: 'AUDITORÍA',       cards: [{ icon: '🔍', title: 'Estado actual',          sub: 'Técnico · On-page · Links' }] },
      { num: 2, label: 'KEYWORDS',        cards: [{ icon: '🎯', title: 'Palabras clave',          sub: 'Volumen · Competencia · Intent' }] },
      { num: 3, label: 'OPTIMIZACIÓN',    cards: [{ icon: '⚙️', title: 'Mejoras técnicas',       sub: 'Core Web Vitals · Schema' }] },
      { num: 4, label: 'CONTENIDO',       cards: [{ icon: '✍️', title: 'Plan editorial',         sub: 'Clústers · E-E-A-T · Backlinks' }] },
      { num: 5, label: 'RESULTADOS',      cards: [{ icon: '📈', title: 'Ranking creciente',      sub: 'Tráfico · Leads · ROI' }] },
    ],
  },
]

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

// ─── Workflow popup (desktop hover) ───────────────────────────────
function tagColor(color?: string) {
  if (color === 'green')  return { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.3)',  text: '#22c55e' }
  if (color === 'yellow') return { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.3)', text: '#eab308' }
  return                         { bg: 'rgba(79,126,255,0.15)', border: 'rgba(79,126,255,0.3)', text: '#4F7EFF' }
}

// ─── Mobile workflow sheet ──────────────────────────────────────────
function MobileWorkflowSheet({
  index,
  onClose,
  total,
  onNavigate,
  serviceTitles,
}: {
  index: number
  onClose: () => void
  total: number
  onNavigate: (i: number) => void
  serviceTitles: string[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const x = useMotionValue(0)
  const prevWidth = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([e]) => setContainerWidth(e.contentRect.width))
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (containerWidth === 0) return
    const widthChanged = prevWidth.current !== containerWidth
    prevWidth.current = containerWidth
    if (widthChanged) {
      x.set(-index * containerWidth)
    } else {
      motionAnimate(x, -index * containerWidth, { type: 'spring', stiffness: 300, damping: 30 })
    }
  }, [index, containerWidth]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (!containerWidth) return
    const { offset, velocity } = info
    const newIndex =
      offset.x < -containerWidth * 0.25 || velocity.x < -400
        ? Math.min(index + 1, total - 1)
        : offset.x > containerWidth * 0.25 || velocity.x > 400
        ? Math.max(index - 1, 0)
        : index
    if (newIndex !== index) {
      onNavigate(newIndex)
    } else {
      motionAnimate(x, -index * containerWidth, { type: 'spring', stiffness: 300, damping: 30 })
    }
  }

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0, y: 44 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 44 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9999,
          background: '#07090F',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── Top bar ── */}
        <div style={{
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 8px rgba(34,197,94,0.5)',
            }} />
            <span className="font-display" style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.13em',
              color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
            }}>
              {serviceTitles[index] ?? 'Flujo de trabajo'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={14} style={{ color: '#8B9AB5' }} />
          </button>
        </div>

        {/* ── Carousel track ── */}
        <div
          ref={containerRef}
          style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}
        >
          <motion.div
            style={{ display: 'flex', height: '100%', width: `${total * 100}%`, x }}
            drag="x"
            dragConstraints={{ left: -(total - 1) * (containerWidth || 1), right: 0 }}
            dragElastic={0.06}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            {SERVICE_WORKFLOWS.slice(0, total).map((wf, i) => (
              <div
                key={i}
                style={{
                  width: `${100 / total}%`, height: '100%', flexShrink: 0,
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {/* Title + platforms */}
                <div style={{ padding: '12px 20px 8px', flexShrink: 0 }}>
                  <h2 className="font-display" style={{
                    fontSize: 15, fontWeight: 700, color: '#EAECF4',
                    lineHeight: 1.2, marginBottom: 6,
                  }}>
                    {serviceTitles[i] ?? ''}
                  </h2>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {wf.platforms.map(p => (
                      <span key={p} style={{
                        fontSize: 9, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.38)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Steps — flex, no scroll */}
                <div style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  padding: '0 14px',
                  paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 52px)',
                  minHeight: 0,
                }}>
                  {wf.steps.map((step, si) => (
                    <Fragment key={si}>
                      <motion.div
                        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32, delay: 0.05 + si * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 14, padding: '7px 12px',
                          position: 'relative', overflow: 'hidden',
                        }}>
                          <span className="font-display" style={{
                            position: 'absolute', top: -2, right: 10,
                            fontSize: 50, fontWeight: 800,
                            color: 'rgba(255,255,255,0.025)',
                            lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
                          }}>
                            {step.num}
                          </span>

                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            background: 'rgba(79,126,255,0.1)',
                            border: '1px solid rgba(79,126,255,0.16)',
                            borderRadius: 20, padding: '2px 8px', marginBottom: 6,
                          }}>
                            <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#4F7EFF' }} />
                            <span className="font-display" style={{
                              fontSize: 7, fontWeight: 700, letterSpacing: '0.12em',
                              color: '#4F7EFF', textTransform: 'uppercase',
                            }}>
                              {step.label}
                            </span>
                          </div>

                          {step.cards.length === 1 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 28, height: 28, borderRadius: 9,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, fontSize: 14, lineHeight: 1,
                              }}>
                                {step.cards[0].icon}
                              </div>
                              <div>
                                <p className="font-display" style={{
                                  fontSize: 11, fontWeight: 600, color: '#EAECF4',
                                  lineHeight: 1.2, marginBottom: step.cards[0].sub ? 2 : 0,
                                }}>
                                  {step.cards[0].title}
                                </p>
                                {step.cards[0].sub && (
                                  <p className="font-body" style={{ fontSize: 9, color: '#8B9AB5', lineHeight: 1.3 }}>
                                    {step.cards[0].sub}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 10px' }}>
                              {step.cards.map((card, ci) => (
                                <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}>{card.icon}</span>
                                  <span className="font-display" style={{
                                    fontSize: 9, fontWeight: 600, color: '#EAECF4', lineHeight: 1.2,
                                  }}>
                                    {card.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {si < wf.steps.length - 1 && (
                        <div style={{ flexShrink: 0, height: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: 1, flex: 1, background: 'linear-gradient(to bottom, rgba(79,126,255,0.4), rgba(79,126,255,0.1))' }} />
                          <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                            <path d="M1 1L4 4L7 1" stroke="rgba(79,126,255,0.38)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </Fragment>
                  ))}

                  <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)',
                      borderRadius: 20, padding: '5px 14px',
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
                      <span className="font-display" style={{
                        fontSize: 8, fontWeight: 700, letterSpacing: '0.13em',
                        textTransform: 'uppercase', color: '#22c55e',
                      }}>
                        ✓ {wf.steps[wf.steps.length - 1].label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Navigation dots ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)',
          paddingTop: 20,
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
          background: 'linear-gradient(to top, #07090F 55%, transparent)',
          pointerEvents: 'none',
        }}>
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              style={{
                width: i === index ? 22 : 6, height: 6, borderRadius: 3,
                background: i === index ? '#4F7EFF' : 'rgba(255,255,255,0.16)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
                pointerEvents: 'auto',
              }}
            />
          ))}
        </div>
      </motion.div>
    </>,
    document.body
  )
}

// ─── Desktop workflow popup ─────────────────────────────────────────
function WorkflowPopup({ index, onClose }: {
  index: number
  onClose: () => void
}) {
  const wf = SERVICE_WORKFLOWS[index] ?? SERVICE_WORKFLOWS[0]

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        cursor: 'pointer',
      }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1,    y: 0,  opacity: 1 }}
        exit={{    scale: 0.94, y: 12, opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(96vw, 1020px)',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#0D1018',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 48px 100px rgba(0,0,0,0.7)',
          pointerEvents: 'auto',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '13px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            <span className="font-display" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>
              {wf.title}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
            {wf.platforms.map(p => (
              <span key={p} style={{
                fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 6,
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>{p}</span>
            ))}
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', marginLeft: 6, flexShrink: 0,
              }}
            >
              <X size={13} style={{ color: '#8B9AB5' }} />
            </button>
          </div>
        </div>

        {/* ── Flow ── */}
        <div style={{ padding: '20px 20px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            {wf.steps.map((step, si) => (
              <div key={si} style={{ display: 'flex', alignItems: 'flex-start' }}>

                {/* Step column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 152 }}>

                  {/* Number bubble */}
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: '#4F7EFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <span className="font-display" style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{step.num}</span>
                  </div>

                  {/* Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', padding: '0 8px' }}>
                    {step.cards.map((card, ci) => (
                      <div key={ci} style={{
                        background: '#131821',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10,
                        padding: '10px 12px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: card.sub || card.tags ? 5 : 0 }}>
                          <span style={{ fontSize: 15, lineHeight: 1 }}>{card.icon}</span>
                          <span className="font-display" style={{ fontSize: 12, fontWeight: 600, color: '#EAECF4', lineHeight: 1.2 }}>{card.title}</span>
                        </div>
                        {card.sub && (
                          <p className="font-body" style={{ fontSize: 11, color: '#8B9AB5', lineHeight: 1.4, paddingLeft: 22 }}>{card.sub}</p>
                        )}
                        {card.tags && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingLeft: 22 }}>
                            {card.tags.map((tag, ti) => {
                              const c = tagColor(tag.color)
                              return (
                                <span key={ti} style={{
                                  fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                                  background: c.bg, color: c.text, border: `1px solid ${c.border}`,
                                }}>{tag.label}</span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step label */}
                  <p className="font-display" style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.28)', marginTop: 12,
                  }}>{step.label}</p>
                </div>

                {/* Arrow connector — aligned to number bubble row */}
                {si < wf.steps.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', height: 26, flexShrink: 0, padding: '0 2px' }}>
                    <svg width="28" height="2" viewBox="0 0 28 2"><line x1="0" y1="1" x2="28" y2="1" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="3 2"/></svg>
                    <svg width="8" height="12" viewBox="0 0 8 12" style={{ marginLeft: -1 }}>
                      <path d="M1 1L7 6L1 11" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Hint ── */}
        <div style={{ padding: '0 20px 14px', textAlign: 'center' }}>
          <p className="font-body" style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
            — desliza para ver el flujo completo —
          </p>
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
  onWorkflowOpen,
  onDesktopWorkflow,
  featured = false,
  spanTwo = false,
}: {
  service: Service
  delay: number
  inView: boolean
  reduce: boolean | null
  onOpen: () => void
  onWorkflowOpen: () => void
  onDesktopWorkflow: () => void
  featured?: boolean
  spanTwo?: boolean
}) {
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

  // Scroll-triggered workflow on mobile — open when card enters view
  const onWorkflowOpenRef = useRef(onWorkflowOpen)
  useEffect(() => { onWorkflowOpenRef.current = onWorkflowOpen })
  useEffect(() => {
    if (!isMobile || !isCardInView) return
    onWorkflowOpenRef.current()
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
          ref={cardRef}
          className="md:hidden flex flex-col"
          initial={reduce ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay }}
          onClick={onWorkflowOpen}
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
        style={{
          background: '#07090F',
          padding: featured || spanTwo ? '28px 40px' : 28,
          flexDirection: featured || spanTwo ? 'row' : 'column',
          alignItems: featured || spanTwo ? 'center' : undefined,
          gap: featured || spanTwo ? 32 : 20,
          position: 'relative',
        }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(79,126,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={featured || spanTwo ? 32 : 28} style={{ color: '#FFFFFF' }} />
        </div>
        <div style={{ flex: featured || spanTwo ? 1 : undefined }}>
          <h3 className="font-display" style={{ fontSize: featured || spanTwo ? 18 : 16, fontWeight: 600, color: '#EAECF4', marginBottom: 8, lineHeight: 1.3 }}>{service.title}</h3>
          <p className="font-body" style={{ fontSize: 14, color: '#8B9AB5', lineHeight: 1.65, maxWidth: featured || spanTwo ? 480 : undefined }}>{service.description}</p>
        </div>
        <button
          onClick={onDesktopWorkflow}
          className="font-body"
          style={{
            padding: '11px 20px',
            borderRadius: 8,
            background: 'transparent',
            border: '1px solid rgba(79,126,255,0.35)',
            color: '#4F7EFF',
            fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            marginTop: featured || spanTwo ? 0 : 'auto',
            flexShrink: 0,
            transition: 'background 0.2s, border-color 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,126,255,0.12)'; e.currentTarget.style.borderColor = '#4F7EFF' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(79,126,255,0.35)' }}
        >
          Ver flujo de trabajo →
        </button>
      </motion.div>
    </>
  )
}

// ─── Section ───────────────────────────────────────────────────────
export default function Services() {
  const { t, lang } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const sectionVisible = useInView(ref, { once: false, amount: 0.01 })
  const reduce = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [mobileWorkflowIndex, setMobileWorkflowIndex] = useState<number | null>(null)
  const [desktopWorkflowIndex, setDesktopWorkflowIndex] = useState<number | null>(null)

  // Close mobile sheet when user scrolls completely out of the services section
  useEffect(() => {
    if (!sectionVisible) setMobileWorkflowIndex(null)
  }, [sectionVisible])

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
              onWorkflowOpen={() => setMobileWorkflowIndex(i)}
              onDesktopWorkflow={() => setDesktopWorkflowIndex(i)}
              featured={services.length % 3 === 1 && i === services.length - 1}
              spanTwo={services.length % 3 === 2 && i >= services.length - 2}
            />
          ))}
        </div>

      </div>

      {/* Desktop workflow popup */}
      <AnimatePresence>
        {desktopWorkflowIndex !== null && (
          <WorkflowPopup
            index={desktopWorkflowIndex}
            onClose={() => setDesktopWorkflowIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile workflow sheet */}
      <AnimatePresence>
        {mobileWorkflowIndex !== null && (
          <MobileWorkflowSheet
            index={mobileWorkflowIndex}
            onClose={() => setMobileWorkflowIndex(null)}
            total={services.length}
            onNavigate={setMobileWorkflowIndex}
            serviceTitles={services.map(s => s.title)}
          />
        )}
      </AnimatePresence>

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
