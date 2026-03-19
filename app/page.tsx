import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import AboutUs from '@/components/AboutUs'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import Partners from '@/components/Partners'
import CtaFinal from '@/components/CtaFinal'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <AboutUs />
      <Services />
      <HowItWorks />
      <Partners />
      <CtaFinal />
      <Footer />
    </main>
  )
}
