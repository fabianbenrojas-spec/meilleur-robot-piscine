import type { SiteConfig } from "@/config/site.config";

/** Marché de lancement. Seul marché déployé à ce jour. */
export const beFr: SiteConfig = {
  marketId: "be-fr",
  domain: "www.meilleur-robot-piscine.be",
  siteName: "Meilleur Robot Piscine",
  locale: "fr-BE",
  country: "BE",
  currency: "EUR",
  vatRate: 0.21,
  htmlLang: "fr",
  hreflang: "fr-BE",
  localeFile: "fr-BE",
  contentDir: "be-fr",
  contactEmail: "contact@meilleur-robot-piscine.be",
  organizationLegalName: "Meilleur Robot Piscine",
  /** Marchands actifs dans le PriceTable, dans l'ordre d'affichage. */
  activeMerchantIds: ["amazon-be", "bol", "coolblue", "hubo", "brico"],
  affiliateTags: {
    /**
     * Tracking ID dédié à ce site, sur le compte Amazon Partenaires
     * amazon.com.be. C'est lui qui part dans le paramètre ?tag= de chaque
     * lien /go/amazon-be/.
     *
     * Le StoreID du compte (meilleurteste-21) n'est PAS un tag de lien : il
     * identifie le compte Partenaires. Ne jamais le mettre dans une URL.
     *
     * Un tracking ID par site = un reporting par site. Ne jamais réutiliser
     * celui d'un autre projet, sinon les revenus deviennent illisibles.
     */
    amazon: "meilleur-robot-piscine06-21",
  },
};
