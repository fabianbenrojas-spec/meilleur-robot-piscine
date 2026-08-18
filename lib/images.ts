/**
 * Centralisation des chemins d'images. Aucun composant ne construit un chemin
 * d'image à la main — c'est le pattern productImages.ts du réseau aspirateurs,
 * qui est le seul de ce repo à avoir survécu à trois migrations de stockage.
 *
 * Les trois variantes sont générées à l'ingestion par scripts/build-images.mjs.
 * Aucune transformation à l'exécution : Vercel facture l'Image Optimization sur
 * un compteur séparé (DOCTRINE-RESEAU §3.3 et §4).
 */

const PRODUCTS_DIR = "/images/products";

export type ImageVariant = 400 | 800 | 1200;

/** Chemin d'une variante. `key` est la clé locale-agnostique du produit, jamais
 *  le slug d'URL localisé : le repo sert trois marchés avec un seul jeu de
 *  fichiers. */
export function productImage(key: string, variant: ImageVariant = 800): string {
  return `${PRODUCTS_DIR}/${key}-${variant}.webp`;
}

export function productSrcSet(key: string): string {
  return [400, 800, 1200]
    .map((w) => `${PRODUCTS_DIR}/${key}-${w}.webp ${w}w`)
    .join(", ");
}

/** Attributs complets d'une image produit. `lcp` pour le visuel principal
 *  d'une fiche ou le premier visuel d'un comparatif : pas de lazy, priorité
 *  haute, et un <link rel="preload"> côté page. */
export function productImageProps(
  key: string,
  alt: string,
  opts: { lcp?: boolean; sizes?: string } = {},
) {
  return {
    src: productImage(key, 800),
    srcSet: productSrcSet(key),
    sizes: opts.sizes ?? "(max-width: 640px) 100vw, 400px",
    width: 800,
    height: 800,
    alt,
    loading: opts.lcp ? undefined : ("lazy" as const),
    fetchPriority: opts.lcp ? ("high" as const) : undefined,
    decoding: "async" as const,
  };
}
