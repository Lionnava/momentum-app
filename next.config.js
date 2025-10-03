// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fzeritjwhzrsyyqbkewq.supabase.co', // Tu hostname de Supabase
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

// En lugar de module.exports, usamos la sintaxis moderna "export default"
export default nextConfig;