import dynamic from 'next/dynamic'
import { Header } from '@/components/ui/header-2'
import Hero from '@/components/Hero'

// Heavy components — loaded as separate JS chunks, only when needed
const BrandsBar     = dynamic(() => import('@/components/BrandsBar'))
const Stats         = dynamic(() => import('@/components/Stats'))
const AboutUs       = dynamic(() => import('@/components/AboutUs'))
const GlobalPresence = dynamic(() => import('@/components/GlobalPresence'), { ssr: false })
const Services      = dynamic(() => import('@/components/Services'),       { ssr: false })
const HowItWorks    = dynamic(() => import('@/components/HowItWorks'))
const CtaFinal      = dynamic(() => import('@/components/CtaFinal'))
const Footer        = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <BrandsBar />
      <AboutUs />
      <GlobalPresence />
      <Services />
      <HowItWorks />
      <CtaFinal />
      <Footer />
    </main>
  )
}
