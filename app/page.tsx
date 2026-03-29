import { Header } from '@/components/ui/header-2'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import AboutUs from '@/components/AboutUs'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import CtaFinal from '@/components/CtaFinal'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <AboutUs />
      <Services />
      <HowItWorks />
      <CtaFinal />
      <Footer />
    </main>
  )
}
