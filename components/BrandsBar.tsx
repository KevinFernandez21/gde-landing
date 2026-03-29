'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'

// ─── Replace each src with the real logo path once you drop files in public/logos/ ───
const BRANDS = [
  { name: 'Acme Corp',     src: null },
  { name: 'Globex',        src: null },
  { name: 'Initech',       src: null },
  { name: 'Umbrella',      src: null },
  { name: 'Stark Ind.',    src: null },
  { name: 'Waystar',       src: null },
  { name: 'Pied Piper',    src: null },
  { name: 'Hooli',         src: null },
]

// Duplicate list so the marquee loops seamlessly
const ITEMS = [...BRANDS, ...BRANDS]

export default function BrandsBar() {
  const { lang } = useLanguage()
  const label = lang === 'en' ? 'Trusted by leading companies' : 'Empresas que confían en nosotros'

  return (
    <section style={{ padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>

      {/* Label */}
      <p
        className="font-display"
        style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginBottom: 32 }}
      >
        {label}
      </p>

      {/* Marquee track */}
      <div style={{ position: 'relative' }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, #07090F, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, #07090F, transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div className="brands-track">
          {ITEMS.map((brand, i) => (
            <div key={i} className="brand-item">
              {brand.src ? (
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={120}
                  height={40}
                  style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.35 }}
                />
              ) : (
                /* Placeholder — remove once you add real logos */
                <span
                  className="font-display"
                  style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
                >
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .brands-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: brands-scroll 28s linear infinite;
        }
        .brands-track:hover {
          animation-play-state: paused;
        }
        .brand-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 48px;
          min-width: 160px;
        }
        @keyframes brands-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
