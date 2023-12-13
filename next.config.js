/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    domains: ["localhost"],
  },
  // /**
  //  *
  //  * @param {import('webpack').Configuration} config
  //  */
  // webpack(config) {
  //   config.module.rules?.push({
  //     test: /pages[\\//]components/,
  //     loader: "ignore-loader",
  //   });

  //   return config;
  // },
};

const removeImports = require("next-remove-imports")();

module.exports = removeImports(nextConfig);

