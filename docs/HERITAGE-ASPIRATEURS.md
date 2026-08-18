# Héritage du réseau aspirateurs — ce qu'on reprend, ce qu'on écarte

`meilleurs-aspirateurs-robots-next` est une **référence partielle**, pas un
modèle. Il porte des correctifs récents et des dettes non traitées, sans qu'on
puisse distinguer les deux à la lecture. `docs/DOCTRINE-RESEAU.md` fait
autorité, le repo non.

Ce document fige la ligne de partage pour qu'elle ne soit pas rejouée à chaque
session.

---

## A. Repris

### A.1 La typologie de pages et le maillage entre silos

**Repris tel quel.** Catégorie → produit → marque → guide → comparatif, avec
réciprocité déclarée. C'est le modèle qui convertit sur le site en production,
et il n'a aucune dépendance à l'architecture technique.

Adapté à notre arborescence : `comparison`, `review`, `versus`, `brand`,
`guide`, `problem`, `parts`, `tool`, plus le hub de désambiguïsation
`/aspirateur-piscine/` propre à cette niche.

→ `docs/TEMPLATES-PAGES.md` §10, `data/internal-links.json`

### A.2 Le modèle de registry

**Repris, refondu.** `categoryRegistry` / `marqueRegistry` / `guideRegistry`
partagent une idée juste : une entrée par page commerciale, portant sa
structure et ses liens sortants. C'est ce qui rend le maillage vérifiable par
script plutôt que déclaratif dans du JSX.

Deux différences délibérées dans `data/page-registry.ts` :

**Le registre ne porte aucun contenu rédigé.** Chez les aspirateurs il porte
`h1`, `intro`, `faqs`, `seoText`, `buyingCriteria`, `whyChoose` — soit près de
6 000 lignes de prose française dans trois fichiers TypeScript. Cette prose est
invisible en review, impossible à relire en diff, et échappe à tout contrôle
rédactionnel. Ici elle vit en MDX ; le registre ne porte que la structure.

**Le registre ne porte ni `metaTitle` ni `h1`.** Un titre SEO stocké hors du
gabarit court-circuite les helpers de code — c'est la dette « titres SEO en
base » du repo source, où trois mécanismes concurrents produisent des titres.
Ici ils vivent dans le frontmatter MDX, et `check:seo` les valide.

Ce qu'on ajoute et que l'original n'a pas : le **type** de chaque lien sortant.
`{ type: "comparison", slug: "…" }` plutôt qu'une URL nue. C'est ce qui permet
à `check:maillage` de vérifier des règles comme « une page `problem` ne pointe
jamais vers une `comparison` ».

→ `data/page-registry.ts`

### A.3 Le stack JSON-LD d'une fiche produit

**Repris, amputé de deux blocs.** `Product` + `Brand` + `Offer` +
`BreadcrumbList` + `FAQPage` + `additionalProperty` pour les specs. Le
`additionalProperty` en particulier est un bon réflexe que peu de sites
affiliés ont : il donne aux specs une structure lisible par machine sans
inventer de vocabulaire.

Ce qu'on retire : `aggregateRating` et `review` tant que la donnée réelle
n'existe pas (§B.4 et §B.5).

Ce qu'on garde absolument : `positiveNotes` / `negativeNotes` en `ItemList`.
Google réserve ce rich result aux pages de test éditoriales et l'interdit aux
pages produit marchandes — c'est un avantage structurel face aux revendeurs qui
occupent la SERP belge.

→ `docs/TEMPLATES-PAGES.md` §3, `skills/piscine-maillage-jsonld`

### A.4 L'inventaire des composants de conversion et leur place

**Repris comme inventaire, réécrit comme code.** `ProductTOC`,
`Top3ComparisonTable`, `StickyAffiliateBar`, `ProductCard`, `AffiliateButtons`,
`TopRankingSection`, `HomeQuizSection` : la liste et surtout leur **position
dans la page** sont un acquis mesuré sur un site qui convertit.

Le code lui-même n'est pas repris : styles inline massifs, dépendances au
schéma Supabase, `zIndex` de contournement pour les stretched links.

Un détail à conserver, parce qu'il est contre-intuitif et qu'il coûte cher à
redécouvrir : dans une carte produit à lien étiré, le CTA affilié doit passer
**au-dessus** du lien de carte. Sans ça, le clic sur le bouton Amazon navigue
vers la fiche interne et le clic monétisé est perdu.

→ `docs/TEMPLATES-PAGES.md` §1 à §8

### A.5 La centralisation des chemins d'images

**Repris comme pattern, pas comme implémentation.** `src/lib/productImages.ts`
est le seul fichier du repo à avoir survécu à trois migrations de stockage
(Supabase Storage → `/public` → chemins relatifs), précisément parce qu'aucun
composant ne construit un chemin d'image à la main.

Notre version fait la même chose pour une architecture différente : trois
variantes statiques, clé locale-agnostique, attributs LCP.

Ce qu'on n'importe pas : la logique de fallback en cascade
(`startsWith('http')`, préfixe Supabase, fallback par slug). Elle existe parce
que la donnée est incohérente. Chez nous `check:images` échoue si une variante
manque — on répare la donnée au lieu de la rattraper au rendu.

→ `lib/images.ts`, `scripts/build-images.mjs`, `scripts/check-images.mjs`

### A.6 Deux règles SEO du repo, correctes et conservées

**Canonical toujours auto-référencée depuis le path**, jamais lue depuis une
colonne stockée. Le repo l'écrit noir sur blanc dans `docs/04-seo-metadata.md`,
et c'est juste.

**`rel="sponsored nofollow noopener"` + `target="_blank"`** sur tout lien
affilié. Le repo l'applique correctement ; le scaffold ne portait pas
`noopener`, il le porte maintenant.

### A.7 L'idée du système de fraîcheur

**Reprise, avec un périmètre strictement réduit.** Insérer année et mois au
rendu via des marqueurs, plutôt que de les figer dans une valeur stockée, est
un bon mécanisme.

Le périmètre change complètement — voir §B.6.

---

## B. Écarté

### B.1 Tout pattern d'accès aux données

**Écarté intégralement.** Aucun client Supabase, aucun appel réseau à
l'exécution, aucune dépendance de service sous quelque forme que ce soit. Le
contenu vit en MDX et JSON versionnés.

Ce n'est pas une préférence technique : c'est la décision prise après que ce
site soit tombé plusieurs jours sur un dépassement de quota. `preflight` échoue
si un client de service apparaît dans `app/`, `lib/` ou `components/`.

Corollaire : les 14 `select('*')` du repo n'ont pas d'équivalent chez nous, non
pas parce qu'on écrit des colonnes explicites, mais parce qu'il n'y a pas de
requête. La règle « colonnes explicites » s'applique quand même aux types :
`lib/products.ts` expose ce que les pages consomment, pas un `Product` brut.

### B.2 L'absence de `generateStaticParams` et de `revalidate`

**Écarté.** Les 28 routes du repo sont dynamiques, correctif non appliqué.
Chez nous c'est 100 % SSG, `generateStaticParams` sur toute route paramétrée,
et `preflight` bloque tout `revalidate` ou `force-dynamic` hors `/go/`.

Le SSG ne consomme ni compteur ISR ni invocations de fonction. Sur neuf
déploiements cibles, c'est ce qui fait tenir le plafond de 20 €.

### B.3 `next/image`

**Écarté.** Active l'Image Optimization, facturée sur un compteur séparé du TB
inclus. Remplacé par un pipeline de trois variantes webp générées à
l'ingestion.

Le scaffold prescrivait `next/image` + AVIF par réflexe Next.js. Corrigé.
`next.config.ts` porte `images: { unoptimized: true }` : le compteur devient
inatteignable par construction, et pas seulement interdit par discipline.

### B.4 `ratingValue: product.rating || 4`

**Écarté, et érigé en garde-fou.** Cette ligne invente une note quand la donnée
manque. Elle est fausse, invisible en review, et depuis que Google a durci sa
politique sur les avis c'est un motif de perte d'éligibilité aux rich results.

Chez nous : `overallRating` vaut `null` tant que l'évaluation n'a pas eu lieu,
la fiche n'affiche aucun bloc de note, et le JSON-LD ne porte ni
`aggregateRating` ni `review`. Aucune valeur par défaut, jamais.

Même traitement pour `reviewCount: product.review_count || 1`,
`availability: 'InStock'` écrit en dur, et `priceValidUntil` calculé à +3 mois
arbitrairement. Ce qu'on ne sait pas ne se balise pas.

`preflight` échoue sur tout motif `rating || <nombre>`.

### B.5 `Review` avec `author: Organization`

**Écarté.** Non éligible aux rich results, et douteux sur un site monétisé —
une organisation qui s'auto-décerne une note sur les produits qu'elle
commissionne.

Chez nous : si un `Review` est publié, son auteur est une `Person` nommée avec
une page auteur réelle. Sinon pas de `Review`, et on ne perd rien.

### B.6 `applyFreshnessUpdate()` appliqué au H1 et au corps

**Écarté, et c'est le point le plus dangereux du repo.**

Deux problèmes distincts.

**Le périmètre.** `docs/04-seo-metadata.md` du repo prescrit explicitement
`const displayH1 = applyFreshnessUpdate(config.h1)`. Un H1 dont l'année change
au build casse la correspondance avec le titre indexé, et fait varier le
contenu visible sans que rien ne l'ait édité. Chez nous les marqueurs sont
réservés au `<title>` et à la meta description. `check:seo` bloque un marqueur
dans un H1 ou dans le corps.

**La substitution aveugle.** `updateYearReferences()` remplace
`\b2024\b|\b2025\b|\b2026\b` par l'année courante sur **tout texte
user-facing**. Conséquence : « disponible depuis 2025 » devient « depuis
2026 », « modèle sorti en 2024 » devient « sorti en 2026 ». Le repo appelle sa
propre fonction un « filet de sécurité pour les années résiduelles » — c'est un
filet qui réécrit l'histoire.

Chez nous, un marqueur est explicite ou il n'y a rien à remplacer. Aucune
substitution sur du texte libre, jamais. `check:seo` échoue sur une année en
dur dans un title ou un H1, ce qui règle le problème à la source au lieu de le
rattraper au rendu.

### B.7 Cinquante-cinq catégories pour 247 produits

**Écarté comme modèle de volumétrie.** La cannibalisation entre
`/categories/silencieux` et `/categories/aspirateur-robot-laveur-silencieux`
est avérée : deux URLs, une seule intention, et Google qui arbitre à notre
place.

Notre règle : une page commerciale n'existe que si sa demande est **distincte
et mesurée** dans `data/keywords/clusters-be-fr.csv`. Seuil à 30 recherches/mois
cumulées, et en cas de doute une section dans la page existante plutôt qu'une
URL de plus.

Notre arborescence prévoit 22 comparatifs pour 62 modèles — un ratio de
segmentation trois fois plus prudent, adossé à des volumes mesurés.

### B.8 Les titres SEO stockés hors du gabarit

**Écarté.** Le repo a trois mécanismes concurrents : titres en base,
`strikingDistanceOverrides.ts`, et helpers de génération. Le premier
court-circuite les autres, et rien n'indique lequel s'applique à une page
donnée.

Chez nous, un seul emplacement : le frontmatter MDX. `check:seo` valide
longueur, unicité et absence d'année en dur.

À noter : l'**idée** de `strikingDistanceOverrides` — retravailler
spécifiquement les titres des pages en position 4-15 avec un CTR au plancher —
est excellente et sera reprise plus tard. Mais comme un chantier d'optimisation
piloté par la Search Console, pas comme un troisième mécanisme de titres.

### B.9 Les pages auteurs en TODO et indexables

**Écarté, et érigé en garde-fou.** `preflight` signale tout MDX de moins de 200
caractères de corps, `check:placeholders` bloque sur TODO, et `isActive: false`
retire une fiche de `generateStaticParams` — la page n'est pas générée plutôt
que générée vide.

Pour un site affilié, la page auteur est le seul signal E-E-A-T qu'un
concurrent ne peut pas copier. La laisser vide et indexable annule le
bénéfice et signale l'automatisation.

### B.10 `crossSiteMapper.ts`

**Écarté comme implémentation, repris comme cahier des charges.**

Ce qu'il fait de juste : générer des URLs absolues cross-domaines pour le
hreflang, et mapper les slugs feuille et pas seulement les segments. C'est le
seul besoin réel que le scaffold ne couvrait pas — corrigé par `routeFor()` et
`absoluteUrlFor()`.

Ce qu'il fait de faux, et qu'on ne reprend pas :

**Le repli vers `/`.** `mapFrToNl()` retourne la racine quand la page cible
n'existe pas, ce qui déclare la home comme alternative d'une page catégorie.
C'est pire que ne rien déclarer. Chez nous : pas de contrepartie = pas de
déclaration.

**Les tables parallèles écrites à la main**, sans vérification que la cible
existe. Chez nous les contreparties se déclarent page par page dans
`data/page-registry.ts` et `check:hreflang` vérifie la réciprocité.

**L'hypothèse `fr-BE` = mêmes URLs que `fr-FR`.** C'est exactement le piège de
duplication interlingue que la doctrine décrit en §5.

**Les domaines en constantes en dur.** Chez nous ils viennent du registre
`config/markets/`.

### B.11 Le panel d'administration

**Écarté.** `/admin/products`, `/admin/seo`, `/admin/images`, `/admin/sitemap`
existent parce que le contenu vit en base. Chez lui c'est cohérent.

Sur un catalogue de 62 produits versionné en JSON, un back-office ajoute une
surface d'authentification, des routes dynamiques, et un chemin d'édition qui
échappe à la review en PR. Un éditeur de texte et un diff font mieux.

Si le besoin apparaît — il apparaît vers 300 produits — il s'ajoutera sans
migration.

---

## C. Ce que ce repo ne pouvait pas nous apprendre

Trois choses manquent au repo source, et il faut les construire ici :

**La séparation panne / absence.** Le repo ne distingue pas une erreur
d'infrastructure d'une ressource inexistante. Une panne de base traduite en 404
dur désindexe des pages qui existent. Notre règle : `throw` pour une panne,
`notFound()` pour une absence.

**Le sub-ID par page.** Aucun `ascsubtag` dans le repo : impossible de savoir
quel gabarit convertit. C'est pourtant l'indicateur qui décide de la production
suivante.

**Le contrôle du coût.** Aucune trace de Spend Management, de palier de build
ou d'Ignored Build Step. À un site c'est indolore, à neuf déploiements c'est le
poste qui dérape.
