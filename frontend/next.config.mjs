/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Set at build time so the footer shows the build date.
  env: { NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10) },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Local LLM answers can take tens of seconds.
  experimental: { proxyTimeout: 180_000 },
  async rewrites() {
    const backend = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
};

export default nextConfig;
