import { Instagram } from 'lucide-react'

const footerLinks = {
  Links: ['Inicio', 'Nosotros', 'Servicios', 'Contacto'],
  Servicios: ['Chatbots', 'Flujos', 'Agentes', 'Consultoría', 'Software'],
}

export default function Footer() {
  return (
    <footer
      className="px-6 pt-16 pb-8 border-t border-white/[0.05]"
      style={{ background: '#060608' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <p className="text-2xl font-bold text-white mb-3">Nombre</p>
            <p className="text-sm text-text-muted leading-relaxed">
              IA · Automatización · Innovación
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs uppercase tracking-widest text-text-muted mb-4">{title}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                      className="text-sm text-text-muted hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs uppercase tracking-widest text-text-muted mb-4">
              Redes Sociales
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/nombre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
              >
                <Instagram size={16} />
                @nombre
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6 text-center">
          <p className="text-xs text-text-muted">
            © 2026 Nombre. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
