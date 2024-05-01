// next.config.js
module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Resolve 'child_process' module issues on the client side
        config.resolve.fallback = {
          child_process: false,
          fs: false,
          http2: false,
          net: false,
          tls:false,
        };
      }
  
      return config;
    },
    env: {
      ROOMS: process.env.ROOMS,
    },
  };
  