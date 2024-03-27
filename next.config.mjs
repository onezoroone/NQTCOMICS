/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/:path*`,
          },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
            }
        ],
    },
};

export default nextConfig;
