import { readFileSync } from "node:fs";

// Surface the published package version in the header without importing package.json at runtime.
const pkg = JSON.parse(readFileSync(new URL("../../package/package.json", import.meta.url), "utf8"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DAVI_VERSION: pkg.version,
  },
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
