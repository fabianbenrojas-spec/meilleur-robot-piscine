import { redirect } from "next/navigation";
import { resolveMerchantUrl, subIdFromPath } from "@/lib/affiliate";
import { findOffer } from "@/lib/products";

/**
 * Sortie monétisée unique du site, et SEULE route dynamique du socle
 * (DOCTRINE-RESEAU §3.4). Son volume est celui des clics affiliés, donc
 * négligeable sur le compteur d'invocations.
 *
 * Toujours une redirection temporaire : la destination change quand le prix
 * ou le marchand change.
 *
 * noindex + Disallow /go/ dans app/robots.ts.
 */
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ merchant: string; ref: string }> },
) {
  const { merchant, ref } = await params;

  // Une référence absente des fiches actives n'est pas servie. Sans cette
  // validation, /go/ est un redirecteur ouvert que n'importe qui peut utiliser
  // pour blanchir un lien derrière notre domaine.
  const offer = findOffer(merchant, ref);
  if (!offer) redirect("/");

  // La page de départ est passée en ?from= par le composant de CTA.
  const from = new URL(req.url).searchParams.get("from") ?? "/";
  const { url } = resolveMerchantUrl(merchant, ref, offer.url, subIdFromPath(from));

  redirect(url);
}
