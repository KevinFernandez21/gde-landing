'use client'
import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon'
import { useScroll } from '@/components/ui/use-scroll'

export function Header() {
  const [open, setOpen] = React.useState(false)
  const scrolled = useScroll(10)

  const links = [
    { label: 'Servicios',     href: '#servicios' },
    { label: 'Cómo Funciona', href: '#como-funciona' },
    { label: 'Nosotros',      href: '#nosotros' },
  ]

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

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
          'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
          { 'md:px-2': scrolled },
        )}
      >
        {/* Logo */}
        <a href="#" className="flex items-center">
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'rgb(var(--foreground))',
              letterSpacing: '0.1em',
              fontFamily: 'Georgia, serif',
            }}
          >
            GDE
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link, i) => (
            <a
              key={i}
              className={buttonVariants({ variant: 'ghost' })}
              href={link.href}
              style={{ fontFamily: 'var(--font-dm)', fontSize: 13 }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            className={buttonVariants({ variant: 'default' })}
            style={{ fontFamily: 'var(--font-dm)', fontSize: 13 }}
          >
            Hablar con un experto
          </a>
        </div>

        {/* Mobile toggle */}
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col justify-between gap-y-2 p-4',
          )}
        >
          <div className="grid gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ fontFamily: 'var(--font-dm)' }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="#contacto"
              className={buttonVariants({ variant: 'default', className: 'w-full justify-center' })}
              onClick={() => setOpen(false)}
              style={{ fontFamily: 'var(--font-dm)' }}
            >
              Hablar con un experto
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
