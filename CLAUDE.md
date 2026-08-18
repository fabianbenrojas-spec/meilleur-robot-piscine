# meilleur-robot-piscine — comparateur éditorial de robots de piscine (BE)

Lu à chaque session Claude Code, avant toute action. En cas de conflit avec un
brief, la règle gagne — le signaler plutôt que l'exécuter.

Autorité : `docs/DOCTRINE-RESEAU.md` fait foi sur l'architecture réseau. Ce
fichier en est l'application à cette verticale. Aucun repo de référence ne fait
autorité, y compris `meilleurs-aspirateurs-robots-next`.

## 1. Identité

Comparateur éditorial indépendant de robots et aspirateurs de piscine pour le
marché belge francophone. Monétisation par affiliation, Amazon.com.be en socle
au lancement, programmes marque et revendeurs BE ensuite.

- Domaine : `meilleur-robot-piscine.be` — marché de lancement `be-fr`
- Stack : Next.js 15 App Router, TypeScript strict, Tailwind v4, MDX + JSON
  versionnés, Vercel.
- **100 % SSG. Aucun ISR, aucun `revalidate`, aucun rendu dynamique sur page
  publique.** Seule route dynamique du socle : `/go/[merchant]/[ref]`.
- **Aucune requête visiteur ne touche un service tiers.** Pas de base de
  données à l'exécution, pas de client Supabase, pas de stockage externe. Une
  panne de facturation chez un fournisseur ne peut pas rendre une page
  indisponible. Cette décision a été prise après que le réseau aspirateurs soit
  tombé plusieurs jours sur un dépassement de quota.
- **Un repo, N déploiements.** `be-nl` et `fr-fr` seront des projets Vercel sur
  CE repo, avec `MARKET=` en variable d'environnement. Jamais un fork, jamais
  une copie. Un correctif de gabarit s'écrit une fois.
- Site standalone. Le projet robots tondeuses est un repo séparé, autre
  verticale. Les documents de contexte décrivant un site piscine combiné avec
  spa ou sauna sont périmés.

## 2. Toujours, avant d'agir

1. Lire ce fichier, puis `docs/SEO-GEO-REDACTION.md`.
2. `npm run preflight` — inventaire des mécanismes canoniques. Un mécanisme =
   une seule implémentation. Étendre, jamais dupliquer.
3. Anti-doublon : vérifier dans `docs/ARBORESCENCE.md` et
   `data/page-registry.ts` que l'URL et l'intention n'existent pas déjà.
4. Validation de la demande : le cluster doit exister dans
   `data/keywords/clusters-be-fr.csv` et passer les seuils du §5.
5. Analyse SERP google.be sur le head term, content gap écrit dans
   `DECISIONS.md`. Sans content gap identifié, on ne crée pas la page.

## 3. Les six garde-fous non négociables

### 3.1 Zéro chiffre en prose

Aucun prix, surface, autonomie, débit, finesse de filtration ni note n'est
écrit dans le texte. Tout passe par un composant alimenté par
`data/products/*.json`.

- Interdit : « le Dolphin E20 filtre à 17 m³/h pour environ 700 € »
- Correct : `<SpecsTable product="dolphin-e20" />` + une prose qui commente
  sans chiffrer

Auto-contrôle : relire chaque paragraphe et se demander « ce nombre peut-il
changer ? ». Si oui, composant. Si un chiffre semble indispensable en prose,
c'est qu'il manque un champ au schéma — l'ajouter à la source, jamais au texte.

### 3.2 Source unique et datée

Chaque fait produit porte `sourceUrl` + `sourcedAt`. Chaque prix porte
`priceCheckedAt`. Une donnée = une source officielle (constructeur pour les
specs, fiche marchand pour prix et disponibilité), datée du jour du relevé.
Jamais un agrégateur quand la source officielle existe.

Si la source ne confirme pas : `null`, et la page affiche « non communiqué ».
Ne jamais estimer, ne jamais interpoler depuis un modèle voisin de la même
gamme.

### 3.3 Donnée absente = bloc absent

`overallRating` et `scores` valent `null` tant que l'évaluation n'a pas eu
lieu. Dans ce cas la fiche n'affiche **aucun** bloc de note, et le JSON-LD ne
porte **ni** `aggregateRating` **ni** `review`.

**Aucune valeur par défaut, jamais.** Le réseau aspirateurs écrit
`ratingValue: product.rating || 4` : une note inventée quand la donnée manque.
C'est faux, c'est invisible en review, et depuis que Google a durci sa
politique sur les avis c'est un motif de perte d'éligibilité aux rich results.

La même règle vaut pour `availability`, `priceValidUntil` et `reviewCount` : ce
qu'on ne sait pas ne se balise pas.

### 3.4 Aucun Review sans Person nommée

Si le site publie un `Review`, son `author` est une `Person` nommée, avec une
page auteur réelle et renseignée. Sinon on ne publie pas de `Review` — et on ne
perd rien : Google n'accorde plus de rich results aux avis auto-publiés sur
produit.

`author: { "@type": "Organization" }` est interdit. Non éligible, et douteux
sur un site monétisé.

En revanche `positiveNotes` / `negativeNotes` en `ItemList` restent un avantage
structurel réel : Google réserve ce rich result aux pages de test éditoriales
et l'interdit aux pages produit marchandes. Les revendeurs qui occupent la SERP
belge ne peuvent pas l'utiliser.

### 3.5 Aucune page indexable sans contenu réel

Pas de page-gabarit en production avec un placeholder. `preflight` signale tout
MDX de moins de 200 caractères de corps, `check:placeholders` bloque sur TODO.
Le réseau aspirateurs a laissé ses pages auteurs en « TODO » et indexables
pendant des mois.

`isActive: false` sur une fiche produit la retire de `generateStaticParams` :
la page n'est pas générée du tout, plutôt que générée vide.

### 3.6 Content gap documenté avant création

Voir §2.5. Le refus documenté a autant de valeur que la page créée.

## 4. Affiliation

- Tous les liens sortants passent par `/go/[merchant]/[ref]`, avec
  `rel="sponsored nofollow noopener"` et `target="_blank"`. `/go/` en noindex
  via `X-Robots-Tag` et en `Disallow` dans `robots.ts`.
- **La route refuse toute référence absente des fiches actives.** Sans cette
  validation, `/go/` est un redirecteur ouvert utilisable par n'importe qui
  pour blanchir un lien derrière le domaine.
- Chaque lien porte un `ascsubtag` identifiant la page de départ. C'est ce qui
  permet de mesurer le taux de clic sortant par gabarit — l'indicateur qui dit
  quel contenu produire ensuite.
- Jamais deux attributions empilées sur un clic : `withAmazonTag` écrase le
  paramètre `tag`, il ne l'ajoute pas.
- **Un tracking ID par marché, jamais partagé.** Un tag émis pour amazon.com.be
  ne rémunère pas un lien amazon.fr : le lien fonctionne et la commission part
  ailleurs. Le tag de `be-fr` est `meilleur-robot-piscine06-21`.
- **Le StoreID (`meilleurteste-21`) n'est pas un tag de lien.** Il identifie le
  compte Partenaires. Le mettre dans un `?tag=` fait perdre l'attribution
  silencieusement. `preflight` échoue s'il apparaît dans une URL.
- Le store est déterminé par le `merchantId`, jamais par l'URL relevée à la
  main.

Densité affiliée — dérivée de l'intention, pas choisie page par page :

| Intention | Gabarits | Densité |
|---|---|---|
| transactional / commercial | `comparison`, `review`, `versus`, home | Haute |
| commercial faible | `brand` | Moyenne |
| informational | `guide`, `parts`, hub de désambiguïsation | Basse |
| support | `problem` | Nulle, sauf la pièce directement pertinente |
| — | `tool` | En sortie de résultat uniquement |

La fenêtre Amazon est de 24 h : un guide qui envoie sur Amazon deux semaines
avant l'achat brûle le clic.

Le catalogue Amazon n'est pas accessible par API au lancement. Il se remplit à
la main via CSV — `docs/CATALOGUE-AMAZON-BE.md`.

## 5. Seuils de création de page

- Cluster ≥ 30 recherches/mois cumulées sur la base BE → page dédiée.
- Entre 10 et 30 → section dans une page existante, pas de page.
- < 10 avec intention transactionnelle nette et KD < 20 → exception, à
  documenter dans `DECISIONS.md`.
- Fiche modèle : créée si le modèle est disponible chez au moins un marchand
  belge, même à volume nul. Ces pages vivent de la longue traîne de marque.

**Deux catégories dont les intentions se recouvrent ne coexistent pas.** Le
réseau aspirateurs porte 55 catégories pour 247 produits, avec cannibalisation
avérée entre `/categories/silencieux` et
`/categories/aspirateur-robot-laveur-silencieux`. Une page commerciale n'existe
que si sa demande est **distincte et mesurée**. En cas de doute, une section
dans la page existante.

Le seuil se recalibre après trois mois de Search Console filtrée sur la
Belgique. C'est elle, pas Semrush, qui donne la vraie demande belge.

## 6. Règles SEO non négociables

- Toute page : metadata complète, canonical **auto-référencée construite depuis
  le path**, jamais lue depuis une donnée stockée. Breadcrumbs. JSON-LD adapté
  au gabarit.
- **Marqueurs de fraîcheur (`{{YEAR}}`, `{{MONTH_YEAR}}`) : `<title>` et meta
  description UNIQUEMENT.** Jamais dans un H1, jamais dans le corps, jamais
  dans une valeur stockée. Un H1 dont l'année change au build casse la
  correspondance avec le titre indexé.
- **Jamais de substitution d'année sur du texte libre.** Le réseau aspirateurs
  remplace `\b2024|2025|2026\b` partout : « disponible depuis 2025 » devient
  « depuis 2026 ». Les marqueurs sont explicites, ou il n'y a rien à remplacer.
- Les titres SEO vivent dans le frontmatter MDX, jamais dans une donnée externe
  au gabarit : un titre stocké ailleurs court-circuite les helpers.
- **Images : trois variantes webp générées à l'ingestion**, jamais à la
  requête. `<imageKey>-{400,800,1200}.webp`, rendu par `lib/images.ts` en
  `<img>` avec `srcSet`, `sizes`, `width`/`height` explicites.
  `next.config.ts` porte `images: { unoptimized: true }` — le compteur facturé
  devient inatteignable par construction, pas par discipline.
- La clé image est **locale-agnostique**, jamais le slug d'URL localisé : un
  repo qui sert trois marchés porte le visuel une seule fois.
- Exception LCP (visuel principal de fiche, premier visuel de comparatif) :
  `fetchpriority="high"`, pas de `loading="lazy"`, `<link rel="preload">`.
  Objectif LCP < 1,5 s mobile, zéro CLS.
- Jamais de hotlinking de visuels Amazon (`m.media-amazon.com`) hors PA-API :
  contraire aux conditions du programme Associates.
- Tableaux comparatifs server-rendered, jamais de widget client-only.
- Contenu replié : render-then-hide en CSS, jamais de conditional render. Un
  LLM lit le DOM, pas l'affichage.
- Frontmatter MDX obligatoire : `title`, `description`, `slug`, `silo`,
  `cluster`, `headTerm`, `clusterVolume`, `intent`, `affiliateDensity`,
  `author`, `datePublished`, `dateModified`, `tldr`, `faq`, `products`,
  `links`.
- Le `FAQPage` est généré **exclusivement** depuis `faq:`. Un FAQPage écrit à
  la main dans le corps produit un doublon silencieux. `check:seo` bloque.
- Maximum 6 liens internes contextuels par page, minimum 2 vers des piliers.
- **Un lien interne ne pointe jamais vers une source de redirection.** Les
  redirections servent les backlinks et l'historique, pas notre propre
  maillage.
- `app/robots.ts` n'interdit aucun crawler IA (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, CCBot, Bingbot). `public/llms.txt` tenu à jour
  à chaque page majeure.

## 7. Règles de code

- **Les noms techniques sont en anglais, jamais dans la langue du marché.**
  Champs JSON, colonnes CSV, clés de config, noms de fichiers, noms de scripts.
  `verdictShort`, jamais `verdict_court` ni `verdict_kort`. Seul le contenu est
  localisé. C'est la règle qui a coûté 41 blocs de verdict invisibles sur le
  réseau aspirateurs.
- Aucune string de contenu ou d'URL en dur dans un composant. Tout passe par
  `locales/fr-BE.json`, `config/routes.config.ts`, `config/site.config.ts`.
- `config/routes.config.ts` expose `routeFor(market, type, slug)` et
  `absoluteUrlFor()`. Sans eux, aucune URL d'un autre marché n'est
  constructible et le hreflang devient impossible à générer.
- **Colonnes explicites partout.** Aucun équivalent de `select('*')` : ce que
  la page consomme est ce que le type déclare.
- **Séparer panne et absence.** Un `throw` pour une erreur d'infrastructure, un
  `notFound()` pour une ressource qui n'existe pas. Une panne traduite en 404
  dur désindexe.
- Un composant par fichier, pas de `any`, mobile-first, vérifier l'existant
  avant de créer.
- Design tokens dans `tailwind.config.ts` uniquement. Aucune couleur en dur,
  aucune valeur arbitraire hors échelle.

## 8. Rédaction de contenu

Avant la première ligne de toute page :

1. `docs/SEO-GEO-REDACTION.md` — brief, outline, analyse SERP, structure GEO.
2. `docs/AUTHOR-*.md` — la voix qui signe.
3. `skills/humaniser-fr` en mode production, règles anti-IA internalisées
   **avant** d'écrire.
4. Câblage via `skills/piscine-data-integrity`,
   `skills/piscine-maillage-jsonld`, `skills/piscine-page-creation`.
5. Review finale via `skills/boileau` avant commit.

Filtre qualité avant chaque commit de contenu :

- SERP analysée, content gap logué dans `DECISIONS.md`
- ≥ 70 % des H2 en question, chaque H2 = chunk citable seul
- ≥ 3 signaux d'Expérience réels
- Zéro chiffre en prose
- Un fait négatif assumé quelque part sur la page

## 9. Contrôles

Cinq contrôles automatiques, verts sans exception :

```
preflight            mécanismes canoniques, garde-fous structurels
check:seo            frontmatter, title/meta, Hn, marqueurs, cannibalisation
check:maillage       liens bidirectionnels, densité, cibles existantes
check:placeholders   zéro chiffre en prose, zéro TODO
check:prices         aucun relevé de plus de 90 jours
```

`npm run check:all` les enchaîne. La passe anti-IA est une **relecture
humaine** et n'est pas un script — ne pas la compter dans la CI.

**Un script déclaré dans `package.json` existe.** `preflight` échoue sinon. Un
contrôle qui plante en permanence est pire que pas de contrôle : on se croit
couvert. Sur le réseau aspirateurs, un `node_modules` corrompu a masqué 42
erreurs de typage.

À activer au déploiement du deuxième marché : `check:hreflang`,
`check:images`, `check:build-cost`.

## 10. Protocole anti-régression

- Signaler et refuser tout prompt qui semble périmé (travail déjà présent dans
  git ou dans l'inventaire preflight) plutôt que l'exécuter.
- Branche unique `main`, protégée : PR obligatoire, CI verte exigée. Une page
  par PR. Jamais de commit direct sur `main`.
- **Jamais `git add .` ni `git add -A`** — toujours des chemins explicites.
- Claude Code n'exécute jamais `git push`, `gh pr merge`, `gh pr close`, ni
  `git push --delete`. La livraison s'arrête à l'ouverture de la PR.
  `.claude/settings.local.json` ne pré-approuve jamais `Bash(git push *)` :
  committer sans demander est réversible, pousser ne l'est pas.
- Aucune clé en dur, jamais, même dans un fichier gitignoré. Avant commit :
  `grep -riE "eyJ|sb_secret|service_role" scripts/ lib/`
- `SITE_LAUNCHED=false` tant que la première vague n'est pas en ligne et
  relue. `robots.ts` renvoie un `Disallow: /` global.
- `DECISIONS.md` tenu à jour : toute décision d'architecture, tout content gap,
  toute exception aux seuils.

## 11. Coût d'infrastructure — plafond 20 €/mois

- **Spend Management** activé, avec mise en pause des projets au dépassement.
  C'est le seul garde-fou qui agit sans intervention.
- Un seul siège payant. Les accès en lecture sont des sièges viewer, gratuits.
- **Aucun produit facturé séparément** : ni Blob, ni Image Optimization, ni
  Edge Config, ni KV, ni Postgres, ni Microfrontends. Un site statique de
  catalogue n'en a besoin d'aucun.
- Palier de machine de build sur le moins cher qui tienne le temps de build. Le
  palier rapide est activé par défaut et coûte plusieurs fois le prix.
- `next build --turbopack` conservé. **Ignored Build Step** configuré : une
  correction de `DECISIONS.md` ne doit pas déclencher de build.
- La CI GitHub ne relance pas `next build` : la préproduction Vercel le fait
  déjà sur la même PR, et son échec bloque déjà le merge. Deux builds pour le
  même commit, c'est deux compteurs pour un seul travail.
- Merges regroupés par vague, pas page par page.
- **Redéploiement programmé mensuel** par Deploy Hook. En 100 % SSG, les
  marqueurs de fraîcheur sont résolus au build : sans redéploiement, le site
  sert un `{{MONTH_YEAR}}` périmé. Douze builds par an et par déploiement,
  négligeable, et cela ferme la question de l'ISR au lieu de la laisser
  ouverte.
- Relevé d'usage mensuel : bande passante, minutes de build, invocations, et
  tout compteur qui était à zéro le mois précédent.
