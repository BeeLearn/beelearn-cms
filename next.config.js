/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ["localhost"],
  },
};

const removeImports = require("next-remove-imports")();

module.exports = removeImports(nextConfig);
