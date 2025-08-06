/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.jsdelivr.net",
                port: "",
                pathname: "/gh/Gitnaseem745/intelpedia-images/**",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "wisp.blog",
            },
            {
                protocol: "https",
                hostname: "*.wisp.blog",
            },
            {
                protocol: "https",
                hostname: "imagedelivery.net"
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com"
            }
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 year cache for images
    },
    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu', '@radix-ui/react-dialog'],
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    redirects: async () => {
        return [];
    },
    headers: async () => {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "img-src 'self' data: https: blob:",
                            "font-src 'self' https://fonts.gstatic.com",
                            "connect-src 'self' https://www.google-analytics.com https://wisp.blog https://api.github.com",
                            "frame-src 'none'",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "frame-ancestors 'none'"
                        ].join('; '),
                    },
                ],
            },
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=300, s-maxage=300',
                    },
                ],
            },
        ];
    },
    // Enable source maps in production for better debugging
    productionBrowserSourceMaps: true,
    // Enable compression
    compress: true,
    // Improve error handling
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    // Configure webpack for better performance
    webpack: (config, { dev, isServer }) => {
        // Optimize for production builds
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                    vendor: {
                        name: 'vendor',
                        chunks: 'all',
                        test: /node_modules/,
                        priority: 20
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 10
                    }
                }
            };
        }
        return config;
    },
};

export default nextConfig;
