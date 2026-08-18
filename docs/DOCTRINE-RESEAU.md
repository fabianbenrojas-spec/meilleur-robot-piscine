# Doctrine d'architecture — réseau de sites d'affiliation

> **Version 3 — 16 août 2026.** Remplace la v2. Écrite d'après le socle réel des
> repos `meilleur-robot-piscine` et `meilleur-robot-tondeuse-be`, qui font
> autorité sur le modèle technique.
>
> Cible : **3 verticales × 3 marchés = 9 déploiements**, maintenus par une
> personne, pour un coût d'infrastructure plafonné à 20 €/mois.
>
> Marchés : `be-fr` (Belgique francophone, marché de lancement), `be-nl`
> (Belgique néerlandophone), `fr-fr` (France, phase 3).

---

## 0. Les trois principes

**A — Aucune requête visiteur ne touche un service tiers.**
Le contenu vit en MDX et JSON dans le repo, versionné, relu en PR. Le site est
un artefact statique. Une panne de facturation chez un fournisseur ne peut pas
rendre une page indisponible.

**B — Un repo par verticale, N déploiements.**
Les marchés sont une variable d'environnement, pas une copie de repo. Trois
repos par verticale divergeraient — c'est exactement ce qui s'est produit sur le
réseau aspirateurs, où le même champ porte deux noms (`verdict_court` /
`verdict_kort`) et rend 41 blocs de verdict invisibles pendant des semaines.

**C — Chaque produit facturé séparément est un produit qu'on n'utilise pas.**
Le plafond de 20 €/mois ne tient que si l'on reste dans les compteurs inclus.
Tout service à la consommation ajouté est une dérive future.

---

## 1. Modèle de référence — un repo, trois marchés

```
meilleur-robot-piscine/          ← un seul repo
├── config/markets/
│   ├── be-fr.ts    domain, locale, currency, vatRate, activeMerchantIds, affiliateTags
│   ├── be-nl.ts
│   └── fr-fr.ts
├── config/routes/               ← segments d'URL par marché
│   ├── be-fr.ts    { comparatif: "comparatif", avis: "avis", guide: "guide", … }
│   ├── be-nl.ts    { comparatif: "vergelijking", avis: "review", guide: "gids", … }
│   └── fr-fr.ts
├── content/<marketId>/          ← MDX, un dossier par marché
├── data/products/               ← JSON, locale-agnostique pour les specs
├── locales/<hreflang>.json      ← chaînes d'interface
└── public/images/products/      ← binaires, partagés par les trois marchés
```

Trois projets Vercel pointent sur le même repo, avec `MARKET=be-fr`,
`MARKET=be-nl`, `MARKET=fr-fr`. Un correctif de maillage, un changement de
schéma JSON-LD ou une mise à jour de gabarit s'écrit **une fois**.

### Ce qui varie légitimement d'un marché à l'autre

Le domaine, la locale, la TVA, les segments d'URL, les chaînes d'interface, les
marchands actifs, le tracking ID, et le contenu éditorial. **Rien d'autre.**

### Ce qui ne doit jamais varier

Les noms de champs, les noms de fichiers, la structure des dossiers, la logique
des gabarits, les scripts de contrôle. Un nom technique est en anglais, jamais
dans la langue du marché : `verdict_short`, pas `verdict_court` ni
`verdict_kort`.

---

## 2. Affiliation — un marchand et un tracking ID par marché

| Marché | Marchand principal | Marchands secondaires |
|---|---|---|
| `be-fr` | `amazon-be` (amazon.com.be) | bol, coolblue, hubo, brico |
| `be-nl` | `amazon-be` | bol, coolblue |
| `fr-fr` | `amazon-fr` | — |

**Un tracking ID par site**, jamais partagé. Un tracking ID ne rémunère que le
store pour lequel il a été créé : coller un tag belge sur un lien amazon.fr ne
rapporte rien et fausse le suivi. Un tag par site, c'est aussi la seule façon de
comparer les revenus sans démêler un rapport unique.

**Le StoreID n'est pas un tag de lien.** Il identifie le compte Partenaires. Le
mettre dans un `?tag=` fait perdre l'attribution silencieusement : le lien
fonctionne, la commission part ailleurs.

Tout lien sortant passe par `/go/<merchant>/<ref>`, qui reconstruit l'URL
canonique, attache le tracking ID et un `ascsubtag` identifiant la page de
départ. La route refuse toute référence absente des fiches produit — c'est ce
qui l'empêche de devenir un redirecteur ouvert.

`rel="sponsored nofollow noopener"` sur tout lien affilié.

---

## 3. Plafond Vercel — les sept règles qui tiennent les 20 €

Vercel Pro coûte 20 $/siège et par mois, plus la consommation. Le plan inclut
1 TB de bande passante, 10 M de requêtes edge et un crédit de dépense de 20 $.
Le plafond ne tient que si l'on reste dans les compteurs inclus.

### 3.1 Poser un plafond de dépense dans le dashboard

**Settings → Billing → Spend Management.** Fixer un montant maximal et activer
la mise en pause des projets au dépassement. C'est le seul garde-fou qui agit
sans toi. Tous les récits de factures Vercel à trois chiffres commencent par
« je n'avais jamais regardé le tableau de bord d'usage ».

### 3.2 Un seul siège

Les sièges « viewer » sont gratuits. Ne jamais ajouter de siège de développement
pour un accès en lecture.

### 3.3 Zéro produit facturé à part

Ne pas activer, ne pas importer, ne pas configurer :

- **Vercel Blob** — stockage, opérations et transfert facturés séparément, sur
  un compteur qui ne consomme pas le TB inclus
- **Image Optimization** (`next/image` sans `unoptimized`) — transformations,
  lectures et écritures de cache facturées séparément. Voir section 4.
- **Edge Config**, **KV**, **Postgres**, **Microfrontends**

Ces produits sont conçus pour des applications dynamiques. Un site statique de
catalogue n'en a besoin d'aucun.

### 3.4 Cent pour cent SSG, aucun ISR

Le SSG ne consomme ni compteur ISR, ni invocations de fonction. La seule route
dynamique du socle est `/go/<merchant>/<ref>` : volume de clics affiliés, donc
négligeable.

Ne jamais introduire de `revalidate` ni de rendu dynamique sur une page
publique. Si une donnée doit changer sans redéploiement, c'est le signe qu'elle
n'aurait pas dû être dans le repo — reposer la question plutôt que d'ajouter
de l'ISR.

### 3.5 Les minutes de build sont le poste qui dérape

C'est le coût le plus sous-estimé à neuf déploiements. Chaque PR déclenche un
build de préproduction, chaque merge un build de production. À raison d'une page
par PR sur neuf sites, le volume monte vite, et les builds SSG s'allongent avec
le nombre de pages.

Trois mesures :

- **Machine de build sur le palier le moins cher** qui tienne le temps de build.
  Le palier rapide est activé par défaut et coûte plusieurs fois le prix.
  À vérifier dans Settings → Build and Deployment de chaque projet.
- **Conserver `next build --turbopack`** dans `package.json` : un bundler plus
  rapide, ce sont moins de minutes facturées. À ne pas confondre avec le palier
  de machine, qui est un réglage Vercel.
- **Ignored Build Step** — une commande qui sort en 0 pour annuler le build
  quand aucun fichier significatif n'a changé. Une correction de documentation
  ou un `DECISIONS.md` mis à jour ne doit pas déclencher neuf builds.

**Regrouper les merges.** Une vague de contenu part en un lot, pas paragraphe
par paragraphe.

### 3.6 Protéger les previews

**Settings → Deployment Protection → Vercel Authentication** sur les
préproductions. Sans cela, les branches de contenu sont crawlables et créent du
duplicate content contre le site lui-même — un coût SEO, pas financier, mais
plus lourd que la facture.

### 3.7 Relever l'usage tous les mois

Un rendez-vous mensuel de cinq minutes sur l'onglet Usage de l'équipe. Ce qu'on
regarde : bande passante, minutes de build, invocations de fonction, et
l'apparition de tout compteur qui était à zéro le mois précédent.

Les tarifs évoluent — Vercel a restructuré sa facturation en septembre 2025 et
changé de palier de build par défaut en février 2026. **Vérifier les montants
sur la page tarifaire officielle avant tout engagement**, ne pas se fier à un
article de blog, celui-ci compris.

---

## 4. Images — qualité maximale, coût nul

### Le principe

Les variantes responsives sont générées **à l'ingestion**, pas à la requête.
Vercel facture l'optimisation à l'exécution ; un script Python la fait une fois
pour toutes, gratuitement, avec un meilleur contrôle du résultat.

### Le pipeline

Le script d'ingestion produit, pour chaque visuel source, trois fichiers webp :

```
public/images/products/
├── <slug>-400.webp     cartes de listing, vignettes       ≤  25 KB
├── <slug>-800.webp     visuel principal de fiche produit  ≤  60 KB
└── <slug>-1200.webp    zoom, galerie, écrans haute densité ≤ 120 KB
```

Qualité 82, `method=6`, ratio conservé, **jamais d'agrandissement** : si la
source fait 900 px, on ne génère pas de 1200.

Le nom de fichier suit une clé produit **locale-agnostique**, jamais le slug
d'URL localisé — sinon le même visuel existerait en trois exemplaires sous trois
noms dans un repo qui sert trois marchés.

### Le rendu

```tsx
<img
  src={`/images/products/${key}-800.webp`}
  srcSet={`/images/products/${key}-400.webp 400w,
           /images/products/${key}-800.webp 800w,
           /images/products/${key}-1200.webp 1200w`}
  sizes="(max-width: 640px) 100vw, 400px"
  width={800}
  height={800}
  alt={`${brand} ${model}`}
  loading="lazy"
  decoding="async"
/>
```

`width` et `height` explicites : zéro CLS, sans dépendre d'un composant.
`sizes` correct : le navigateur ne télécharge que la variante utile.

**L'image LCP fait exception** — visuel principal de la fiche produit, premier
visuel d'un comparatif. Elle porte `fetchpriority="high"`, **pas** de
`loading="lazy"`, et un `<link rel="preload">` dans le `<head>`. C'est ce qui
tient l'objectif de LCP sous 1,5 s en mobile.

### Interdits

- `next/image` sans `unoptimized` — active le compteur facturé
- Toute génération de variante à l'exécution
- Le hotlinking de visuels Amazon (`m.media-amazon.com`) hors PA-API :
  contraire aux conditions du programme Associates
- Un fournisseur de stockage externe pour des assets statiques

### Coût de la duplication

Un repo servant trois marchés porte les images **une seule fois**. Sur trois
verticales, environ 180 MB au total, servis par un CDN qui ne facture ni au
fichier ni à l'objet, seulement à la bande passante — dont tu as 1 TB.

---

## 5. Multi-marché — le risque de duplication interlingue

### Le problème

`fr-fr` et `be-fr` sont deux sites en français décrivant le même catalogue.
C'est le point faible structurel du modèle, et il ne se règle pas par la
technique. Le hreflang déclare une relation ; il ne dispense pas de différencier.
Si les deux versions disent la même chose, Google en garde une.

Le couple `be-nl` / `be-fr` ne pose pas ce problème : langues différentes.

### Ce qui différencie réellement

Le socle en fournit déjà l'essentiel, et c'est ce qui rend le modèle défendable :

- **Marchands différents** — amazon.com.be, bol, coolblue, hubo, brico d'un côté ;
  amazon.fr de l'autre. Prix, disponibilité et délais divergent réellement.
- **TVA différente** — 21 % contre 20 %, donc des prix affichés différents.
- **Cadre légal** — garantie légale de 2 ans en Belgique, droit de rétractation,
  Testachats comme référence d'autorité locale.
- **Contexte d'usage** — typologie de logement, surfaces, climat, saisonnalité.
- **Maillage** vers des ressources locales, pas françaises.

Ce n'est pas suffisant en soi : les verdicts, les sélections et les angles
doivent être **retravaillés**, pas traduits. Une version `fr-fr` qui est un
`be-fr` avec « en France » substitué est un site fantôme qui diluera l'autorité
de la verticale au lieu de l'étendre.

**Décider de l'angle de différenciation avant de produire la première page du
second marché.** Le documenter dans `DECISIONS.md`.

### hreflang réciproque

Chaque page déclare les marchés déployés plus `x-default`. **Une déclaration non
retournée par le site cible est ignorée par Google.** C'est l'erreur la plus
fréquente et la plus silencieuse d'un déploiement multi-marché.

Les segments d'URL diffèrent par marché (`comparatif` / `vergelijking`) : la
correspondance vient de `config/routes/`, jamais d'une table écrite à la main.

Un script de vérification de réciprocité tourne avant chaque soumission de
sitemap, et une fois par mois ensuite.

---

## 6. Contrôles bloquants

Le socle en porte cinq, exécutés en CI et avant chaque PR :

```
preflight            structure, config de marché, cohérence des types
check:seo            title, meta, Hn, canonical, hreflang
check:maillage       liens internes bidirectionnels, aucune cible cassée
check:placeholders   zéro chiffre en prose, zéro TODO, zéro texte de gabarit
check:prices         aucun relevé de plus de 90 jours
```

**Un contrôle qui échoue en permanence est pire que pas de contrôle** : on se
croit couvert. Sur le réseau aspirateurs, un `node_modules` corrompu masquait
42 erreurs de typage, dont l'incohérence `verdict_court` / `verdict_kort`.

La CI doit être verte. Une régression tolérée devient un plancher.

À ajouter au fur et à mesure des marchés :

```
check:hreflang       réciprocité entre marchés déployés
check:images         3 variantes présentes par produit, poids sous les seuils
check:build-cost     alerte si le nombre de pages générées croît anormalement
```

---

## 7. Hygiène de repo

### Secrets

Aucune clé en dur, jamais, même dans un fichier gitignoré :

```python
SERVICE_ROLE_KEY = os.environ['SUPABASE_SERVICE_ROLE_KEY']
```

Le tracking ID vit dans `.env` en local et dans les variables Vercel en
production. Il n'entre pas dans git.

Contrôle **avant** commit, jamais après :

```bash
grep -riE "eyJ|sb_secret|service_role" scripts/ || echo "propre"
```

### Git

Branche unique `main`, protégée : PR obligatoire, CI verte exigée. Une page par
PR. Jamais de `git add .` ni `git add -A` — toujours des chemins explicites.

### Claude Code

`.claude/settings.local.json` : **ne jamais pré-approuver `Bash(git push *)`**.
Committer sans demander est réversible, pousser ne l'est pas.

### Indexation

`SITE_LAUNCHED=false` jusqu'à ce que la première vague soit en ligne et relue.
`robots.ts` renvoie un `Disallow: /` global tant que la variable est fausse. On
ne laisse pas Google indexer un site à trois pages.

---

## 8. Exceptions documentées

Deux sites du portefeuille ne suivent pas cette doctrine. Ce sont des exceptions
assumées, pas des retards à rattraper.

### Le réseau aspirateurs robots — Supabase, maintenu tel quel

`meilleurs-aspirateurs-robots.fr` et `beste-robotstofzuigers.be` restent sur
Next.js + Supabase, **tant que le plan Free suffit**.

Conditions de maintien :

- Images rapatriées dans `/public`, **jamais servies depuis Storage** — c'est
  ce qui a provoqué la coupure du 15 août 2026, par dépassement de l'egress
  caché au niveau de l'organisation
- Alerte de quota Supabase à 60 %
- Séparation 404 / 503 : `if (error) throw` avant `if (!data) notFound()`.
  Une panne d'infrastructure traduite en 404 dur désindexe.
- ISR avec `generateStaticParams` pour sortir la base du chemin de requête

Si le plan Free ne suffit plus, la décision est binaire : migrer vers le modèle
MDX + JSON de ce document, ou passer en payant. Ne pas bricoler entre les deux.

### meilleur-aspirateur-robot.be — Lovable, maintenu tel quel

Le troisième site de la verticale aspirateurs reste sur Lovable, avec ses assets
sur Cloudflare R2.

**La seule contrainte qui compte : le hreflang doit être réciproque.** Si ce site
ne peut pas déclarer `<link rel="alternate" hreflang>` vers le `.fr` et le
`.be` néerlandophone, alors les déclarations émises par ces deux-là sont
ignorées par Google, et le trio n'a pas de hreflang fonctionnel malgré le
`crossSiteMapper.ts` qui laisse croire le contraire.

**À vérifier en priorité** : Lovable permet-il d'injecter des balises
arbitraires dans le `<head>` ? Si non, le trio aspirateurs fonctionne comme
trois sites indépendants, et il faut en tirer les conséquences éditoriales — la
différenciation devient obligatoire, pas souhaitable.

### Une exception ne se propage pas

Aucune nouvelle verticale, aucun nouveau marché ne peut invoquer l'une de ces
deux exceptions comme précédent.

---

## 9. Ordre de mise en place, pour un nouveau marché

1. Renseigner `config/markets/<marketId>.ts` : domaine, TVA, marchands actifs,
   tracking ID dédié
2. Renseigner `config/routes/<marketId>.ts` : segments d'URL localisés
3. Créer `locales/<hreflang>.json` et `content/<marketId>/`
4. Créer le projet Vercel sur **le même repo**, avec `MARKET=<marketId>` et
   `SITE_LAUNCHED=false`
5. Vérifier le palier de machine de build et l'Ignored Build Step
6. Domaine, DNS, Search Console en propriété de domaine — avant toute indexation
7. Définir et documenter l'angle de différenciation dans `DECISIONS.md`
8. Produire la première vague, `check:all` vert à chaque PR
9. Vérifier la réciprocité hreflang sur tous les marchés déployés
10. `SITE_LAUNCHED=true`, soumettre le sitemap

L'étape 7 est celle qu'on saute, et c'est celle qui décide si le second marché
apporte du trafic ou dilue le premier.
