// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hot Pepperグルメの画像がホストされているドメインを許可
    // これにより、next/imageコンポーネントがこれらの画像を表示できるようになります
    domains: ["imgfp.hotp.jp"],
  },
};

module.exports = nextConfig;
