'use client'

import { Instagram } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export default function Footer() {
  const { t } = useLanguage()
  const f = t.footer

  return (
    <footer className="px-6 pt-16 pb-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#07090F' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" style={{ marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div className="font-display" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.1em', fontFamily: 'Georgia, serif' }}>GDE</span>
            </div>
            <p className="font-body" style={{ fontSize: 10, color: '#8B9AB5', letterSpacing: '0.16em', textTransform: 'uppercase', lineHeight: 1.6 }}>{f.tagline}</p>
          </div>

          {/* Links column */}
          <div>
            <p className="font-display" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4F7EFF', marginBottom: 16 }}>
              {f.linksTitle}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {f.links.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-body"
                    style={{ fontSize: 13, color: '#8B9AB5', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#EAECF4')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services column */}
          <div>
            <p className="font-display" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4F7EFF', marginBottom: 16 }}>
              {f.servicesTitle}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {f.services.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-body"
                    style={{ fontSize: 13, color: '#8B9AB5', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#EAECF4')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social column */}
          <div>
            <p className="font-display" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4F7EFF', marginBottom: 16 }}>
              {f.socialTitle}
            </p>
            <a
              href="https://instagram.com/nombre"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8B9AB5', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#EAECF4')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
            >
              <Instagram size={14} />
              @nombre
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between' }}>
          <p className="font-body" style={{ fontSize: 11, color: '#56647E' }}>© 2026 GDE · {f.tagline}</p>
          <p className="font-body" style={{ fontSize: 11, color: '#56647E' }}>{f.copyright}</p>
        </div>

      </div>
    </footer>
  )
}
