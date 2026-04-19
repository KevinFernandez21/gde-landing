import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Configura aquí la URL base de tu sitio web cuando esté en producción
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tusitio.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Puedes añadir rutas deshabilitadas (ej. la ruta de descargas o login interno)
      // disallow: '/private/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
