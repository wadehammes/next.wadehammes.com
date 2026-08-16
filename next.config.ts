import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    optimizePackageImports: ["culori", "gsap"],
    optimizeServerReact: true,
    ...(process.env.ANALYZE === "true" ? { bundleAnalyzer: true } : {}),
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "removeViewBox",
                    active: false,
                  },
                  {
                    name: "removeEmptyAttrs",
                    active: true,
                  },
                  {
                    name: "removeEmptyText",
                    active: true,
                  },
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
  output: process.env.VERCEL ? undefined : "standalone",
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.sndcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
      {
        protocol: "https",
        hostname: "images.prismic.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cdn.prismic.io",
        pathname: "/**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    GOOGLE_ANALYTICS_KEY: process.env.GOOGLE_ANALYTICS_KEY,
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
          ...securityHeaders,
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
          ...securityHeaders,
        ],
      },
      {
        source: "/slice-simulator",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
          ...sliceSimulatorSecurityHeaders,
        ],
      },
      {
        source: "/slice-simulator/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
          ...sliceSimulatorSecurityHeaders,
        ],
      },
      {
        source: "/api/preview",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/api/exit-preview",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          ...securityHeaders,
        ],
      },
      {
        source: "/(.*)\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          ...securityHeaders,
        ],
      },
    ];
  },
};

const scriptSrc = [
  "'self'",
  "'unsafe-eval'",
  "'unsafe-inline'",
  "*.youtube.com",
  "*.google-analytics.com",
  "*.vercel-insights.com",
  "*.vercel.app",
  "*.googletagmanager.com",
  "vercel.live",
  "https:",
];

const frameSrc =
  "*.youtube.com *.soundcloud.com w.soundcloud.com *.google.com *.twitter.com vercel.live *.prismic.io";

function buildContentSecurityPolicy(frameAncestors: string) {
  return `
  default-src 'self';
  script-src ${scriptSrc.join(" ")};
  frame-src ${frameSrc};
  child-src ${frameSrc};
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' fonts.gstatic.com;
  worker-src 'self' *.vercel.app;
  manifest-src 'self' *.vercel.app;
  frame-ancestors ${frameAncestors};
  base-uri 'self';
  form-action 'self';
`;
}

const sliceSimulatorFrameAncestors = [
  "'self'",
  "http://localhost:4431",
  "http://127.0.0.1:4431",
  "http://localhost:9999",
  "http://127.0.0.1:9999",
  "https://*.prismic.io",
].join(" ");

function createSecurityHeaders(frameAncestors: string) {
  const headers: { key: string; value: string }[] = [
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy(frameAncestors).replace(/\n/g, ""),
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
  ];
  headers.push(
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "X-DNS-Prefetch-Control",
      value: "on",
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains; preload",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    },
  );
  return headers;
}

const securityHeaders = createSecurityHeaders("'none'");

const sliceSimulatorSecurityHeaders = createSecurityHeaders(
  sliceSimulatorFrameAncestors,
);

export default nextConfig;
