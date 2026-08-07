// next.config.js
module.exports = {
  images: {
    // next/image refuses remote hosts that are not listed here, so without this
    // every carousel slide beyond the local first one fails to load.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hurley-site-images.s3-eu-west-1.amazonaws.com",
        pathname: "/minified_new/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};
