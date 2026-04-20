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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.turboia.app/#organization',
      name: 'TurboIA',
      url: 'https://www.turboia.app/',
      logo: 'https://www.turboia.app/Logo/turboia-icon.webp',
      description: 'Diseñamos e implementamos inteligencia artificial que reemplaza procesos, optimiza decisiones y convierte tu operación en una ventaja competitiva real.',
      slogan: 'El futuro pertenece a las empresas que evolucionan.',
      foundingLocation: { '@type': 'Place', name: 'Guayaquil, Ecuador' },
      areaServed: ['Ecuador', 'México', 'Perú', 'Colombia', 'Guatemala'],
      knowsAbout: ['Inteligencia Artificial', 'Automatización Empresarial', 'Agentes de IA', 'Chatbots', 'Machine Learning', 'Integraciones API', 'Optimización de procesos'],
      founder: {
        '@type': 'Person',
        name: 'Daniel Calderon',
        jobTitle: 'Chief Executive Officer',
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'Universidad Rey Juan Carlos' },
          { '@type': 'CollegeOrUniversity', name: 'EUDE Business School' },
        ],
        hasOccupation: { '@type': 'Occupation', name: 'Especialista en automatización y transformación digital con IA' },
      },
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', availableLanguage: ['Spanish'] },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.turboia.app/#website',
      url: 'https://www.turboia.app/',
      name: 'TurboIA',
      inLanguage: ['es', 'en'],
      publisher: { '@id': 'https://www.turboia.app/#organization' },
    },
    {
      '@type': 'Service',
      '@id': 'https://www.turboia.app/#services',
      name: 'Automatización empresarial con inteligencia artificial',
      provider: { '@id': 'https://www.turboia.app/#organization' },
      areaServed: 'Latin America',
      audience: { '@type': 'BusinessAudience', audienceType: 'Pequeñas y medianas empresas' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios de TurboIA',
        itemListElement: [
          { '@type': 'Offer', name: 'Chatbots con IA', itemOffered: { '@type': 'Service', description: 'Automatización de atención al cliente en WhatsApp para reducir carga operativa y mejorar tiempos de respuesta.' } },
          { '@type': 'Offer', name: 'Agentes de IA', itemOffered: { '@type': 'Service', description: 'Sistemas autónomos capaces de ejecutar tareas y optimizar procesos empresariales.' } },
          { '@type': 'Offer', name: 'Automatización de procesos', itemOffered: { '@type': 'Service', description: 'Integración de herramientas y APIs para eliminar tareas repetitivas y reducir costos.' } },
          { '@type': 'Offer', name: 'Software a la medida', itemOffered: { '@type': 'Service', description: 'Desarrollo de soluciones personalizadas alineadas a procesos empresariales.' } },
          { '@type': 'Offer', name: 'Posicionamiento SEO', itemOffered: { '@type': 'Service', description: 'Optimización para motores de búsqueda para atraer tráfico orgánico de calidad.' } },
        ],
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dm.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
