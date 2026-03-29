'use client'

import { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

export interface MapMarker {
  lat: number
  lng: number
  label: string
  color?: string
  pulse?: boolean
}

interface WorldMapProps {
  markers?: MapMarker[]
  className?: string
}

interface ProjectedMarker extends MapMarker {
  x: number
  y: number
}

// Countries that have offices — highlighted differently
const HIGHLIGHT_COUNTRIES = new Set([
  'Ecuador', 'Colombia', 'United States of America', 'Guatemala', 'Peru',
])

const W = 960
const H = 560

export default function WorldMap({ markers = [], className = '' }: WorldMapProps) {
  const [paths, setPaths]     = useState<{ d: string; highlight: boolean }[]>([])
  const [projected, setProjected] = useState<ProjectedMarker[]>([])
  const [hovered, setHovered] = useState<ProjectedMarker | null>(null)
  const projectionRef         = useRef<d3.GeoProjection | null>(null)

  useEffect(() => {
    // Zoomed into Americas: center on -79°, 8°N — covers Guatemala → Lima, Miami → Bogotá
    const projection = d3
      .geoMercator()
      .scale(700)
      .center([-79, 6])
      .translate([W / 2, H / 2])

    projectionRef.current = projection
    const pathGen = d3.geoPath().projection(projection)

    fetch(
      'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/cultural/ne_110m_admin_0_countries.json'
    )
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ps = data.features.map((f: any) => ({
          d: pathGen(f) ?? '',
          highlight: HIGHLIGHT_COUNTRIES.has(f.properties?.NAME ?? f.properties?.name ?? ''),
        }))
        setPaths(ps)

        const pm: ProjectedMarker[] = markers.flatMap((m) => {
          const pt = projection([m.lng, m.lat])
          if (!pt) return []
          return [{ ...m, x: pt[0], y: pt[1] }]
        })
        setProjected(pm)
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const proj = projectionRef.current
    if (!proj || paths.length === 0) return
    const pm: ProjectedMarker[] = markers.flatMap((m) => {
      const pt = proj([m.lng, m.lat])
      if (!pt) return []
      return [{ ...m, x: pt[0], y: pt[1] }]
    })
    setProjected(pm)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, paths.length])

  const hq = projected.find((m) => m.pulse)

  return (
    <div className={`relative w-full ${className}`} style={{ background: 'transparent' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Country fills ── */}
        {paths.map(({ d, highlight }, i) => (
          <path
            key={i}
            d={d}
            fill={highlight ? 'rgba(79,126,255,0.13)' : 'rgba(79,126,255,0.03)'}
            stroke={highlight ? 'rgba(79,126,255,0.45)' : 'rgba(79,126,255,0.12)'}
            strokeWidth={highlight ? 0.8 : 0.4}
          />
        ))}

        {/* ── Connection lines from HQ ── */}
        {hq && projected.filter((m) => !m.pulse).map((m, i) => (
          <line
            key={i}
            x1={hq.x} y1={hq.y}
            x2={m.x}  y2={m.y}
            stroke="rgba(79,126,255,0.2)"
            strokeWidth={1}
            strokeDasharray="4 5"
          />
        ))}

        {/* ── Markers ── */}
        {projected.map((m, i) => {
          const color  = m.color ?? '#4F7EFF'
          const isHQ   = !!m.pulse
          const dotR   = isHQ ? 7 : 5
          const glowId = isHQ ? 'glow-green' : 'glow-blue'
          const isHov  = hovered?.label === m.label

          // Label position: push right by default, flip left near right edge
          const labelX = m.x > W * 0.75 ? m.x - 10 : m.x + dotR + 8
          const anchor = m.x > W * 0.75 ? 'end' : 'start'

          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(m)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'default' }}
            >
              {/* Pulse rings */}
              {isHQ && (
                <>
                  <circle cx={m.x} cy={m.y} r={dotR} fill="none" stroke={color} strokeWidth={1.2}
                    style={{ animation: 'map-pulse 2.2s ease-out infinite' }} />
                  <circle cx={m.x} cy={m.y} r={dotR} fill="none" stroke={color} strokeWidth={0.7}
                    style={{ animation: 'map-pulse 2.2s ease-out 0.9s infinite' }} />
                </>
              )}

              {/* Outer glow */}
              <circle cx={m.x} cy={m.y} r={dotR + 4} fill={color} opacity={isHQ ? 0.18 : 0.1} />

              {/* Dot */}
              <circle
                cx={m.x} cy={m.y} r={isHov ? dotR + 2 : dotR}
                fill={color}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth={1}
                filter={`url(#${glowId})`}
                style={{ transition: 'r 0.15s' }}
              />

              {/* Always-visible label */}
              <text
                x={labelX} y={m.y + 4}
                textAnchor={anchor}
                fontSize={isHQ ? 12 : 11}
                fontWeight={isHQ ? 700 : 500}
                fontFamily="-apple-system, sans-serif"
                fill={isHQ ? '#00FF9D' : 'rgba(255,255,255,0.75)'}
                style={{ pointerEvents: 'none', letterSpacing: '0.02em' }}
              >
                {m.label}
                {isHQ && ' ★'}
              </text>
            </g>
          )
        })}
      </svg>

      <style>{`
        @keyframes map-pulse {
          0%   { r: 7;  opacity: 0.8; }
          100% { r: 36; opacity: 0;   }
        }
      `}</style>
    </div>
  )
}
