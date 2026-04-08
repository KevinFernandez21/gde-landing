'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { useExpertModal } from '@/lib/expert-modal-context'

// ─── Form config ────────────────────────────────────────────────────
type QuestionType = 'binary' | 'selection' | 'combobox' | 'textbox'

interface Question {
  id: string
  type: QuestionType
  question: string
  subtitle?: string
  options?: string[]
  placeholder?: string
  required?: boolean
}

const FORM_QUESTIONS: Question[] = [
  {
    "id": "name",
    "type": "textbox",
    "question": "¿Cuál es tu nombre?",
    "placeholder": "Tu nombre completo",
    "required": true
  },
  {
    "id": "email",
    "type": "textbox",
    "question": "¿Cuál es tu correo electrónico?",
    "subtitle": "Te contactaremos en menos de 24 horas.",
    "placeholder": "tu@empresa.com",
    "required": true
  },
  {
    "id": "company",
    "type": "textbox",
    "question": "¿Cuál es el nombre de tu empresa?",
    "placeholder": "Nombre de la empresa",
    "required": true
  },
  {
    "id": "industry",
    "type": "combobox",
    "question": "¿En qué industria opera tu empresa?",
    "options": ["Retail / E-commerce", "Servicios financieros", "Salud", "Logística", "Educación", "Manufactura", "Otro"],
    "required": true
  },
  {
    "id": "company_size",
    "type": "combobox",
    "question": "¿Cuántas personas trabajan en tu empresa?",
    "options": ["Solo yo", "2 – 10", "11 – 50", "51 – 200", "Más de 200"],
    "required": true
  },
  {
    "id": "pain_point",
    "type": "textbox",
    "question": "¿Qué proceso o problema te gustaría mejorar?",
    "subtitle": "No necesitas saber la solución, solo cuéntanos qué te frena.",
    "placeholder": "Ej: Pierdo mucho tiempo respondiendo las mismas preguntas de clientes",
    "required": true
  },
  {
    "id": "has_tools",
    "type": "binary",
    "question": "¿Ya usas herramientas digitales en tu operación?",
    "subtitle": "CRM, ERP, e-commerce, hojas de cálculo, etc.",
    "options": ["Sí", "No"],
    "required": true
  },
  {
    "id": "current_tools",
    "type": "textbox",
    "question": "¿Cuáles herramientas usas actualmente?",
    "placeholder": "Ej: HubSpot, Google Sheets, Shopify",
    "required": false
  },
  {
    "id": "urgency",
    "type": "selection",
    "question": "¿Qué tan urgente es resolver esto para ti?",
    "options": ["Es crítico, me está costando dinero", "Importante, quiero resolverlo pronto", "Estoy explorando opciones", "Solo quiero informarme"],
    "required": true
  },
  {
    "id": "how_found",
    "type": "combobox",
    "question": "¿Cómo nos encontraste?",
    "options": ["Redes sociales", "Referido", "Google", "Evento / conferencia", "Otro"],
    "required": false
  }
]
// ────────────────────────────────────────────────────────────────────

type Answers = Record<string, string>
type Direction = 1 | -1

// ─── Inputs ─────────────────────────────────────────────────────────

function BinaryInput({ q, value, onChange, onEnter }: { q: Question; value: string; onChange: (v: string) => void; onEnter: () => void }) {
  const opts = q.options ?? ['Sí', 'No']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {opts.map((opt, i) => (
        <motion.button
          key={opt}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.3 }}
          onClick={() => { onChange(opt); setTimeout(onEnter, 320) }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderRadius: 12, textAlign: 'left',
            background: value === opt ? 'rgba(79,126,255,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${value === opt ? '#4F7EFF' : 'rgba(255,255,255,0.1)'}`,
            color: value === opt ? '#EAECF4' : '#C2CDDF',
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0, fontSize: 12, fontWeight: 700,
              background: value === opt ? '#4F7EFF' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${value === opt ? '#4F7EFF' : 'rgba(255,255,255,0.15)'}`,
              color: value === opt ? '#fff' : '#8B9AB5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </span>
          {value === opt && <Check size={16} style={{ color: '#4F7EFF', flexShrink: 0 }} />}
        </motion.button>
      ))}
    </div>
  )
}

function SelectionInput({ q, value, onChange, onEnter }: { q: Question; value: string; onChange: (v: string) => void; onEnter: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {(q.options ?? []).map((opt, i) => (
        <motion.button
          key={opt}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          onClick={() => { onChange(opt); setTimeout(onEnter, 320) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 20px', borderRadius: 12, textAlign: 'left',
            background: value === opt ? 'rgba(79,126,255,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${value === opt ? '#4F7EFF' : 'rgba(255,255,255,0.1)'}`,
            color: value === opt ? '#EAECF4' : '#C2CDDF',
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <span style={{
            width: 26, height: 26, borderRadius: 6, flexShrink: 0, fontSize: 11, fontWeight: 700,
            background: value === opt ? '#4F7EFF' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${value === opt ? '#4F7EFF' : 'rgba(255,255,255,0.15)'}`,
            color: value === opt ? '#fff' : '#8B9AB5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {String.fromCharCode(65 + i)}
          </span>
          <span style={{ flex: 1 }}>{opt}</span>
          {value === opt && <Check size={15} style={{ color: '#4F7EFF', flexShrink: 0 }} />}
        </motion.button>
      ))}
    </div>
  )
}

function ComboboxInput({ q, value, onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {(q.options ?? []).map((opt, i) => (
        <motion.button
          key={opt}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          onClick={() => onChange(opt)}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 20px', borderRadius: 12, textAlign: 'left',
            background: value === opt ? 'rgba(79,126,255,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${value === opt ? '#4F7EFF' : 'rgba(255,255,255,0.1)'}`,
            color: value === opt ? '#EAECF4' : '#C2CDDF',
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <span style={{
            width: 26, height: 26, borderRadius: 6, flexShrink: 0, fontSize: 11, fontWeight: 700,
            background: value === opt ? '#4F7EFF' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${value === opt ? '#4F7EFF' : 'rgba(255,255,255,0.15)'}`,
            color: value === opt ? '#fff' : '#8B9AB5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {String.fromCharCode(65 + i)}
          </span>
          <span style={{ flex: 1 }}>{opt}</span>
          {value === opt && <Check size={15} style={{ color: '#4F7EFF', flexShrink: 0 }} />}
        </motion.button>
      ))}
    </div>
  )
}

function TextboxInput({ q, value, onChange, onEnter }: { q: Question; value: string; onChange: (v: string) => void; onEnter: () => void }) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        autoFocus
        type={q.id === 'email' ? 'email' : 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onEnter() }}
        placeholder={q.placeholder ?? ''}
        style={{
          width: '100%', padding: '16px 0',
          background: 'transparent',
          border: 'none',
          borderBottom: '2px solid rgba(255,255,255,0.2)',
          color: '#EAECF4', fontSize: 22, outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'inherit',
        }}
        onFocus={e => (e.currentTarget.style.borderBottomColor = '#4F7EFF')}
        onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.2)')}
      />
      <p style={{ fontSize: 11, color: '#56647E', marginTop: 8 }}>
        Presiona <kbd style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>Enter ↵</kbd> para continuar
      </p>
    </div>
  )
}

// ─── Success ─────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: 'center', padding: '24px 0 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
        style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(79,126,255,0.15)', border: '1px solid rgba(79,126,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Check size={28} style={{ color: '#4F7EFF' }} />
      </motion.div>
      <div>
        <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#EAECF4', marginBottom: 10 }}>
          ¡Listo! Nos ponemos en contacto.
        </h3>
        <p className="font-body" style={{ fontSize: 14, color: '#8B9AB5', lineHeight: 1.7, maxWidth: 340, margin: '0 auto' }}>
          Un especialista de GDE te escribirá en las próximas <strong style={{ color: '#C2CDDF' }}>24 horas</strong>.
        </p>
      </div>
    </motion.div>
  )
}

// ─── Modal ──────────────────────────────────────────────────────────
export default function ExpertModal() {
  const { isOpen, closeModal } = useExpertModal()
  const [step, setStep]       = useState(1)
  const [dir, setDir]         = useState<Direction>(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [done, setDone]       = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total   = FORM_QUESTIONS.length
  const current = FORM_QUESTIONS[step - 1]
  const value   = answers[current?.id ?? ''] ?? ''
  const canContinue = !current?.required || value.trim() !== ''
  const progress = ((step - 1) / total) * 100

  function handleAnswer(v: string) {
    setAnswers(prev => ({ ...prev, [current.id]: v }))
  }

  const handleContinue = useCallback(async () => {
    if (!canContinue || isSubmitting) return
    if (step < total) {
      setDir(1)
      setStep(s => s + 1)
    } else {
      setIsSubmitting(true)
      console.log('Lead captured:', answers)

      try {
        const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'REEMPLAZA_CON_TU_WEBHOOK_DE_N8N'
        if (webhookUrl !== 'REEMPLAZA_CON_TU_WEBHOOK_DE_N8N') {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'lead_submitted',
              data: answers,
              submittedAt: new Date().toISOString()
            })
          })
        }
      } catch (error) {
        console.error('Error enviando a n8n:', error)
      } finally {
        setIsSubmitting(false)
        setDone(true)
      }
    }
  }, [canContinue, step, total, answers, isSubmitting])

  function handleBack() {
    if (step > 1) { setDir(-1); setStep(s => s - 1) }
  }

  function handleClose() {
    closeModal()
    setTimeout(() => { setStep(1); setAnswers({}); setDone(false); setDir(1); setIsSubmitting(false) }, 350)
  }

  // Keyboard: Enter = continue
  useEffect(() => {
    if (!isOpen || done) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'Enter' && current?.type !== 'textbox' && canContinue) handleContinue()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, canContinue, current, done, handleContinue])

  if (!isOpen) return null

  const variants = {
    enter: (d: Direction) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit:  (d: Direction) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  }

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', width: '100%', maxWidth: 620,
          background: '#0D1018',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', position: 'relative' }}>
          <motion.div
            animate={{ width: done ? '100%' : `${progress + (1 / total) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#4F7EFF', borderRadius: 999 }}
          />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px 0' }}>
          {!done && (
            <span className="font-display" style={{ fontSize: 12, fontWeight: 600, color: '#56647E', letterSpacing: '0.1em' }}>
              {step} <span style={{ color: '#2A3347' }}>/</span> {total}
            </span>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={handleClose}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            >
              <X size={14} style={{ color: '#8B9AB5' }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 32px', minHeight: 380, display: 'flex', flexDirection: 'column' }}>
          {done ? (
            <SuccessScreen />
          ) : (
            <>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}
                >
                  {/* Question */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#EAECF4', lineHeight: 1.3 }}>
                      {current.question}
                    </h2>
                    {current.subtitle && (
                      <p className="font-body" style={{ fontSize: 13, color: '#56647E', lineHeight: 1.6 }}>
                        {current.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Input */}
                  {current.type === 'binary' && (
                    <BinaryInput    q={current} value={value} onChange={handleAnswer} onEnter={handleContinue} />
                  )}
                  {current.type === 'selection' && (
                    <SelectionInput q={current} value={value} onChange={handleAnswer} onEnter={handleContinue} />
                  )}
                  {current.type === 'combobox' && (
                    <ComboboxInput  q={current} value={value} onChange={handleAnswer} />
                  )}
                  {current.type === 'textbox' && (
                    <TextboxInput   q={current} value={value} onChange={handleAnswer} onEnter={handleContinue} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
                <button
                  onClick={handleBack}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 18px', borderRadius: 999,
                    background: step === 1 ? 'transparent' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: step === 1 ? 'transparent' : '#8B9AB5',
                    fontSize: 13, fontWeight: 500, cursor: step === 1 ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                    pointerEvents: step === 1 ? 'none' : 'auto',
                  }}
                >
                  <ArrowLeft size={14} /> Atrás
                </button>

                <button
                  onClick={handleContinue}
                  disabled={!canContinue || isSubmitting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 28px', borderRadius: 999,
                    background: (canContinue && !isSubmitting) ? '#4F7EFF' : 'rgba(79,126,255,0.25)',
                    border: 'none',
                    color: (canContinue && !isSubmitting) ? '#fff' : 'rgba(255,255,255,0.3)',
                    fontSize: 14, fontWeight: 600,
                    cursor: (canContinue && !isSubmitting) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: (canContinue && !isSubmitting) ? '0 4px 20px rgba(79,126,255,0.35)' : 'none',
                  }}
                  onMouseEnter={e => { if (canContinue && !isSubmitting) e.currentTarget.style.background = '#3560E8' }}
                  onMouseLeave={e => { if (canContinue && !isSubmitting) e.currentTarget.style.background = '#4F7EFF' }}
                >
                  {isSubmitting ? 'Enviando...' : (step === total ? 'Enviar' : 'Continuar')}
                  {!isSubmitting && (step === total ? <Check size={15} /> : <ArrowRight size={15} />)}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
