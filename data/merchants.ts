/**
 * Registre des marchands. Toute ligne du PriceTable et tout lien /go/ passe
 * par ici. Un marchand sans programme d'affiliation reste utile au lecteur :
 * son lien est alors direct, en rel="nofollow" simple, sans passer par /go/ —
 * jamais de faux lien monétisé.
 *
 * Noms de champs en anglais (CLAUDE.md §7).
 */
export type Merchant = {
  id: string;
  name: string;
  /** false = lien direct nofollow, pas de /go/, pas de sub-ID. */
  affiliate: boolean;
  /** Réseau ou programme. Renseigné uniquement si affiliate = true. */
  program: string | null;
  /** Fenêtre de conversion en heures. Contraint le placement des liens. */
  cookieHours: number | null;
  /** Marchés où ce marchand est actif. */
  markets: Array<"be-fr" | "be-nl" | "fr-fr">;
  logo: string;
};

export const MERCHANTS: Merchant[] = [
  {
    id: "amazon-be",
    name: "Amazon.com.be",
    affiliate: true,
    program: "Amazon Partenaires",
    cookieHours: 24,
    markets: ["be-fr", "be-nl"],
    logo: "/logos/amazon.svg",
  },
  {
    id: "amazon-fr",
    name: "Amazon.fr",
    affiliate: true,
    program: "Amazon Partenaires",
    cookieHours: 24,
    markets: ["fr-fr"],
    logo: "/logos/amazon.svg",
  },
  // TODO — vérifier l'ouverture du programme avant de passer affiliate à true.
  { id: "bol", name: "bol.com", affiliate: false, program: null, cookieHours: null, markets: ["be-fr", "be-nl"], logo: "/logos/bol.svg" },
  { id: "coolblue", name: "Coolblue", affiliate: false, program: null, cookieHours: null, markets: ["be-fr", "be-nl"], logo: "/logos/coolblue.svg" },
  { id: "hubo", name: "Hubo", affiliate: false, program: null, cookieHours: null, markets: ["be-fr", "be-nl"], logo: "/logos/hubo.svg" },
  { id: "brico", name: "Brico", affiliate: false, program: null, cookieHours: null, markets: ["be-fr", "be-nl"], logo: "/logos/brico.svg" },
  { id: "gamma", name: "Gamma", affiliate: false, program: null, cookieHours: null, markets: ["be-nl"], logo: "/logos/gamma.svg" },
  { id: "hornbach", name: "Hornbach", affiliate: false, program: null, cookieHours: null, markets: ["be-fr", "be-nl"], logo: "/logos/hornbach.svg" },
];
