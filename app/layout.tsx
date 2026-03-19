import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GDE — Grupo Digital Ecommerce',
  description: 'El ecosistema digital donde los emprendedores crecen. Comunidad, automatizaciones y software a la medida.',
  openGraph: {
    title: 'GDE — Grupo Digital Ecommerce',
    description: 'Comunidad digital, automatizaciones y software a la medida para emprendedores.',
    url: 'https://gdesas.org',
    siteName: 'GDE',
    locale: 'es_EC',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
