import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * L'Image Optimization de Vercel est facturée sur un compteur séparé du TB
   * inclus (DOCTRINE-RESEAU §3.3). Les variantes sont générées à l'ingestion
   * par scripts/build-images.mjs et servies en statique.
   *
   * Ce réglage est global et non négociable : il transforme l'interdit en
   * impossibilité. Même un `next/image` importé par distraction dans deux ans
   * ne peut plus déclencher le compteur.
   */
  images: { unoptimized: true },

  // Pas de `experimental.ppr`, pas de `revalidate` global : 100 % SSG.
  // La seule route dynamique est /go/[merchant]/[ref].

  async headers() {
    return [
      {
        source: "/go/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
