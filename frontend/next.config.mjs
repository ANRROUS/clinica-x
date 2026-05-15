/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpilar los paquetes del monorepo
  transpilePackages: ['@clinica-x/shared-types'],
  // En MVP no se necesitan dominios remotos; se agregarán cuando subamos imágenes
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
