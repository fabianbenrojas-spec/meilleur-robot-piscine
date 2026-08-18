import { MARKETS, type MarketId } from "@/config/markets";

/**
 * Tout ce qui est spécifique au marché déployé vit ici — jamais ailleurs.
 * Un nouveau marché = un nouveau fichier dans config/markets/, le reste du
 * code ne change pas.
 */
export type SiteConfig = {
  marketId: string;
  domain: string;
  siteName: string;
  locale: string;
  country: string;
  currency: string;
  vatRate: number;
  htmlLang: string;
  hreflang: string;
  localeFile: string;
  contentDir: string;
  contactEmail: string;
  organizationLegalName: string;
  activeMerchantIds: string[];
  affiliateTags: { amazon: string };
};

function resolveMarketId(): MarketId {
  const envMarket = process.env.MARKET;
  if (!envMarket) return "be-fr";
  if (envMarket in MARKETS) return envMarket as MarketId;
  throw new Error(
    `MARKET="${envMarket}" est absent du registre config/markets. Marchés valides : ${Object.keys(MARKETS).join(", ")}.`,
  );
}

export const marketId: MarketId = resolveMarketId();
export const siteConfig: SiteConfig = MARKETS[marketId];

export function getSiteUrl(): string {
  return `https://${siteConfig.domain}`;
}

/** Le site n'est indexable qu'une fois SITE_LAUNCHED=true (Vercel). */
export function isSiteLaunched(): boolean {
  return process.env.SITE_LAUNCHED === "true";
}
