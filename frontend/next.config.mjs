/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Baked into the client bundle at build time (not read at runtime) so the footer's
  // "Last updated" line reflects the actual build, not the visitor's clock.
  env: { NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10) },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Local LLMs can take tens of seconds per answer; don't cut the proxy off early.
  experimental: { proxyTimeout: 180_000 },
  // Proxy API calls to FastAPI so the browser only ever talks to this origin.
  async rewrites() {
    const backend = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
};

export default nextConfig;
