# Gabarits de page par typologie

Sept gabarits couvrent les 164 URLs. Ils sont construits une fois, en
composants, et les pages ne sont plus qu'un jeu de données.

La séquence de blocs est reprise de `meilleurs-aspirateurs-robots-next`, dont
le modèle de conversion est mesuré en production. Le code de ces composants
n'est pas repris — voir `docs/HERITAGE-ASPIRATEURS.md` §A.4. Les règles de structure éditoriale
(H2 en question, pattern réponse-explication-exemple, citabilité) viennent de
`docs/SEO-GEO-REDACTION.md`. Les deux se superposent : le gabarit dit où
placer les blocs, la doctrine dit ce qu'on écrit dedans.

Convention de lecture : `[C]` = composant, `[MDX]` = prose rédigée,
`[JSON]` = généré depuis `data/products/`. Toute image passe par `lib/images.ts`.

---

## 1. Home — comparatif maître

L'URL la plus forte du domaine, et la page money. Treize blocs, dans cet
ordre.

| # | Bloc | Nature | Rôle |
|---|---|---|---|
| 1 | `Hero` | [C] + [MDX] | H1, chapô 40-60 mots répondant directement, CTA vers le top 3 |
| 2 | `TrustStrip` | [C] | 4 piliers : indépendance, relevés datés, ancrage belge, méthode publiée |
| 3 | `Top3` | [C] [JSON] | Podium + tableau de specs comparées, un CTA par colonne |
| 4 | `Top10` | [C] [JSON] | Cartes éditoriales en ligne, une phrase de verdict par modèle |
| 5 | `SelectorQuiz` | [C] | Entrée vers `/outil/selecteur-robot-piscine/`, section sombre |
| 6 | `Criteria` | [C] + [MDX] | 6 critères d'achat, chacun renvoyant vers un comparatif segmenté |
| 7 | `Methodology` | [MDX] | Ce qui est testé, ce qui ne l'est pas, citation de l'auteur |
| 8 | `Categories` | [C] | 3 colonnes : par bassin / par technologie / par budget |
| 9 | `Brands` | [C] | Grille 5 colonnes vers les 14 pages marque |
| 10 | `Duels` | [C] | Duels tête-à-tête les plus recherchés |
| 11 | `Articles` | [C] | Derniers guides et mises à jour |
| 12 | `FilterableTable` | [C] [JSON] | Tableau filtrable de tous les modèles — le bloc qui retient |
| 13 | `FAQ` | [C] [MDX] | Accordéon, 8 questions minimum |

Sticky : `CompareBar` en bas d'écran dès qu'un modèle est coché (max 3).

**Détail de conversion à ne pas redécouvrir** : dans une carte produit à lien
étiré, le CTA affilié doit passer au-dessus du lien de carte. Sans ça, le clic
sur le bouton marchand navigue vers la fiche interne et le clic monétisé est
perdu. C'est un piège coûteux et invisible en test manuel rapide.

JSON-LD : `WebSite` + `Organization` + `ItemList` (top 10) + `FAQPage` +
`BreadcrumbList`.

Longueur rédigée : 1 500-2 500 mots hors composants.

---

## 2. Comparatif segmenté

`/comparatif/[segment]/` — 22 pages. Le gabarit le plus rentable du site.

```
Breadcrumb
H1                          — segment + différenciateur, ≤ 60 car., {YEAR} dynamique
Chapô                       — réponse directe en 40-60 mots [MDX]
TL;DR                       — 3-5 bullets, depuis le frontmatter
Encart « pour qui »         — à qui ce segment s'adresse, à qui il ne s'adresse pas [MDX]
FilterableProductGrid       — [C] [JSON] filtres du segment uniquement
ComparisonTable             — [C] [JSON] max 6 colonnes, en-têtes 1-3 mots
H2 (question) × 4 à 6       — pattern réponse < 60 mots → explication → exemple [MDX]
  H3 FAQ in-flow            — 1-2 par H2 majeur
Verdict par profil          — [MDX] « lequel pour qui », jamais de gagnant absolu
Comparatifs frères          — [C] segments adjacents
FAQ                         — [C] 6 minimum
AuthorByline + UpdatedDate  — [C]
AffiliateDisclosure         — [C] texte variable par page
```

JSON-LD : `ItemList` des produits + `ItemList` pros/cons + `FAQPage` +
`BreadcrumbList`.

Longueur : 1 500-2 500 mots. Densité affiliée haute — un CTA par ligne de
tableau, un CTA par carte produit.

**Le bloc `ItemList` pros/cons est un avantage structurel** : Google réserve
ce rich result aux pages de test éditoriales et l'interdit aux pages produit
marchandes. Les revendeurs qui occupent la SERP ne peuvent pas l'utiliser.
À implémenter sur chaque comparatif et chaque fiche.

---

## 3. Fiche modèle

`/avis/[marque]-[modele]/` — 58 pages.

```
Breadcrumb
ProductHero                 — [C] [JSON] image, note maison, badge, prix relevé, CTA
TableOfContents             — [C] généré depuis les H2
QuickSpecs                  — [C] [JSON] 6 specs clés en bandeau
TL;DR                       — 3-5 bullets
H2 — Verdict                — [MDX] nuancé, « pour qui / pas pour qui »
H2 — Points forts et faibles — [C] [JSON] pros/cons, 3 minimum de chaque
H2 (question) × 3 à 5       — analyse détaillée [MDX]
DetailedSpecs               — [C] [JSON] tableau complet
BoxContents                 — [C] [JSON] contenu de la boîte
PriceTable                  — [C] [JSON] multi-marchand, date de relevé affichée
TransparencyBox             — [C] si testedInPerson=false, encart obligatoire
SimilarProducts             — [C] [JSON] 3 alternatives
InternalLinks               — [C] comparatifs qui la citent, duels, page marque, pièces
FAQ                         — [C] 6 minimum
AuthorByline + UpdatedDate
AffiliateDisclosure
StickyAffiliateBar          — [C] mobile
```

JSON-LD : `Product` + `Brand` + `Offer` + `additionalProperty` (les specs) +
`ItemList` pros/cons + `BreadcrumbList` + `FAQPage`.

Trois conditions strictes :

- `aggregateRating` **uniquement si** `overallRating` n'est pas `null`. Aucune
  valeur par défaut. Aucun `reviewCount` inventé.
- `Review` **uniquement si** l'auteur est une `Person` nommée avec une page
  auteur renseignée. `author: Organization` est interdit.
- `Offer` porte le prix relevé et sa date. Pas d'`availability: InStock` écrit
  en dur, pas de `priceValidUntil` calculé arbitrairement : le site n'est pas
  le point de vente, c'est un Product snippet et non un Merchant listing.

`positiveNotes` / `negativeNotes` en `ItemList` sur chaque fiche : Google
réserve ce rich result aux pages de test éditoriales et l'interdit aux pages
produit marchandes. Les revendeurs qui occupent la SERP belge ne peuvent pas
l'utiliser.

Longueur : 1 200-2 000 mots.

**Règle absolue** : la note balisée est celle qui est visible sur la page. Si
`testedInPerson` vaut `false`, l'encart de transparence apparaît et le dit :
évaluation sur specs constructeur, retours utilisateurs et comparaison de
gamme, sans test physique. Le dire coûte moins cher que de se faire prendre.

Si `overallRating` vaut `null`, la fiche n'affiche aucun bloc de note et le
JSON-LD n'en porte aucune. Une note absente est une information, pas un trou à
combler.

---

## 4. Duel

`/vs/[a]-vs-[b]/` — 16 pages. Intention transactionnelle maximale, cookie de
24 h parfaitement aligné.

```
Breadcrumb
H1                          — « A ou B : lequel choisir en {YEAR} ? »
Chapô                       — la réponse en une phrase, dès le chapô [MDX]
VersusHero                  — [C] [JSON] deux colonnes, images, notes, prix, 2 CTA
DifferencesTable            — [C] [JSON] uniquement les lignes où ils diffèrent
H2 (question) × 4 à 5       — un critère par H2 : nettoyage, filtration, autonomie,
                              facilité, prix [MDX]
Verdict par profil          — [MDX] « A si…, B si… ». Jamais de match nul.
Alternatives                — [C] un troisième modèle si aucun des deux ne convient
InternalLinks               — les 2 fiches, le comparatif parent, le duel de techno
FAQ                         — [C] 6 minimum
AuthorByline
```

JSON-LD : `ItemList` (2 produits) + `FAQPage` + `BreadcrumbList`.

Longueur : 1 200-1 800 mots. Densité affiliée haute.

**Piège du format** : ne jamais écrire un duel entre deux produits qu'on ne
distingue pas réellement. Si les différences tiennent en deux lignes, c'est
une section dans le comparatif parent, pas une page.

---

## 5. Page marque

`/marque/[marque]/` — 14 pages.

```
Breadcrumb
BrandHero                   — [C] logo, H1, positionnement en 2 phrases [MDX]
H2 — Pourquoi choisir X ?   — [MDX] 3 cartes : forces, limites, à qui ça s'adresse
H2 — Disponibilité et SAV en Belgique   ← LE différenciateur
                              [MDX] réseau, pièces, délais, garantie légale
FilterableProductGrid       — [C] [JSON] tous les modèles de la marque
GammeTable                  — [C] [JSON] entrée / milieu / haut de gamme
H2 (question) × 2 à 3       — [MDX]
Duels impliquant la marque  — [C]
FAQ                         — [C] 6 minimum
AuthorByline
```

JSON-LD : `ItemList` + `FAQPage` + `BreadcrumbList` + `Organization` (marque).

Longueur : 1 200-1 800 mots. Densité affiliée moyenne.

---

## 6. Guide

`/guide/[slug]/` — 20 pages. Autorité, maillage, citation par les moteurs
génératifs.

```
Hero image                  — [C]
Breadcrumb
H1 + AuthorByline + dates
Chapô                       — réponse directe [MDX]
TL;DR                       — 3-5 bullets
TableOfContents             — [C]
H2 (question) × 5 à 8       — réponse < 60 mots → explication → exemple belge [MDX]
  H3 FAQ in-flow
Encart Key Takeaways        — après le H2 central
RelatedArticles             — [C]
InternalLinks               — comparatif correspondant + 2-3 problèmes liés
FAQ                         — [C] 6 minimum
AuthorCard                  — [C]
```

JSON-LD : `Article` avec auteur nommé + `FAQPage` + `BreadcrumbList`.

Longueur : 1 200-1 800 mots. Densité affiliée **basse** — un guide qui envoie
sur Amazon deux semaines avant l'achat brûle le clic.

---

## 7. Problème / dépannage

`/probleme/[symptome]/` — 14 pages.

```
Breadcrumb
H1                          — le symptôme tel que l'utilisateur le tape
Réponse immédiate           — [MDX] la cause la plus fréquente, en 2 phrases, avant tout
DiagnosticSteps             — [C] liste numérotée, du plus simple au plus complexe
H2 — Pourquoi ça arrive ?   — [MDX]
H2 — Comment corriger ?     — [MDX] par cause
H2 — Quand c'est irréparable — [MDX] honnêteté sur le coût de réparation vs remplacement
PiecesLiees                 — [C] lien vers `/pieces/` concerné, seul lien monétisé autorisé
ModelesConcernes            — [C] si le symptôme est spécifique à des modèles
FAQ                         — [C] 4 minimum
```

JSON-LD : `HowTo` **uniquement si les étapes sont réelles et vérifiables**,
sinon `Article`. `FAQPage` + `BreadcrumbList`.

Longueur : 800-1 400 mots. **Densité affiliée nulle** sauf la pièce
directement pertinente.

Pour les pages codes erreur : tableau normé code / signification / résolution,
une ligne par code, pas de cellules fusionnées.

---

## 8. Outil

`/outil/[slug]/` — 5 pages.

```
Breadcrumb
H1 + une phrase de promesse
Outil                       — [C] au-dessus de la ligne de flottaison, sans inscription
HypothesesBox               — [C] les hypothèses de calcul, affichées sous le résultat
ResultatsProduits           — [C] [JSON] modèles compatibles — le seul emplacement affilié
H2 (question) × 3 à 4       — le contenu SEO sous l'outil [MDX]
LienMethodologie            — [C]
FAQ                         — [C] 4 minimum
```

JSON-LD : `WebApplication` + `FAQPage` + `BreadcrumbList`.

Longueur du contenu sous l'outil : 600-1 200 mots.

---

## 9. Ce qui est présent sur toutes les pages sans exception

- `metadata` complète, canonical auto-référencée
- `BreadcrumbList`
- `AuthorByline` avec lien vers la page auteur
- `UpdatedDate` visible, `dateModified` à jour
- `AffiliateDisclosure` visible sur toute page portant un lien monétisé,
  **rédigée à la main et variable selon la page**
- `SourcesVerifiees` — les sources et leurs dates de relevé
- Aucun chiffre en prose
- Au moins un fait négatif assumé

---

## 10. Maillage entre gabarits

Règles de réciprocité, déclarées dans `data/internal-links.ts` et vérifiées
au build. **Maximum 6 liens internes contextuels par page** — au-delà, le
PageRank se dilue et la lecture souffre.

| Depuis | Vers |
|---|---|
| Home | Tous les hubs, 8 comparatifs prioritaires, 6 fiches du top |
| Comparatif segmenté | Fiches citées, comparatifs frères, guide correspondant, sélecteur |
| Fiche modèle | Comparatifs qui la citent, duels la concernant, page marque, 3 alternatives, pièces du modèle, problèmes spécifiques |
| Duel | Les 2 fiches, le comparatif parent, le duel de technologie associé |
| Page marque | Ses modèles, ses duels, sa page pièces, guide SAV Belgique |
| Guide | Comparatif correspondant, 2-3 problèmes liés |
| Problème | Guide parent, pièce concernée, page marque si code erreur |
| Pièces | Modèles compatibles, problème correspondant |
| Outil | Comparatifs et fiches en sortie de résultat |
| Hub désambiguïsation | Les trois familles, puis le silo robots |

**Interdits explicites** :
- Une page `probleme` ne pointe jamais vers un comparatif — l'intent ne le
  supporte pas.
- Aucun lien contextuel croisé entre versions linguistiques. Le seul pont
  entre `be-fr` et `be-nl` est le sélecteur de langue et le hreflang.

---

## 11. Registre des pages

Chaque page commerciale a une entrée dans `data/page-registry.ts`, créée
**avant** le MDX. Elle porte le cluster, le volume mesuré, l'intention, la
densité affiliée qui en découle, les produits cités et les liens sortants
typés.

Ce que le registre ne porte jamais : le titre, le H1, l'intro, les FAQ, aucun
texte rédigé. Ils vivent dans le frontmatter et le corps du MDX. Un titre SEO
stocké hors du gabarit court-circuite les helpers, et de la prose dans un
fichier TypeScript échappe à toute review — c'est la double dette des
registries du réseau aspirateurs, où trois fichiers portent 6 000 lignes de
contenu français.

Le type de chaque lien sortant est déclaré, pas seulement son URL :

```ts
links: [
  { type: "comparison", slug: "robot-piscine-hors-sol" },
  { type: "guide", slug: "robot-sans-fil-ou-filaire" },
]
```

C'est ce qui permet à `check:maillage` de vérifier des règles de silo — « une
page `problem` ne pointe jamais vers une `comparison` » — au lieu de vérifier
seulement que l'URL résout.

## 12. Images

Aucun composant ne construit un chemin d'image. Tout passe par `lib/images.ts`.

```tsx
<img {...productImageProps(product.imageKey, `${product.brand} ${product.name}`)} />
<img {...productImageProps(product.imageKey, alt, { lcp: true })} />  // visuel principal
```

Trois variantes webp générées à l'ingestion par `npm run build:images`, jamais
à la requête : l'Image Optimization de Vercel est facturée sur un compteur
séparé du TB inclus.

La clé image est **locale-agnostique** — jamais le slug d'URL localisé. Un repo
qui sert trois marchés porte le visuel une seule fois.

`check:images` échoue si une variante manque ou dépasse son seuil de poids
(25 / 60 / 120 KB). On répare la donnée, on ne la rattrape pas au rendu par une
cascade de fallbacks.