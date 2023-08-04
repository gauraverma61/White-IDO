/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ctf-backend.aticloud.atican.dev",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "subgraph.pariopad.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = withPlugins([], {
  ...nextConfig,
});

const removeImports = require("next-remove-imports")();

module.exports = (phase, { defaultConfig }) => {
  return removeImports({
    ...defaultConfig,
    async rewrites() {
      return [
        {
          source: "/media-library-pro/:path*",
          destination: `${process.env.API_SERVER}/media-library-pro/:path*`, // Proxy to Backend
        },
        {
          source: "/upload/:path*",
          destination: `${process.env.API_SERVER}/upload/:path*`, // Proxy to Backend
        },
        {
          source: "/api/:path*",
          destination: `${process.env.API_SERVER}/api/:path*`, // Proxy to Backend
        },
        {
          source: "/subgraphs/:path*",
          destination: `https://api.thegraph.com/subgraphs/:path*`, // Proxy to Backend
        },
      ];
    },
    ...nextConfig,
  });
};
