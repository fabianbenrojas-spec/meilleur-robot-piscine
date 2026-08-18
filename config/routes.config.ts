/**
 * Toutes les URLs internes du site passent par ici. Aucun composant n'écrit un
 * chemin en dur.
 *
 * Deux niveaux de résolution :
 *  - routes.*     : marché courant, pour le rendu
 *  - routeFor()   : marché arbitraire, pour le hreflang
 *
 * Le second existe parce que sans lui aucune URL d'un autre marché n'est
 * constructible et le hreflang devient impossible à générer.
 *
 * Clés de ContentType en anglais (DOCTRINE-RESEAU §1) : un nom technique n'est
 * jamais dans la langue d'un marché. Seule la VALEUR du segment est localisée.
 */
import { SILO_SEGMENTS } from "@/config/routes";
import type { MarketId } from "@/config/markets";
import { MARKETS } from "@/config/markets";
import { marketId } from "@/config/site.config";

export const contentTypes = [
  "comparison",
  "review",
  "versus",
  "brand",
  "guide",
  "problem",
  "parts",
  "tool",
] as const;

export type ContentType = (typeof contentTypes)[number];

/** Résout un chemin pour un marché donné. Utilisé par le hreflang. */
export function routeFor(market: MarketId, type: ContentType, slug?: string): string {
  const segment = SILO_SEGMENTS[market][type];
  return slug ? `/${segment}/${slug}` : `/${segment}`;
}

/** URL absolue pour un marché donné. Le domaine vient du registre, jamais
 *  d'une constante écrite à la main. */
export function absoluteUrlFor(market: MarketId, path: string): string {
  return `https://${MARKETS[market].domain}${path}`;
}

const s = SILO_SEGMENTS[marketId];

export const routes = {
  home: () => "/",

  comparisonIndex: () => `/${s.comparison}`,
  comparison: (slug: string) => `/${s.comparison}/${slug}`,
  reviewIndex: () => `/${s.review}`,
  review: (slug: string) => `/${s.review}/${slug}`,
  versusIndex: () => `/${s.versus}`,
  versus: (slug: string) => `/${s.versus}/${slug}`,
  brandIndex: () => `/${s.brand}`,
  brand: (slug: string) => `/${s.brand}/${slug}`,
  guideIndex: () => `/${s.guide}`,
  guide: (slug: string) => `/${s.guide}/${slug}`,
  problemIndex: () => `/${s.problem}`,
  problem: (slug: string) => `/${s.problem}/${slug}`,
  partsIndex: () => `/${s.parts}`,
  parts: (slug: string) => `/${s.parts}/${slug}`,
  toolIndex: () => `/${s.tool}`,
  tool: (slug: string) => `/${s.tool}/${slug}`,

  /** Hub de désambiguïsation — docs/ARBORESCENCE.md §2. */
  vacuumHub: (slug?: string) =>
    slug ? `/aspirateur-piscine/${slug}` : "/aspirateur-piscine",

  prices: () => "/prix",
  deals: () => "/promo",
  methodology: () => "/methodologie",
  about: () => "/a-propos",
  contact: () => "/contact",
  affiliateDisclosure: () => "/affiliation",
  sources: () => "/sources",
  legal: () => "/mentions-legales",

  /** Sortie monétisée unique. noindex + Disallow. */
  go: (merchantId: string, ref: string) => `/go/${merchantId}/${ref}`,
} as const;
