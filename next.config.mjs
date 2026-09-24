/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages (project site: https://<user>.github.io/<repo>/).
  // The workflow injects NEXT_BASE_PATH=/<repo-name> so it works with ANY repo
  // name or casing. Locally it defaults to "" (root).
  output: "export",
  basePath: process.env.NEXT_BASE_PATH || "",
  trailingSlash: true,
  reactStrictMode: true,
  transpilePackages: ['three'],
};

export default nextConfig;
