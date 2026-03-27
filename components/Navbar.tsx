'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Servicios',     href: '#servicios' },
  { label: 'Cómo Funciona', href: '#como-funciona' },
  { label: 'Nosotros',      href: '#nosotros' },
  { label: 'Contacto',      href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={scrolled ? {
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(7,9,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.4s',
      } : {
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'transparent',
        transition: 'all 0.4s',
      }}
    >
      <nav style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>

        {/* Logo */}
        <a href="#" className="font-display" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em', fontFamily: 'Georgia, serif' }}>GDE</span>
        </a>

        {/* Desktop links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1, justifyContent: 'center', listStyle: 'none', margin: 0, padding: 0 }} className="hidden md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="font-body nav-link" style={{ fontSize: 14, color: '#8B9AB5', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#EAECF4')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contacto"
          className="font-body hidden md:inline-flex"
          style={{ alignItems: 'center', padding: '8px 20px', borderRadius: 999, backgroundColor: '#4F7EFF', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none', flexShrink: 0, transition: 'background-color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3560E8')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4F7EFF')}
        >
          Hablar con un experto
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: '#8B9AB5', cursor: 'pointer', padding: 4 }}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div style={{ background: 'rgba(7,9,15,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-body" style={{ fontSize: 14, color: '#8B9AB5', textDecoration: 'none' }} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contacto" className="font-body" style={{ display: 'inline-flex', justifyContent: 'center', padding: '10px 20px', borderRadius: 999, backgroundColor: '#4F7EFF', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none', marginTop: 4 }} onClick={() => setOpen(false)}>
            Hablar con un experto
          </a>
        </div>
      )}
    </header>
  )
}
