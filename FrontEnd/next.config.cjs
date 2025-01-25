module.exports = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.devtool = 'cheap-module-source-map'; // Enable source maps for client-side code
      config.node = {
        dns: 'empty',
    };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5193',
        pathname: '/uploads/**',
      },
    ],
  },
};
