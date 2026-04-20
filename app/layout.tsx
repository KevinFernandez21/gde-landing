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
  metadataBase: new URL('https://www.turboia.app'),
  title: 'Turboia',
  description: 'Automatiza, escala y transforma tu empresa con chatbots, flujos inteligentes y agentes de IA.',
  icons: {
    icon: '/Logo/logo-T.webp',
    apple: '/Logo/logo-T.webp',
  },
  openGraph: {
    title: 'TurboIA',
    description: 'Automatiza, escala y transforma tu empresa con chatbots, flujos inteligentes y agentes de IA.',
    url: 'https://www.turboia.app',
    siteName: 'TurboIA',
    locale: 'es_LA',
    type: 'website',
    images: [
      {
        // IMPORTANTE: WhatsApp casi NUNCA soporta .webp. Siempre usa .png o .jpg para OpenGraph
        url: '/Logo/opengraph-image.png', 
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
      <body className="bg-base font-body text-fore antialiased" suppressHydrationWarning>
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
