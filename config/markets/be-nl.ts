import type { SiteConfig } from "@/config/site.config";

/**
 * Marché flamand — DÉCIDÉ : site néerlandophone à part entière, sur son
 * propre domaine et son propre projet Vercel, plus tard. Cette entrée existe
 * pour que rien ne soit hardcodé en attendant ; elle n'est pas déployée.
 *
 * Ne pas travailler dessus avant que be-fr ait fait ses preuves. Le contenu
 * ne sera jamais une traduction de be-fr : cluster propre, SERP propre.
 */
export const beNl: SiteConfig = {
  marketId: "be-nl",
  domain: "TODO-domaine-nl.be",
  siteName: "Beste Zwembadrobot",
  locale: "nl-BE",
  country: "BE",
  currency: "EUR",
  vatRate: 0.21,
  htmlLang: "nl",
  hreflang: "nl-BE",
  localeFile: "nl-BE",
  contentDir: "be-nl",
  contactEmail: "",
  organizationLegalName: "",
  /** Aligné sur DOCTRINE-RESEAU §2. bol.com et Coolblue passent devant
   *  Amazon côté flamand. */
  activeMerchantIds: ["amazon-be", "bol", "coolblue"],
  affiliateTags: { amazon: "" },
};
