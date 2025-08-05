/** @type {import('next').NextConfig} */

const nextConfig = {
  // Настройка хоста для продакшена (moved to start script)
  // hostname: process.env.HOSTNAME || '0.0.0.0', // ⚠️ Invalid option, removed
  async headers() {
    return [
      {
        source: "/(.*)?",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
    ];
  },
  reactStrictMode: false,
  output: "standalone",
  images: {
    domains: [
      "randomuser.me",
      "images.domains",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "t.me",
      "dmrooqbmxdhdyblqzswu.supabase.co",
      "app.delabwallet.com",
      "pbs.twimg.com",
      "api.dicebear.com", // 🌟 Для генерации аватарок
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
