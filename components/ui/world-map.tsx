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

const W = 960
const H = 500

export default function WorldMap({ markers = [], className = '' }: WorldMapProps) {
  const [paths, setPaths]                       = useState<string[]>([])
  const [projected, setProjected]               = useState<ProjectedMarker[]>([])
  const [hovered, setHovered]                   = useState<ProjectedMarker | null>(null)
  const projectionRef                           = useRef<d3.GeoProjection | null>(null)

  useEffect(() => {
    const projection = d3
      .geoNaturalEarth1()
      .scale(153)
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
        const ps: string[] = data.features.map((f: any) => pathGen(f) ?? '')
        setPaths(ps)

        const pm: ProjectedMarker[] = markers.flatMap((m) => {
          const pt = projection([m.lng, m.lat])
          if (!pt) return []
          return [{ ...m, x: pt[0], y: pt[1] }]
        })
        setProjected(pm)
      })
      .catch(() => {})
  // markers changes shouldn't re-fetch — projection is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reproject if markers prop changes after load
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

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        {/* ── Country fills ── */}
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="rgba(79,126,255,0.04)"
            stroke="rgba(79,126,255,0.18)"
            strokeWidth={0.5}
          />
        ))}

        {/* ── Connection lines from HQ (first pulse marker) ── */}
        {(() => {
          const hq = projected.find((m) => m.pulse)
          if (!hq) return null
          return projected
            .filter((m) => !m.pulse)
            .map((m, i) => (
              <line
                key={i}
                x1={hq.x} y1={hq.y}
                x2={m.x}  y2={m.y}
                stroke="rgba(79,126,255,0.15)"
                strokeWidth={0.8}
                strokeDasharray="3 4"
              />
            ))
        })()}

        {/* ── Markers ── */}
        {projected.map((m, i) => {
          const color = m.color ?? '#4F7EFF'
          const isHovered = hovered?.label === m.label
          return (
            <g
              key={i}
              transform={`translate(${m.x},${m.y})`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(m)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Pulse rings (CSS animation) */}
              {m.pulse && (
                <>
                  <circle r={14} fill="none" stroke={color} strokeWidth={1} opacity={0} style={{ animation: 'map-pulse 2s ease-out infinite' }} />
                  <circle r={22} fill="none" stroke={color} strokeWidth={0.6} opacity={0} style={{ animation: 'map-pulse 2s ease-out 0.7s infinite' }} />
                </>
              )}
              {/* Glow */}
              <circle
                r={m.pulse ? 8 : 6}
                fill={color}
                opacity={0.2}
                style={{ transition: 'r 0.2s' }}
              />
              {/* Dot */}
              <circle
                r={m.pulse ? 5 : 4}
                fill={color}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={0.8}
                style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'r 0.2s' }}
              />
              {/* Hover enlarge */}
              {isHovered && (
                <circle r={9} fill="none" stroke={color} strokeWidth={1} opacity={0.6} />
              )}
            </g>
          )
        })}

        {/* ── Tooltip ── */}
        {hovered && (() => {
          const lx = hovered.x + 12
          const ly = hovered.y - 14
          const label = hovered.label
          const tw = label.length * 6.8 + 16
          const th = 22
          return (
            <g>
              <rect x={lx} y={ly - th * 0.75} width={tw} height={th} rx={5} ry={5}
                fill="rgba(13,16,24,0.92)" stroke="rgba(79,126,255,0.3)" strokeWidth={0.8}
              />
              <text x={lx + 8} y={ly + 1}
                fill="#EAECF4" fontSize={11} fontFamily="-apple-system,sans-serif"
              >
                {label}
              </text>
            </g>
          )
        })()}
      </svg>

      {/* ── Pulse keyframes ── */}
      <style>{`
        @keyframes map-pulse {
          0%   { r: 8;  opacity: 0.7; }
          100% { r: 28; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
