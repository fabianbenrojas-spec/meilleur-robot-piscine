import type { ContentType } from "@/config/routes.config";

/**
 * Un segment d'URL par ContentType, pour un marché donné. Record et non
 * Partial : un ContentType oublié dans une table de marché est une erreur de
 * compilation, jamais un segment vide silencieux.
 */
export type SiloSegments = Record<ContentType, string>;
