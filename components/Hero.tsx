'use client'

import ScrollHero from '@/components/ui/ethereal'

const sections = [
  {
    id: 'hero',
    headline: 'Nombre',
    subheadline: 'Inteligencia Artificial',
    body: 'Automatiza tu negocio con IA de vanguardia',
  },
  {
    id: 'chatbots',
    headline: 'Chatbots',
    subheadline: 'Con IA Generativa',
    body: 'Agentes conversacionales que entienden a tus clientes',
  },
  {
    id: 'automatiza',
    headline: 'Automatiza',
    subheadline: 'Flujos Inteligentes',
    body: 'Procesos optimizados, equipos enfocados en lo que importa',
  },
  {
    id: 'construye',
    headline: 'Construye',
    subheadline: 'Con Nosotros',
    body: 'Software a la medida impulsado por inteligencia artificial',
  },
]

const colorPalette = {
  primary: '#7c3aed',
  secondary: '#9d5cf5',
  tertiary: '#06d6a0',
  accent: '#06d6a0',
  dark: '#080810',
}

export default function Hero() {
  return (
    <ScrollHero
      sections={sections}
      colorPalette={colorPalette}
      logo="Nombre"
      menuItems={['Servicios', 'Cómo Funciona', 'Nosotros', 'Contacto']}
    />
  )
}
