import type { MetadataRoute } from "next";
import { getSiteUrl, isSiteLaunched } from "@/config/site.config";

export default function robots(): MetadataRoute.Robots {
  // Tant que SITE_LAUNCHED n'est pas true, le site entier reste hors index.
  if (!isSiteLaunched()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // La sortie monétisée n'a rien à faire dans l'index.
        disallow: ["/go/"],
      },
    ],
    // Aucun crawler IA n'est interdit : la citabilité par les moteurs
    // génératifs est un objectif du projet, pas un risque.
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl(),
  };
}
