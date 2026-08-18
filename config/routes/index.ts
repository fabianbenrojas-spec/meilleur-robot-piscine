import type { MarketId } from "@/config/markets";
import type { SiloSegments } from "./types";
import { beFrSegments } from "./be-fr";
import { beNlSegments } from "./be-nl";
import { frFrSegments } from "./fr-fr";

export const SILO_SEGMENTS: Record<MarketId, SiloSegments> = {
  "be-fr": beFrSegments,
  "be-nl": beNlSegments,
  "fr-fr": frFrSegments,
};

export type { SiloSegments };
