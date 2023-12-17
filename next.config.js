const UnoCSS = require("@unocss/webpack").default;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["localhost"],
  },
  webpack(config) {
    config.cache = false;
    config.plugins.push(UnoCSS());

    return config;
  },
};

const removeImports = require("next-remove-imports")();

module.exports = removeImports(nextConfig);

