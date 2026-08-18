import { MERCHANTS } from "@/data/merchants";
import { siteConfig } from "@/config/site.config";

/**
 * Construction des URLs monétisées. Toute sortie affiliée passe par ici —
 * jamais de ?tag= écrit à la main dans un composant ou un MDX.
 */

export type ResolvedLink = {
  url: string;
  /** true = /go/ + rel sponsored. false = lien direct nofollow. */
  monetised: boolean;
};

/** Attributs obligatoires sur tout lien sortant monétisé. */
export const AFFILIATE_REL = "sponsored nofollow noopener" as const;

/**
 * Attache le tracking ID Amazon et le sub-ID de la page de départ.
 *
 * Idempotent : un tag déjà présent est écrasé, jamais empilé — deux
 * attributions sur un clic, c'est un clic perdu.
 */
function withAmazonTag(rawUrl: string, subId: string): string {
  const tag = siteConfig.affiliateTags.amazon;
  if (!tag) {
    throw new Error(
      `affiliateTags.amazon est vide pour le marché ${siteConfig.marketId}. ` +
        `Aucun lien Amazon ne doit être généré sans tracking ID : le lien ` +
        `fonctionnerait et la commission serait perdue silencieusement.`,
    );
  }
  const url = new URL(rawUrl);
  url.searchParams.set("tag", tag);
  // ascsubtag identifie la page de départ : c'est ce qui permet de mesurer le
  // taux de clic sortant par gabarit (DOCTRINE-RESEAU §2).
  url.searchParams.set("ascsubtag", subId);
  for (const p of ["ref", "ref_", "pd_rd_i", "psc", "th", "linkCode"]) {
    url.searchParams.delete(p);
  }
  return url.toString();
}

/**
 * Résout la destination réelle d'un couple (marchand, référence).
 * Appelé côté serveur uniquement, depuis app/go/[merchant]/[ref]/route.ts.
 */
export function resolveMerchantUrl(
  merchantId: string,
  ref: string,
  storedUrl: string,
  subId: string,
): ResolvedLink {
  const merchant = MERCHANTS.find((m) => m.id === merchantId);
  if (!merchant) throw new Error(`Marchand inconnu : ${merchantId}`);

  // Un marchand sans programme reste utile au lecteur : lien direct, nofollow
  // simple, aucun faux paramètre d'affiliation.
  if (!merchant.affiliate) return { url: storedUrl, monetised: false };

  if (merchantId === "amazon-be" || merchantId === "amazon-fr") {
    // Le store est déterminé par le merchantId, jamais par l'URL relevée : un
    // tag émis pour amazon.com.be ne rémunère pas un lien amazon.fr.
    const domain = merchantId === "amazon-be" ? "amazon.com.be" : "amazon.fr";
    // URL canonique reconstruite depuis l'ASIN plutôt que l'URL relevée à la
    // main, qui traîne des paramètres de session.
    return { url: withAmazonTag(`https://www.${domain}/dp/${ref}/`, subId), monetised: true };
  }

  return { url: storedUrl, monetised: true };
}

/** Sub-ID identifiant la page de départ. Max 50 caractères côté Amazon. */
export function subIdFromPath(pathname: string): string {
  const clean = pathname.replace(/^\//, "").replace(/\//g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
  return (clean || "home").slice(0, 50);
}
