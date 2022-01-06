/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(otf|pdf)$/,
      loader: "file-loader",
    });

    return config;
  },
};
