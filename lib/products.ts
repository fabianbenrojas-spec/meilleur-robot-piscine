/**
 * Accès au catalogue. Lecture de JSON versionnés au build, jamais d'appel
 * réseau ni de client de base de données (DOCTRINE-RESEAU principe A).
 *
 * Colonnes explicites partout : pas d'équivalent de `select('*')`. Ce que la
 * page consomme est ce que le type déclare.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Product, MerchantOffer } from "@/data/product.schema";
import { siteConfig } from "@/config/site.config";

const DIR = join(process.cwd(), "data", "products");

let cache: Product[] | null = null;

function loadAll(): Product[] {
  if (cache) return cache;
  cache = readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")) as Product);
  return cache;
}

/** Produits actifs, alimente generateStaticParams. Une fiche inactive n'est
 *  pas générée : pas de page-gabarit indexable sans contenu réel. */
export function getActiveProducts(): Product[] {
  return loadAll().filter((p) => p.isActive);
}

export function getProduct(slug: string): Product | null {
  return loadAll().find((p) => p.slug === slug && p.isActive) ?? null;
}

/** Offres visibles sur ce marché, dans l'ordre déclaré par le marché. */
export function getVisibleOffers(product: Product): MerchantOffer[] {
  const order = siteConfig.activeMerchantIds;
  return product.merchants
    .filter((m) => order.includes(m.merchantId))
    .sort((a, b) => order.indexOf(a.merchantId) - order.indexOf(b.merchantId));
}

/**
 * Résout une référence marchande. Retourne null si la référence n'existe sur
 * aucune fiche active — c'est ce qui empêche /go/ de devenir un redirecteur
 * ouvert (DOCTRINE-RESEAU §2).
 */
export function findOffer(merchantId: string, ref: string): MerchantOffer | null {
  for (const p of getActiveProducts()) {
    const hit = p.merchants.find((m) => m.merchantId === merchantId && m.ref === ref);
    if (hit) return hit;
  }
  return null;
}
