'use client'
import React from 'react'
import Image from 'next/image'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon'
import { useScroll } from '@/components/ui/use-scroll'
import { useLanguage } from '@/lib/language-context'
import { useExpertModal } from '@/lib/expert-modal-context'
import type { Lang } from '@/lib/translations'

export function Header() {
  const [open, setOpen] = React.useState(false)
  const scrolled = useScroll(10)
  const { lang, setLanguage, t } = useLanguage()
  const { openModal } = useExpertModal()

  const links = [
    { label: t.nav.services,   href: '#servicios' },
    { label: t.nav.howItWorks, href: '#como-funciona' },
    { label: t.nav.about,      href: '#nosotros' },
  ]

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const LangToggle = () => (
    <div className="flex items-center gap-1 font-body" style={{ fontSize: 12 }}>
      {(['es', 'en'] as Lang[]).map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span style={{ color: '#8B9AB5' }}>|</span>}
          <button
            onClick={() => setLanguage(l)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
              color: lang === l ? '#FFFFFF' : '#8B9AB5',
              fontWeight: lang === l ? 600 : 400,
              fontSize: 12,
              transition: 'color 0.2s',
              fontFamily: 'var(--font-dm)',
              textTransform: 'uppercase',
            }}
          >
            {l}
          </button>
        </React.Fragment>
      ))}
    </div>
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-5xl md:rounded-full md:transition-all md:ease-out',
        {
          'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow-lg':
            scrolled && !open,
          'bg-background/90': open,
        },
      )}
    >
      <nav
        className={cn(
          'flex h-16 w-full items-center justify-between px-6 md:h-20 md:px-8 md:transition-all md:ease-out',
          { 'md:h-16 md:px-6': scrolled },
        )}
      >
        {/* Logo */}
        <a href="#" className="flex items-center" style={{ position: 'relative', width: 40, height: 40 }}>
          <Image
            src="/Logo/logo-T.webp"
            alt="Turboia"
            fill
            sizes="40px"
            priority
            style={{ objectFit: 'contain', objectPosition: 'left' }}
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link, i) => (
            <a key={i} className={buttonVariants({ variant: 'ghost' })} href={link.href}
              style={{ fontFamily: 'var(--font-dm)', fontSize: 13 }}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right: lang toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LangToggle />
          <button
            onClick={openModal}
            className={buttonVariants({ variant: 'default' })}
            style={{ fontFamily: 'var(--font-dm)', fontSize: 13 }}
          >
            {t.nav.cta}
          </button>
        </div>

        {/* Mobile hamburger */}
        <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      {/* Mobile drawer */}
      <div className={cn(
        'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
        open ? 'block' : 'hidden',
      )}>
        <div data-slot={open ? 'open' : 'closed'} className={cn(
          'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
          'flex h-full w-full flex-col justify-between gap-y-2 p-4',
        )}>
          <div className="grid gap-y-2">
            {links.map((link) => (
              <a key={link.label}
                className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
                href={link.href} onClick={() => setOpen(false)}
                style={{ fontFamily: 'var(--font-dm)' }}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <LangToggle />
            </div>
            <button
              onClick={() => { setOpen(false); openModal() }}
              className={buttonVariants({ variant: 'default', className: 'w-full justify-center' })}
              style={{ fontFamily: 'var(--font-dm)' }}
            >
              {t.nav.cta}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
