'use client'

import { ShaderAnimation } from '@/components/ui/shader-animation'

export default function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>
      <ShaderAnimation />

      {/* Dark vignette — tames the shader so text breathes */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.9) 100%)' }} />

      {/* Content layer — sits on top of shader */}
      <div style={{ position: 'absolute', inset: 0, marginTop: '100px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>

        {/*<p className="font-display" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4F7EFF', marginBottom: 28 }}>
          Inteligencia Artificial para Empresas
        </p>*/}

        <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92, color: '#FFFFFF', maxWidth: 800, margin: '0 auto 32px' }}>
          Automatiza.<br />Escala.<br />Transforma.
        </h1>

        <p className="font-body" style={{ fontSize: 16, lineHeight: 1.7, color: '#8B9AB5', maxWidth: 380, margin: '0 auto 40px' }}>
          Construimos soluciones de IA que reemplazan trabajo manual y aceleran tu negocio.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <a
            href="#contacto"
            className="font-body"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: 999, backgroundColor: '#4F7EFF', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'background-color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3560E8')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4F7EFF')}
          >
            Hablar con un experto
          </a>
          <a
            href="#servicios"
            className="font-body"
            style={{ fontSize: 14, color: '#8B9AB5', textDecoration: 'none', transition: 'color 0.2s', pointerEvents: 'auto' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#EAECF4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
          >
            Ver servicios →
          </a>
        </div>
      </div>
    </section>
  )
}
