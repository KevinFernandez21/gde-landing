import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'base':     '#07090F',   // page background
        'panel':    '#0D1018',   // card background
        'panel-hi': '#131824',   // card hover
        // Brand (safe names — no Tailwind conflicts)
        'brand':    '#4F7EFF',   // primary blue
        'brand-d':  '#3560E8',   // darker on hover
        // Text — high contrast
        'fore':     '#EAECF4',   // main text (near white)
        'sub':      '#8B9AB5',   // secondary text (much lighter muted)
        // Borders
        'edge':     'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body:    ['var(--font-dm)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
