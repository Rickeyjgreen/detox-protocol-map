const nextConfig = {
  async redirects() {
    return [
      { source: '/', destination: '/apps', permanent: false },
      { source: '/protocol-map', destination: '/apps/protocol-map', permanent: false },
      { source: '/intake-logic', destination: '/apps/intake-logic', permanent: false },
    ];
  },
};

export default nextConfig;
