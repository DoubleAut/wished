/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.startpage.com',
                port: '',
                pathname: '/av/**',
            },
        ],
    },
}

module.exports = nextConfig
