import type { SiteConfig } from "@/config/site.config";

/**
 * Marché français — phase 3, et la plus risquée : c'est là qu'on perd
 * l'avantage local qui fait tout le différenciateur du site belge.
 * À n'ouvrir que si be-fr et be-nl ont clairement réussi.
 */
export const frFr: SiteConfig = {
  marketId: "fr-fr",
  domain: "TODO-domaine.fr",
  siteName: "Meilleur Robot Piscine",
  locale: "fr-FR",
  country: "FR",
  currency: "EUR",
  vatRate: 0.20,
  htmlLang: "fr",
  hreflang: "fr-FR",
  localeFile: "fr-FR",
  contentDir: "fr-fr",
  contactEmail: "",
  organizationLegalName: "",
  activeMerchantIds: ["amazon-fr"],
  affiliateTags: { amazon: "" },
};
