/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages (project site: https://<user>.github.io/QUARTZ/)
  output: "export",
  basePath: "/QUARTZ",
  trailingSlash: true,
  reactStrictMode: true,
  transpilePackages: ['three'],
};

export default nextConfig;
