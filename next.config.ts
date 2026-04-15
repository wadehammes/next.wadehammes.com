import type { NextConfig } from "next";
import type { Configuration, RuleSetRule } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  // Performance optimizations (`optimizeCss` omitted — Critters drops CSS for preview-only selectors.)
  experimental: {
    optimizePackageImports: ["culori", "gsap", "polished"],
    optimizeServerReact: true,
  },

  // Turbopack configuration (stable)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Output optimization
  output: "standalone",

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  env: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    GOOGLE_ANALYTICS_KEY: process.env.GOOGLE_ANALYTICS_KEY,
  },
  webpack(
    config: Configuration,
    { dev, isServer }: { dev: boolean; isServer: boolean },
  ) {
    const isRuleSetRule = (rule: unknown): rule is RuleSetRule =>
      typeof rule === "object" &&
      rule !== null &&
      "test" in rule &&
      typeof (rule as RuleSetRule).test === "object" &&
      (rule as RuleSetRule).test instanceof RegExp;

    const fileLoaderRule = config.module?.rules?.find(
      (rule) => isRuleSetRule(rule) && (rule.test as RegExp).test(".svg"),
    ) as RuleSetRule | undefined;

    if (!fileLoaderRule) {
      throw new Error("File loader rule not found");
    }

    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      use: {
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
    });

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking
      if (config.optimization) {
        config.optimization.usedExports = true;
        config.optimization.sideEffects = false;

        // Split chunks optimization
        config.optimization.splitChunks = {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
            },
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 5,
            },
          },
        };
      }
    }

    return config;
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
      // Slice Machine embeds this route in an iframe. `/:path*` also matches
      // `/slice-simulator`; Next merges rules and the LAST duplicate header key wins,
      // so these blocks must come AFTER `/:path*` or strict CSP overrides them.
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
      // After `/:path*`: override Cache-Control only (Prismic sets cookies + redirect; must not cache).
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

// https://securityheaders.com
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

function buildContentSecurityPolicy(frameAncestors: string) {
  return `
  default-src 'self';
  script-src ${scriptSrc.join(" ")};
  child-src *.youtube.com *.google.com *.twitter.com vercel.live;
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

/** Origins allowed to iframe `/slice-simulator` (Slice Machine + Prismic). */
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
  // Framing policy is `frame-ancestors` in CSP only. We intentionally omit
  // `X-Frame-Options`: Next merges header rules by key, and a later rule cannot
  // "unset" it for `/slice-simulator`, which blocked Slice Machine if DENY stuck.
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

// Bundle analyzer (only in development)
if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
