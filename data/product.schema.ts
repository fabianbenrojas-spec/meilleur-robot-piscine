/**
 * Schéma unique du catalogue produit. Source de vérité : data/products/*.json.
 *
 * NOMS DE CHAMPS EN ANGLAIS, sans exception (DOCTRINE-RESEAU §1). Le contenu
 * est localisé, la structure ne l'est jamais. C'est la règle qui empêche le
 * `verdict_court` / `verdict_kort` du réseau aspirateurs, où le même champ a
 * pris deux noms selon le marché et rendu 41 blocs invisibles.
 *
 * Aucune donnée n'est lue à l'exécution depuis un service tiers. Ces JSON sont
 * versionnés et compilés au build.
 */

export type RobotType =
  | "electric-corded"
  | "electric-battery"
  | "hydraulic-suction"
  | "hydraulic-pressure"
  | "surface-skimmer";

export type PoolSurface = "liner" | "polyester-shell" | "tile" | "concrete" | "reinforced-pvc";
export type PoolShape = "rectangular" | "oval" | "round" | "freeform" | "kidney";
export type CleanedZone = "bottom" | "walls" | "waterline" | "surface";

/**
 * Une valeur factuelle et sa provenance. `null` = non communiqué par la source
 * officielle. Ne jamais estimer, ne jamais interpoler depuis un modèle voisin,
 * ne jamais reprendre un agrégateur quand la source officielle existe.
 */
export type Sourced<T> = {
  value: T | null;
  sourceUrl: string | null;
  /** Date du relevé, ISO 8601. */
  sourcedAt: string;
};

export type MerchantOffer = {
  /** Doit exister dans data/merchants.ts et être actif pour le marché. */
  merchantId: "amazon-be" | "amazon-fr" | "bol" | "coolblue" | "hubo" | "brico" | "gamma" | "hornbach";
  /** ASIN pour Amazon, référence marchand sinon. Alimente /go/[merchant]/[ref]. */
  ref: string;
  url: string;
  price: number | null;
  currency: "EUR";
  /** Date du relevé de prix, ISO. Affichée à côté du prix. check:prices
   *  échoue au-delà de 90 jours sur une fiche active. */
  priceCheckedAt: string;
  availability: "in-stock" | "out-of-stock" | "preorder" | "unavailable";
  /** Délai indicatif en jours ouvrables, null si non communiqué. */
  deliveryDays: number | null;
};

export type Specs = {
  maxAreaM2: Sourced<number>;
  maxPoolLengthM: Sourced<number>;
  maxDepthM: Sourced<number>;
  cleanedZones: Sourced<CleanedZone[]>;
  /** Minutes. Pertinent uniquement si type = electric-battery. */
  batteryLifeMin: Sourced<number>;
  chargeTimeMin: Sourced<number>;
  cycleDurationsMin: Sourced<number[]>;
  cableLengthM: Sourced<number>;
  swivelCable: Sourced<boolean>;
  filtrationFlowLph: Sourced<number>;
  /** Microns. Le chiffre le plus discriminant au printemps belge (pollen). */
  filtrationFinenessMicrons: Sourced<number>;
  filterCapacityL: Sourced<number>;
  filterType: Sourced<"basket" | "bag" | "cartridge" | "multi-basket">;
  brushType: Sourced<"pvc" | "foam" | "mixed" | "studded">;
  weightKg: Sourced<number>;
  powerW: Sourced<number>;
  control: Sourced<Array<"app" | "remote" | "scheduling" | "mapping" | "none">>;
  autoWaterExit: Sourced<boolean>;
  caddyIncluded: Sourced<boolean>;
  warrantyMonths: Sourced<number>;
};

export type Compatibility = {
  surfaces: Sourced<PoolSurface[]>;
  shapes: Sourced<PoolShape[]>;
  aboveGround: Sourced<boolean>;
  inGround: Sourced<boolean>;
  flatBottom: Sourced<boolean>;
  compoundSlope: Sourced<boolean>;
  /** Le critère d'achat le plus discriminant, et le plus mal traité par les
   *  revendeurs. Non documenté par le constructeur = null, et la page le dit. */
  stairs: Sourced<boolean>;
};

/**
 * Notation éditoriale documentée. Pondérations publiées sur /methodologie.
 * Jamais une moyenne d'avis marchands recopiée. Échelle 0-10, une décimale.
 */
export type Scores = {
  bottomCleaning: number;
  wallCleaning: number;
  waterline: number;
  filtration: number;
  easeOfUse: number;
  reliability: number;
  serviceBelgium: number;
  valueForMoney: number;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  range: string | null;
  year: number | null;
  type: RobotType;

  specs: Specs;
  compatibility: Compatibility;

  /**
   * Calculée par computeOverallRating() depuis scores. Jamais saisie à la main.
   *
   * `null` est une valeur légitime et signifie « pas encore évalué ». Dans ce
   * cas la fiche n'affiche AUCUN bloc de note et le JSON-LD ne porte NI
   * aggregateRating NI review. Aucune valeur par défaut, jamais — le réseau
   * aspirateurs écrit `ratingValue: product.rating || 4`, ce qui invente une
   * note quand la donnée manque.
   */
  overallRating: number | null;
  scores: Scores | null;

  /** Si false, la fiche affiche l'encart de transparence, obligatoirement. */
  testedInPerson: boolean;
  testedAt: string | null;

  pros: string[];
  cons: string[];
  /** Au moins un inconvénient réel. Une fiche sans point faible est une fiche
   *  que personne ne croit. */
  verdictShort: string;
  bestFor: string;
  notFor: string;

  merchants: MerchantOffer[];

  /** Slugs des pages où le modèle apparaît — alimente le maillage réciproque. */
  categories: string[];

  /**
   * Clé image LOCALE-AGNOSTIQUE, jamais le slug d'URL localisé : un repo qui
   * sert trois marchés porte le visuel une seule fois. Les trois variantes
   * webp vivent dans public/images/products/<imageKey>-{400,800,1200}.webp.
   */
  imageKey: string;
  gallery: string[];

  /** Libellés commerciaux par marché. Ne porte JAMAIS de contenu éditorial :
   *  une page NL naît de son propre cluster, elle n'est pas une traduction. */
  i18n: {
    "nl-BE"?: { name?: string; range?: string };
    "fr-FR"?: { name?: string; range?: string };
  };

  updatedAt: string;
  isActive: boolean;
};

/**
 * Pondérations de la note globale. Publiées sur /methodologie. Modifier cette
 * constante = recalculer toutes les notes = mettre à jour la page méthodologie
 * dans la même PR.
 */
export const RATING_WEIGHTS: Record<keyof Scores, number> = {
  bottomCleaning: 0.22,
  wallCleaning: 0.15,
  waterline: 0.08,
  filtration: 0.15,
  easeOfUse: 0.12,
  reliability: 0.14,
  serviceBelgium: 0.06,
  valueForMoney: 0.08,
};

/** Retourne null si les scores ne sont pas renseignés. Ne jamais substituer
 *  une valeur par défaut : une note absente est une information. */
export function computeOverallRating(scores: Scores | null): number | null {
  if (!scores) return null;
  const total = (Object.keys(RATING_WEIGHTS) as Array<keyof Scores>).reduce(
    (acc, k) => acc + scores[k] * RATING_WEIGHTS[k],
    0,
  );
  return Math.round(total * 10) / 10;
}
