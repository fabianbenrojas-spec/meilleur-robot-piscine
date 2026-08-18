# DECISIONS.md

Journal des décisions d'architecture, des content gaps et des exceptions aux
seuils. Tenu à jour à chaque PR. Une décision non écrite est une décision
qu'on reprendra à zéro dans trois mois.

Format : date · décision · raison · conséquence.

---

## 2026-08-15 — Socle technique : core Next.js, pas SPA Supabase

**Décision.** Le repo part du modèle `vpn-affiliate-core` (Next.js 15 App
Router, SSG/ISR, MDX + JSON versionnés) et non du modèle
`meilleurs-aspirateurs-robots.fr` (Vite SPA + Supabase + snapshots SEO).

**Raison.** Trois points. Le rendu SEO natif supprime la pièce mobile la plus
critique (génération et service de snapshots). Le registre `config/markets`
gère nativement les trois marchés prévus, là où le modèle aspirateurs duplique
le repo par marché. Et toute la doctrine anti-régression (skills, preflight,
check-*, DECISIONS.md) est écrite pour ce socle.

**Conséquence.** On reprend du site aspirateurs la typologie de pages, la
découpe de la homepage en treize blocs, le simulateur et la matrice de
maillage — c'est ce qui convertit et c'est documenté dans
`docs/TEMPLATES-PAGES.md`. On ne reprend ni Supabase ni le panel admin. Un
back-office s'ajoutera sans migration si le catalogue dépasse ~300 produits.

---

## 2026-08-15 — Un domaine par marché, un seul repo

**Décision.** `meilleur-robot-piscine.be` sert `be-fr` uniquement. La version
flamande vivra sur un domaine `.be` néerlandophone à réserver, la version
française sur un `.fr`. Pas de `/nl/` sous le domaine français.

**Raison.** Le domaine est un EMD français : excellent pour la SERP
francophone, pénalisant en CTR sur la SERP flamande. Un utilisateur
néerlandophone clique moins sur une URL française, et ce coût se paie sur
chaque impression.

**Conséquence.** `config/markets/`, `config/routes/` et `locales/` sont
câblés dès le premier commit avec les trois marchés, même si un seul est
déployé. Aucune string de contenu ou d'URL en dur dans un composant. Le champ
`i18n` existe dans le schéma produit dès maintenant.

**En attente.** Réservation du domaine NL (`zwembadrobot.be`,
`beste-zwembadrobot.be` ou équivalent).

---

## 2026-08-15 — Le site couvre « aspirateur de piscine », pas seulement « robot »

**Décision.** Création d'un hub `/aspirateur-piscine/` avec trois pages
filles (`manuel-balai`, `batterie-portatif`, `hydraulique-surpression`), en
plus du silo robots.

**Raison.** Les exports Semrush du 14/08/2026 (base BE, 2 437 requêtes
≥ 10/mois) donnent `aspirateur piscine` à 1 300 recherches/mois contre 1 000
pour `robot piscine`. La famille « aspirateur » cumule 5 630/mois. Mais elle
mélange trois produits différents — robot électrique autonome, balai manuel
sur skimmer, aspirateur à batterie portatif — qui n'ont ni le même prix, ni
le même usage, ni le même acheteur.

**Content gap.** Aucun résultat de google.be sur `aspirateur piscine` ne
clarifie cette ambiguïté. Les revendeurs vendent les trois sans les
distinguer ; les éditoriaux français traitent le robot seul. Différenciateur
retenu : une page qui sépare proprement les trois familles, répond à la
question réellement posée (« quel appareil pour nettoyer ma piscine »), et
route vers celle qui correspond au bassin du lecteur.

**Conséquence assumée.** `/aspirateur-piscine/manuel-balai/` capte ~2 010
recherches/mois à panier de 20-80 €, qui ne financent rien. C'est un
cul-de-sac de monétisation assumé, gardé pour l'autorité de catégorie. Zéro
lien affilié dessus, et il ne reçoit pas de jus depuis les pages money.

---

## 2026-08-15 — Amazon en socle, pas en thèse économique

**Décision.** Le `PriceTable` est multi-marchand par construction dès la
première fiche, même avec une seule ligne Amazon remplie.

**Raison.** La commission Amazon Maison/Jardin est faible et la fenêtre de
conversion est de 24 h. Sur cette niche, les programmes marque (Maytronics,
Aiper, Beatbot, Wybot) paient nettement mieux. Par ailleurs, une partie du
catalogue le plus recherché en Belgique — Zodiac, haut de gamme Dolphin — se
vend en réseau pisciniste et n'est pas ou mal représentée sur Amazon.com.be.

**Conséquence.** Une fiche modèle sans ligne Amazon reste une fiche valide.
Elle dit honnêtement où le modèle s'achète en Belgique. Candidature aux
programmes marque dès 20 pages indexées.

---

## 2026-08-15 — Priorité de catalogue fixée par la demande belge, pas par la commission

**Décision.** Les 62 modèles de `data/catalogue-a-remplir.csv` sont ordonnés
par volume de recherche BE, pas par panier ni par taux de commission.

**Raison.** Intex pèse 2 610 recherches/mois sur la base BE, deuxième marque
derrière Zodiac, sur des produits à 50-150 € qui ne rapportent presque rien.
Les ignorer coûterait l'autorité de catégorie sur la moitié des requêtes de
la niche.

**Conséquence.** On couvre Intex et Bestway pour l'autorité, on monétise sur
Dolphin, Aiper, Wybot et Beatbot. Le déséquilibre entre trafic et revenu par
page est attendu et ne doit pas déclencher de correction hâtive du plan
éditorial.

---

## 2026-08-17 — Alignement sur DOCTRINE-RESEAU v3

**Décision.** `docs/DOCTRINE-RESEAU.md` entre dans le repo et fait autorité sur
l'architecture. `CLAUDE.md` en est l'application à cette verticale. Le repo
`meilleurs-aspirateurs-robots-next` est une référence partielle, jamais une
autorité — le tri est figé dans `docs/HERITAGE-ASPIRATEURS.md`.

**Changements appliqués.**

| Point | Avant | Après |
|---|---|---|
| Rendu | SSG + ISR 86400 | 100 % SSG, `preflight` bloque tout `revalidate` |
| Images | `next/image` + AVIF | 3 variantes webp à l'ingestion, `images.unoptimized` |
| Noms de champs | français (`noteGlobale`, `avantages`…) | anglais (`overallRating`, `pros`…) |
| Clés de route | `comparatif`, `avis`… | `comparison`, `review`… ; seule la valeur est localisée |
| hreflang | impossible (marché figé au module) | `routeFor()`, `absoluteUrlFor()` |
| `/go/` | pas de sub-ID, `findOffer` fantôme | `ascsubtag`, validation de référence réelle |
| `rel` | `sponsored nofollow` | `sponsored nofollow noopener` |
| Scripts | 3 déclarés, 0 existants | tous écrits, `preflight` échoue sur un script fantôme |
| CI | relançait `next build` | ne build plus : Vercel le fait sur la même PR |
| Coût | non traité | `CLAUDE.md` §11, Ignored Build Step, `vercel.json` |

**Raison du renommage en anglais.** C'est la faute exacte que décrit la
doctrine §1 et que le scaffold reproduisait. Un champ nommé en français
appelle sa traduction au moment d'écrire le contenu néerlandais — c'est ainsi
qu'est né `verdict_kort`, et que 41 blocs de verdict sont devenus invisibles.
Corrigé à coût nul, rien n'étant versionné.

---

## 2026-08-17 — Le tracking ID reste versionné, contre §7 de la doctrine

**Décision.** `meilleur-robot-piscine06-21` vit dans
`config/markets/be-fr.ts`, versionné. Pas en variable d'environnement.

**Raison.** Un tracking ID Amazon n'est pas un secret : il est public dans
chaque URL sortante de chaque page. Il n'a rien à révoquer et rien à protéger.
Le traiter comme un secret crée en revanche un mode de panne réel — une
variable oubliée à la création d'un projet Vercel produit soit un échec de
build, soit des liens sans attribution. Et une valeur qui ne vit que dans un
dashboard n'est ni diffable, ni relue en PR, ni retrouvable dans l'historique.

`lib/affiliate.ts` lève une exception si le tag est vide, et `preflight`
échoue. Le grep pré-commit reste inchangé : il cible `eyJ|sb_secret|
service_role`, jamais un tag public.

**Amendement proposé à la doctrine §7** : distinguer *secret* (clé d'API,
service role) de *identifiant public de configuration* (tracking ID, domaine,
TVA). Les premiers en variables d'environnement, les seconds versionnés.

---

## 2026-08-17 — hreflang : segment par config, page par déclaration

**Décision.** Trois règles au lieu de celle de la doctrine §5.

1. La correspondance de **segment** vient de `config/routes/`.
2. La correspondance de **page** se déclare dans `data/page-registry.ts`
   (`alternates`), page par page.
3. **Pas de contrepartie = pas de déclaration.** Jamais de repli vers la home
   ni vers un parent.

**Raison.** `config/routes/` traduit `comparison` → `vergelijking`. Il ne peut
rien dire de `robot-piscine-sans-fil`, et il ne doit pas : la page NL naîtra de
son propre cluster. Surtout, sous un modèle d'adaptation, la majorité des pages
n'aura aucune contrepartie. Le `crossSiteMapper.ts` du réseau aspirateurs
répond `/` dans ce cas — il déclare la home comme alternative d'une page
catégorie, ce qui est pire que ne rien déclarer.

`check:hreflang` vérifie la réciprocité des paires déclarées, pas leur
exhaustivité.

---

## 2026-08-17 — Redéploiement mensuel programmé

**Décision.** Un Deploy Hook mensuel par déploiement.

**Raison.** En 100 % SSG, les marqueurs `{{MONTH_YEAR}}` sont résolus au build.
Sans redéploiement, un site non touché pendant quatre mois sert des titles
annonçant un mois périmé — ce qui abîme précisément le signal de fraîcheur
qu'ils produisent. Douze builds par an et par déploiement, négligeable sur le
budget de minutes, et cela ferme la question de l'ISR au lieu de la laisser
ouverte.

**Amendement proposé à la doctrine §3** : ajouter cette contrepartie à
l'interdiction d'ISR, faute de quoi le lecteur en déduira qu'il lui faut de
l'ISR.

---

## Modèle d'entrée pour les prochaines décisions


```
## AAAA-MM-JJ — [titre en une ligne]

**Décision.**

**Raison.**

**Content gap.** (pour toute création de page — SERP google.be analysée,
3 premiers résultats, angle que personne ne couvre)

**Conséquence.**

**En attente.** (le cas échéant)
```
