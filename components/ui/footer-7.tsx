'use client'

import React from 'react'
import Image from 'next/image'
import { FaInstagram, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useLanguage } from '@/lib/language-context'

const SOCIAL_LINKS = [
  { icon: <FaInstagram className="size-5" />, href: '#', label: 'Instagram' },
  { icon: <FaXTwitter  className="size-5" />, href: '#', label: 'X (Twitter)' },
  { icon: <FaLinkedin  className="size-5" />, href: '#', label: 'LinkedIn'  },
]

export function Footer7() {
  const { t, lang } = useLanguage()
  const f = t.footer

  const sections = [
    { title: f.linksTitle,    links: f.links.map(l   => ({ name: l.label, href: l.href })) },
    { title: f.servicesTitle, links: f.services.map(l => ({ name: l.label, href: l.href })) },
    { title: f.companyTitle,  links: f.company.map(l  => ({ name: l.label, href: l.href })) },
  ]

  const legalLinks = [
    { name: lang === 'en' ? 'Terms and Conditions' : 'Términos y condiciones', href: '#' },
    { name: lang === 'en' ? 'Privacy Policy'       : 'Política de privacidad',  href: '#' },
  ]

  return (
    <section className="py-16 md:py-20" style={{ background: '#07090F', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="mx-auto px-6" style={{ maxWidth: 1152 }}>

        {/* Top row */}
        <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-start">

          {/* Brand column */}
          <div className="flex w-full flex-col items-start gap-6 lg:max-w-xs">

            {/* Logo */}
            <div style={{ position: 'relative', width: 190, height: 76 }}>
              <Image
                src="/Logo/Logo-principal.webp"
                alt="Turboia"
                fill
                style={{ objectFit: 'contain', objectPosition: 'left' }}
              />
            </div>

            {/* Description */}
            <p className="font-body w-full max-w-full sm:max-w-[80%] text-sm" style={{ color: '#8B9AB5', lineHeight: 1.6 }}>
              {f.description}
            </p>

            {/* Social icons */}
            <ul className="flex items-center space-x-6" style={{ color: '#8B9AB5' }}>
              {SOCIAL_LINKS.map((s, i) => (
                <li key={i} style={{ transition: 'color 0.2s' }}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    style={{ color: '#8B9AB5', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#EAECF4')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav columns */}
          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:gap-20 pt-2 lg:pt-0">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="font-display mb-4 font-bold" style={{ fontSize: 14, color: '#EAECF4' }}>
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className="font-body text-sm"
                        style={{ color: '#8B9AB5', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EAECF4')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#8B9AB5')}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 flex flex-col justify-between gap-6 py-8 text-xs font-medium md:flex-row md:items-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: '#56647E' }}
        >
          <p className="order-2 md:order-1 font-body">
            © 2026 GDE · {f.copyright}
          </p>
          <ul className="order-1 flex flex-row flex-wrap gap-4 md:order-2 md:gap-6">
            {legalLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  className="font-body"
                  style={{ color: '#56647E', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#8B9AB5')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#56647E')}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
