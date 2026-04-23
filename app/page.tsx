import dynamic from 'next/dynamic'
import { Header } from '@/components/ui/header-2'
import Hero from '@/components/Hero'

// Below-the-fold components — separate JS chunks, client-only
const Stats          = dynamic(() => import('@/components/Stats'),          { ssr: false })
const BrandsBar      = dynamic(() => import('@/components/BrandsBar'),      { ssr: false })
const AboutUs        = dynamic(() => import('@/components/AboutUs'),        { ssr: false })
const GlobalPresence = dynamic(() => import('@/components/GlobalPresence'), { ssr: false })
const Services       = dynamic(() => import('@/components/Services'),       { ssr: false })
const TechStack      = dynamic(() => import('@/components/TechStack'),      { ssr: false })
const HowItWorks     = dynamic(() => import('@/components/HowItWorks'),     { ssr: false })
const CtaFinal       = dynamic(() => import('@/components/CtaFinal'),       { ssr: false })
const Footer         = dynamic(() => import('@/components/Footer'),         { ssr: false })

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <BrandsBar />
      <AboutUs />
      <Services />
      <TechStack />
      <HowItWorks />
      <CtaFinal />
      <Footer />
      {/* Force recompilation */}
    </main>
  )
}
