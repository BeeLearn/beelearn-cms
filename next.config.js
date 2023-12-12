/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ["localhost"],
  },
};

const removeImports = require("next-remove-imports")();

module.exports = removeImports(nextConfig);
