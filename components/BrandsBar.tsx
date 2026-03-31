'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'

// ─── Replace each src with the real logo path once you drop files in public/logos/ ───
const BRANDS = [
  { name: 'CPOlocales',     src: '/logo_externos/CPOlocales.webp' },
  { name: 'fund4U',        src: '/logo_externos/fund4U.webp' },
  { name: 'importadoselmayoristaa',       src: '/logo_externos/importadoselmayorista.webp' },
  { name: 'Lamina',      src: '/logo_externos/Lamina.webp' },
  { name: 'TestoPower',    src: '/logo_externos/testo-powwer.webp' },
  { name: 'HotFlowers',       src: '/logo_externos/hotflowers.webp' },
  { name: 'I3lab-ESPOL',    src: '/logo_externos/i3lab-espol.webp' },
  { name: 'trabajoYA',         src: '/logo_externos/trabajosYA.webp' },
  { name: 'PadrinosEcuador',         src: '/logo_externos/padrinosecuador.webp' },
  { name: 'aws',         src: '/logo_externos/aws.webp' },
  { name: 'corarmuc',         src: '/logo_externos/corarmuc.webp' },
  { name: 'Alertia',         src: '/logo_externos/alertia.webp' },
  
]

// Split into two alternating rows and duplicate for seamless loop
const ROW1 = BRANDS.filter((_, i) => i % 2 === 0)
const ROW2 = BRANDS.filter((_, i) => i % 2 !== 0)
const ITEMS1 = [...ROW1, ...ROW1]
const ITEMS2 = [...ROW2, ...ROW2]

function BrandItem({ brand }: { brand: typeof BRANDS[0] }) {
  return (
    <div className="brand-item">
      {brand.src ? (
        <div style={{ position: 'relative', width: 200, height: 80 }}>
          <Image
            src={brand.src}
            alt={brand.name}
            fill
            style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.35 }}
          />
        </div>
      ) : (
        <span
          className="font-display"
          style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
        >
          {brand.name}
        </span>
      )}
    </div>
  )
}

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

      {/* Two-row marquee */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, #07090F, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, #07090F, transparent)', zIndex: 2, pointerEvents: 'none' }} />

        {/* Row 1 */}
        <div className="brands-track">
          {ITEMS1.map((brand, i) => <BrandItem key={i} brand={brand} />)}
        </div>

        {/* Row 2 — same direction, offset start for stagger effect */}
        <div className="brands-track brands-track--offset">
          {ITEMS2.map((brand, i) => <BrandItem key={i} brand={brand} />)}
        </div>
      </div>

      <style>{`
        .brands-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: brands-scroll 28s linear infinite;
        }
        .brands-track--offset {
          animation-delay: -14s;
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
