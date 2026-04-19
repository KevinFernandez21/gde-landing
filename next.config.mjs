/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true, // Esto inlinea el CSS crítico y pospone el resto (soluciona tu problema de renderización)
  },
};

export default nextConfig;
