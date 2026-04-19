import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import { ExpertModalProvider } from '@/lib/expert-modal-context'
import ExpertModal from '@/components/ExpertModal'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

const dm = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Turboia',
  description: 'Automatiza, escala y transforma tu empresa con chatbots, flujos inteligentes y agentes de IA.',
  icons: {
    icon: '/Logo/Logo-T.webp',
    apple: '/Logo/Logo-T.webp',
  },
  openGraph: {
    title: 'Turboia',
    description: 'Automatiza, escala y transforma tu empresa con chatbots, flujos inteligentes y agentes de IA.',
    url: 'https://gptfy.biz',
    siteName: 'Turboia',
    locale: 'es_LA',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png', // Pon tu imagen en la carpeta `public` con este nombre (o cámbialo a .jpg)
        width: 1200,
        height: 630,
        alt: 'Turboia - Inteligencia Artificial',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dm.variable}`}>
      <body className="bg-base font-body text-fore antialiased">
        <LanguageProvider>
          <ExpertModalProvider>
            {children}
            <ExpertModal />
          </ExpertModalProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
