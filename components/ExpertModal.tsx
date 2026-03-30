'use client'

import React from 'react'
import { InlineWidget } from 'react-calendly'
import { useExpertModal } from '@/lib/expert-modal-context'
import { useLanguage } from '@/lib/language-context'

const CALENDLY_URL = 'https://calendly.com/PLACEHOLDER/consulta'

export default function ExpertModal() {
  const { isOpen, closeModal } = useExpertModal()
  const { t } = useLanguage()

  // Close modal when Calendly booking is completed
  React.useEffect(() => {
    function handleCalendlyEvent(e: MessageEvent) {
      if (e.data?.event === 'calendly.event_scheduled') {
        closeModal()
      }
    }
    window.addEventListener('message', handleCalendlyEvent)
    return () => window.removeEventListener('message', handleCalendlyEvent)
  }, [closeModal])

  // Close on Escape key
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, closeModal])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={closeModal}
    >
      {/* Container — stops click propagation so clicking inside doesn't close */}
      <div
        className="font-body"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 20,
          backgroundColor: '#0A0A0A',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8B9AB5',
            fontSize: 24,
            lineHeight: 1,
            padding: 4,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
        >
          ✕
        </button>

        {/* Cards row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          {/* Card 1 — Schedule */}
          <div
            style={{
              flex: '1 1 320px',
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '28px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <p
              className="font-display"
              style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
            >
              {t.expertModal.scheduleTitle}
            </p>
            <p
              className="font-body"
              style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.6, marginBottom: 8 }}
            >
              {t.expertModal.scheduleDesc}
            </p>
            <div style={{ borderRadius: 12, overflow: 'hidden', minHeight: 580 }}>
              <InlineWidget
                url={CALENDLY_URL}
                styles={{ height: 580, minWidth: 280 }}
              />
            </div>
          </div>

          {/* Card 2 — Diagnose */}
          <div
            style={{
              flex: '1 1 280px',
              borderRadius: 16,
              backgroundColor: 'rgba(79,126,255,0.05)',
              border: '1px solid rgba(79,126,255,0.15)',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <p
              className="font-display"
              style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
            >
              {t.expertModal.diagnoseTitle}
            </p>
            <p
              className="font-body"
              style={{ fontSize: 13, color: '#8B9AB5', lineHeight: 1.6 }}
            >
              {t.expertModal.diagnoseDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
