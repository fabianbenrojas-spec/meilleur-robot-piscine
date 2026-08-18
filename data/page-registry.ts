/**
 * Registre des pages commerciales — une entrée par page qui vise un cluster.
 *
 * Repris du modèle categoryRegistry / marqueRegistry du réseau aspirateurs,
 * qui est le meilleur acquis de ce repo : une entrée par page portant son
 * cluster, ses liens sortants TYPÉS et son intention. C'est ce qui rend le
 * maillage vérifiable par script au lieu de déclaratif.
 *
 * Deux différences avec l'original, délibérées :
 *
 *  1. Le registre ne porte AUCUN contenu rédigé. Chez les aspirateurs il porte
 *     h1, intro, faqs, seoText, buyingCriteria — 6 000 lignes de prose dans un
 *     fichier TypeScript, invisible en review et impossible à relire en PR.
 *     Ici la prose vit en MDX, le registre ne porte que la structure.
 *  2. Il ne porte ni metaTitle ni h1. Les titres SEO stockés hors du gabarit
 *     court-circuitent les helpers de code : c'est la dette « titres SEO en
 *     base » du repo source. Ils vivent dans le frontmatter MDX.
 *
 * Le registre répond à trois questions, et à rien d'autre :
 *   — cette page existe-t-elle, et sur quelle demande mesurée ?
 *   — vers quoi pointe-t-elle, et de quel type est chaque cible ?
 *   — quelle intention sert-elle, donc quelle densité affiliée ?
 */
import type { ContentType } from "@/config/routes.config";

export type SearchIntent = "informational" | "commercial" | "transactional" | "support";

/** Densité de liens affiliés autorisée. Dérivée de l'intention, pas choisie
 *  page par page — voir CLAUDE.md §4. */
export type AffiliateDensity = "high" | "medium" | "low" | "none";

export type TypedLink = {
  /** Le type de la cible, pas seulement son URL. C'est ce qui permet à
   *  check:maillage de vérifier des règles comme « une page problem ne pointe
   *  jamais vers une comparison ». */
  type: ContentType | "hub" | "static";
  slug: string;
};

export type PageEntry = {
  type: ContentType | "hub";
  slug: string;
  /** Doit exister dans data/keywords/clusters-be-fr.csv. */
  cluster: string;
  headTerm: string;
  /** Volume cumulé du cluster sur la base BE. Sert à l'audit des seuils. */
  clusterVolume: number;
  intent: SearchIntent;
  affiliateDensity: AffiliateDensity;
  /** Slugs de data/products/ cités. Alimente ItemList et le maillage produit. */
  products: string[];
  /** Liens sortants contextuels. Maximum 6 (CLAUDE.md §6). */
  links: TypedLink[];
  /**
   * Contreparties hreflang, déclarées page par page parce que c'est une
   * décision éditoriale et non une transformation. Une page sans contrepartie
   * ne déclare rien — jamais un repli vers la home, qui est l'erreur du
   * crossSiteMapper du réseau aspirateurs.
   */
  alternates?: Partial<Record<"be-nl" | "fr-fr", string>>;
  /** Wave de publication, cf. docs/ARBORESCENCE.md §13. */
  wave: "V1" | "V2" | "V3" | "V4" | "V5" | "V6";
  published: boolean;
};

/** Densité affiliée déduite de l'intention. Un gabarit ne choisit pas sa
 *  densité : elle découle de la distance à l'achat. */
export const DENSITY_BY_INTENT: Record<SearchIntent, AffiliateDensity> = {
  transactional: "high",
  commercial: "high",
  informational: "low",
  support: "none",
};

export const PAGE_REGISTRY: PageEntry[] = [
  {
    type: "comparison",
    slug: "robot-piscine-sans-fil",
    cluster: "robot-piscine-sans-fil",
    headTerm: "robot piscine sans fil",
    clusterVolume: 3490,
    intent: "commercial",
    affiliateDensity: "high",
    products: [],
    links: [
      { type: "comparison", slug: "robot-piscine-hors-sol" },
      { type: "guide", slug: "robot-sans-fil-ou-filaire" },
    ],
    wave: "V1",
    published: false,
  },
  {
    type: "hub",
    slug: "aspirateur-piscine",
    cluster: "aspirateur-piscine-desambiguisation",
    headTerm: "aspirateur piscine",
    clusterVolume: 2950,
    intent: "informational",
    affiliateDensity: "low",
    products: [],
    links: [{ type: "comparison", slug: "robot-piscine-sans-fil" }],
    wave: "V1",
    published: false,
  },
];
