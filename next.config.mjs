/** @type {import('next').NextConfig} */
const nextConfig = {
    // Desactivar optimización de imágenes para permitir imágenes dinámicas
    images: {
        unoptimized: true,
    },
    async headers() {
        return [
            {
                // Aplica los encabezados a todas las rutas
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                    {
                        key: 'Expires',
                        value: '0',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;