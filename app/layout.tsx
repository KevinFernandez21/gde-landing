import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nombre — Inteligencia Artificial para tu Negocio',
  description: 'Automatiza, escala y transforma tu empresa con chatbots, flujos inteligentes y agentes de IA.',
  openGraph: {
    title: 'Nombre — Inteligencia Artificial para tu Negocio',
    description: 'Automatiza, escala y transforma tu empresa con chatbots, flujos inteligentes y agentes de IA.',
    url: 'https://gptfy.biz',
    siteName: 'Nombre',
    locale: 'es_LA',
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
