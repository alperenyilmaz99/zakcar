import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/:path*.html", destination: "/:path*", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      {
        source: "/blog/musteri-hikayeleri-saw-rent-a-car-ile-unutulmaz-seyahat-anilari",
        destination: "/blog/musteri-hikayeleri-zakcar-ile-unutulmaz-seyahat-anilari",
        permanent: true,
      },
      {
        source: "/blog/saw-rent-a-car-ile-unutulmaz-kis-tatili",
        destination: "/blog/zakcar-ile-unutulmaz-kis-tatili",
        permanent: true,
      },
      {
        source: "/blog/yolcu360-vs-saw-rent-a-car-hangisi-daha-avantajli-2026-karsilastirma",
        destination: "/blog/yolcu360-vs-zakcar-hangisi-daha-avantajli-2026-karsilastirma",
        permanent: true,
      },
      {
        source: "/blog/sixt-istanbul-vs-saw-rent-a-car-premium-arac-kiralama-karsilastirmasi-2026",
        destination: "/blog/sixt-istanbul-vs-zakcar-premium-arac-kiralama-karsilastirmasi-2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
