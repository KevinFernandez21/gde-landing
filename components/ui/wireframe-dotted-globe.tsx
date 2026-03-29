'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GlobeMarker {
  lat: number
  lng: number
  label: string
  color?: string
  pulse?: boolean
}

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  markers?: GlobeMarker[]
  currentLocation?: { lat: number; lng: number }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isPointVisible(lng: number, lat: number, rotation: number[]): boolean {
  const phi1 = (lat * Math.PI) / 180
  const lam1 = (lng * Math.PI) / 180
  const phi2 = (-rotation[1] * Math.PI) / 180
  const lam2 = (-rotation[0] * Math.PI) / 180
  return (
    Math.sin(phi1) * Math.sin(phi2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.cos(lam1 - lam2) >
    0
  )
}

function pointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pointInFeature(point: [number, number], feature: any): boolean {
  const { type, coordinates } = feature.geometry
  if (type === 'Polygon') {
    if (!pointInPolygon(point, coordinates[0])) return false
    for (let i = 1; i < coordinates.length; i++) {
      if (pointInPolygon(point, coordinates[i])) return false
    }
    return true
  }
  if (type === 'MultiPolygon') {
    for (const polygon of coordinates) {
      if (pointInPolygon(point, polygon[0])) {
        let inHole = false
        for (let i = 1; i < polygon.length; i++) {
          if (pointInPolygon(point, polygon[i])) { inHole = true; break }
        }
        if (!inHole) return true
      }
    }
  }
  return false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateDotsInPolygon(feature: any, dotSpacing = 16): [number, number][] {
  const dots: [number, number][] = []
  const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
  const step = dotSpacing * 0.08
  for (let lng = minLng; lng <= maxLng; lng += step) {
    for (let lat = minLat; lat <= maxLat; lat += step) {
      const p: [number, number] = [lng, lat]
      if (pointInFeature(p, feature)) dots.push(p)
    }
  }
  return dots
}

function drawTooltip(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  scaleFactor: number,
) {
  const fontSize = 12 * scaleFactor
  ctx.font = `${fontSize}px -apple-system, sans-serif`
  const tw = ctx.measureText(label).width
  const pad = 7 * scaleFactor
  const bx = x + 10 * scaleFactor
  const by = y - (fontSize + pad * 2) - 6 * scaleFactor
  const bw = tw + pad * 2
  const bh = fontSize + pad * 2
  const r = 5 * scaleFactor

  ctx.beginPath()
  ctx.moveTo(bx + r, by)
  ctx.lineTo(bx + bw - r, by)
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r)
  ctx.lineTo(bx + bw, by + bh - r)
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh)
  ctx.lineTo(bx + r, by + bh)
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r)
  ctx.lineTo(bx, by + r)
  ctx.quadraticCurveTo(bx, by, bx + r, by)
  ctx.closePath()
  ctx.fillStyle = 'rgba(13,16,24,0.92)'
  ctx.strokeStyle = 'rgba(79,126,255,0.35)'
  ctx.lineWidth = 1 * scaleFactor
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#EAECF4'
  ctx.fillText(label, bx + pad, by + pad + fontSize * 0.82)
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = '',
  markers = [],
  currentLocation,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Keep latest markers/currentLocation in a ref so the render loop
  // always sees the current values without needing to restart.
  const markersRef = useRef<GlobeMarker[]>(markers)
  const currentLocationRef = useRef(currentLocation)
  useEffect(() => { markersRef.current = markers }, [markers])
  useEffect(() => { currentLocationRef.current = currentLocation }, [currentLocation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const containerW = Math.min(width, window.innerWidth - 40)
    const containerH = Math.min(height, window.innerHeight - 100)
    const radius = Math.min(containerW, containerH) / 2.5

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerW * dpr
    canvas.height = containerH * dpr
    canvas.style.width = `${containerW}px`
    canvas.style.height = `${containerH}px`
    ctx.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerW / 2, containerH / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(ctx)

    // ── State ──
    const rotation: [number, number] = [0, -20]
    let autoRotate = true
    let isDragging = false
    let hoveredMarker: GlobeMarker | null = null
    const allDots: [number, number][] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landFeatures: any = null

    // ── Render ──
    const render = () => {
      ctx.clearRect(0, 0, containerW, containerH)

      const currentScale = projection.scale()
      const sf = currentScale / radius

      // Ocean
      ctx.beginPath()
      ctx.arc(containerW / 2, containerH / 2, currentScale, 0, 2 * Math.PI)
      ctx.fillStyle = '#000000'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 1.5 * sf
      ctx.stroke()

      if (landFeatures) {
        // Graticule
        const graticule = d3.geoGraticule()
        ctx.beginPath()
        path(graticule())
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 0.6 * sf
        ctx.globalAlpha = 0.12
        ctx.stroke()
        ctx.globalAlpha = 1

        // Land outlines
        ctx.beginPath()
        landFeatures.features.forEach((f: unknown) => { path(f as d3.GeoPermissibleObjects) })
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'
        ctx.lineWidth = 0.8 * sf
        ctx.stroke()

        // Halftone dots
        ctx.fillStyle = '#888888'
        allDots.forEach(([lng, lat]) => {
          const p = projection([lng, lat])
          if (p && p[0] >= 0 && p[0] <= containerW && p[1] >= 0 && p[1] <= containerH) {
            ctx.beginPath()
            ctx.arc(p[0], p[1], 1.2 * sf, 0, 2 * Math.PI)
            ctx.fill()
          }
        })
      }

      // ── Markers ──
      const pulsePhase = (Date.now() % 1600) / 1600 // 0→1 loop

      // Build full marker list (currentLocation + passed markers)
      const cl = currentLocationRef.current
      const allMarkers: GlobeMarker[] = cl
        ? [{ lat: cl.lat, lng: cl.lng, label: 'HQ', color: '#00FF9D', pulse: true }, ...markersRef.current]
        : markersRef.current

      allMarkers.forEach((marker) => {
        if (!isPointVisible(marker.lng, marker.lat, rotation)) return
        const p = projection([marker.lng, marker.lat])
        if (!p) return
        const [x, y] = p
        const color = marker.color ?? '#4F7EFF'

        // Pulse ring
        if (marker.pulse) {
          const ringR = (3 + pulsePhase * 14) * sf
          const ringAlpha = (1 - pulsePhase) * 0.55
          ctx.beginPath()
          ctx.arc(x, y, ringR, 0, 2 * Math.PI)
          ctx.strokeStyle = color
          ctx.lineWidth = 1.5 * sf
          ctx.globalAlpha = ringAlpha
          ctx.stroke()
          ctx.globalAlpha = 1
        }

        // Dot
        const dotR = (marker.pulse ? 5 : 4) * sf
        ctx.beginPath()
        ctx.arc(x, y, dotR, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 8 * sf
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.beginPath()
        ctx.arc(x, y, dotR, 0, 2 * Math.PI)
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'
        ctx.lineWidth = 0.8 * sf
        ctx.stroke()
      })

      // Tooltip for hovered marker
      if (hoveredMarker && isPointVisible(hoveredMarker.lng, hoveredMarker.lat, rotation)) {
        const p = projection([hoveredMarker.lng, hoveredMarker.lat])
        if (p) drawTooltip(ctx, hoveredMarker.label, p[0], p[1], sf)
      }
    }

    // ── Timer (auto-rotate + pulse repaint) ──
    const timer = d3.timer(() => {
      if (autoRotate) {
        rotation[0] += 0.3
        projection.rotate(rotation)
      }
      render()
    })

    // ── Drag ──
    canvas.addEventListener('mousedown', (e) => {
      autoRotate = false
      isDragging = true
      const sx = e.clientX
      const sy = e.clientY
      const sr: [number, number] = [rotation[0], rotation[1]]

      const onMove = (me: MouseEvent) => {
        rotation[0] = sr[0] + (me.clientX - sx) * 0.5
        rotation[1] = Math.max(-90, Math.min(90, sr[1] - (me.clientY - sy) * 0.5))
        projection.rotate(rotation)
        render()
      }
      const onUp = () => {
        isDragging = false
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        setTimeout(() => { autoRotate = true }, 1200)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    })

    // ── Zoom ──
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      projection.scale(Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * factor)))
      render()
    }, { passive: false })

    // ── Hover (tooltip) ──
    canvas.addEventListener('mousemove', (e) => {
      if (isDragging) return
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      const cl2 = currentLocationRef.current
      const allM: GlobeMarker[] = cl2
        ? [{ lat: cl2.lat, lng: cl2.lng, label: 'HQ', color: '#00FF9D', pulse: true }, ...markersRef.current]
        : markersRef.current

      hoveredMarker = null
      for (const m of allM) {
        if (!isPointVisible(m.lng, m.lat, rotation)) continue
        const p = projection([m.lng, m.lat])
        if (!p) continue
        if (Math.hypot(mx - p[0], my - p[1]) < 10) {
          hoveredMarker = m
          break
        }
      }
      canvas.style.cursor = hoveredMarker ? 'pointer' : 'grab'
    })
    canvas.addEventListener('mouseleave', () => { hoveredMarker = null })

    // ── Load GeoJSON ──
    fetch('https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json')
      .then((r) => r.json())
      .then((data) => {
        landFeatures = data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.features.forEach((feature: any) => {
          generateDotsInPolygon(feature, 16).forEach((dot) => allDots.push(dot))
        })
      })
      .catch(() => { /* silently fail — globe still renders without dots */ })

    return () => { timer.stop() }
  }, [width, height])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ maxWidth: '100%', height: 'auto', display: 'block', cursor: 'grab' }}
      />
      <p style={{ position: 'absolute', bottom: 12, left: 16, fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', pointerEvents: 'none' }}>
        Drag · Scroll to zoom
      </p>
    </div>
  )
}
