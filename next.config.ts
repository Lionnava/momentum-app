/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- INICIO DE LA CORRECCIÓN ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Este es el identificador único de tu proyecto de Supabase.
        // Lo he sacado de la URL en tu mensaje de error.
        hostname: 'fzeritjwhzrsyyqbkewq.supabase.co', 
        port: '',
        pathname: '/storage/v1/object/public/task_images/**',
      },
    ],
  },
  // --- FIN DE LA CORRECCIÓN ---
};

export default nextConfig;