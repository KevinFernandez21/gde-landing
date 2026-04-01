'use client'

import { motion } from 'framer-motion'
import { CircleCheck } from 'lucide-react'

interface ProgressIndicatorProps {
  step: number        // 1-based current step
  totalSteps: number
  onBack: () => void
  onContinue: () => void
  isFirst: boolean
  isLast: boolean
  canContinue: boolean
  labelContinue?: string
  labelFinish?: string
  labelBack?: string
}

export default function ProgressIndicator({
  step,
  totalSteps,
  onBack,
  onContinue,
  isFirst,
  isLast,
  canContinue,
  labelContinue = 'Continuar',
  labelFinish   = 'Enviar',
  labelBack     = 'Atrás',
}: ProgressIndicatorProps) {
  // Dot spacing: each dot is 8px wide + 24px gap = 32px per step
  const DOT_SIZE  = 8
  const GAP       = 24
  const UNIT      = DOT_SIZE + GAP
  const totalWidth = DOT_SIZE + (totalSteps - 1) * UNIT
  const progressWidth = DOT_SIZE + (step - 1) * UNIT

  return (
    <div className="flex flex-col items-center gap-8">

      {/* Dots */}
      <div className="flex items-center gap-6 relative" style={{ width: totalWidth }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            style={{
              width: DOT_SIZE, height: DOT_SIZE, borderRadius: '50%',
              background: i < step ? '#fff' : 'rgba(255,255,255,0.2)',
              position: 'relative', zIndex: 10, flexShrink: 0,
            }}
          />
        ))}

        {/* Progress overlay */}
        <motion.div
          animate={{ width: progressWidth }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.8 }}
          style={{
            position: 'absolute',
            left: -DOT_SIZE / 2,
            top: '50%',
            translateY: '-50%',
            height: DOT_SIZE + 4,
            background: '#4F7EFF',
            borderRadius: 999,
          }}
        />
      </div>

      {/* Buttons */}
      <div className="w-full flex items-center gap-2">
        {!isFirst && (
          <motion.button
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 64 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            onClick={onBack}
            style={{
              padding: '12px 16px', borderRadius: 999,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#C2CDDF', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            {labelBack}
          </motion.button>
        )}

        <button
          onClick={onContinue}
          disabled={!canContinue}
          style={{
            flex: 1, padding: '12px 24px', borderRadius: 999,
            background: canContinue ? '#4F7EFF' : 'rgba(79,126,255,0.3)',
            border: 'none', color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: canContinue ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {isLast && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <CircleCheck size={15} />
            </motion.span>
          )}
          {isLast ? labelFinish : labelContinue}
        </button>
      </div>

    </div>
  )
}
