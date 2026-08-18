import type { SiloSegments } from "./types";

/** Segments traduits, jamais répliqués : un /nl/comparatif/ est un signal de
 *  traduction paresseuse, pour l'utilisateur comme pour Google. */
export const beNlSegments: SiloSegments = {
  comparison: "vergelijking",
  review: "review",
  versus: "vs",
  brand: "merk",
  guide: "gids",
  problem: "probleem",
  parts: "onderdelen",
  tool: "tool",
};
