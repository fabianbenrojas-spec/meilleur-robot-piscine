import type { SiteConfig } from "@/config/site.config";
import { beFr } from "./be-fr";
import { beNl } from "./be-nl";
import { frFr } from "./fr-fr";

export type MarketId = "be-fr" | "be-nl" | "fr-fr";

/**
 * Registre unique de tous les marchés. config/site.config.ts résout
 * siteConfig depuis ce registre via process.env.MARKET — ne jamais
 * dupliquer ce mécanisme ailleurs.
 */
export const MARKETS: Record<MarketId, SiteConfig> = {
  "be-fr": beFr,
  "be-nl": beNl,
  "fr-fr": frFr,
};
