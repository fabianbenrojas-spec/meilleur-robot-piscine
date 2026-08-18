# meilleur-robot-piscine.be

Comparateur éditorial indépendant de robots et aspirateurs de piscine pour le
marché belge. Next.js 15 App Router, TypeScript, Tailwind v4, MDX + JSON
versionnés, Vercel.

Marché déployé : `be-fr`. Marchés préparés : `be-nl`, `fr-fr`.

---

## Par où commencer

| Ordre | Fichier | Ce que ça règle |
|---|---|---|
| 0 | `docs/DOCTRINE-RESEAU.md` | Fait autorité sur l'architecture réseau |
| 1 | `docs/SETUP-STEP-BY-STEP.md` | **Commence ici pour agir.** Repo, Vercel, DNS, Search Console |
| 2 | `docs/00-DECISIONS-STRUCTURANTES.md` | Stack, domaines, ce qui manque encore |
| 3 | `docs/HERITAGE-ASPIRATEURS.md` | Ce qu'on reprend du réseau aspirateurs, et ce qu'on écarte |
| 2 | `CLAUDE.md` | Les règles que Claude Code lit à chaque session |
| 4 | `docs/ARBORESCENCE.md` | Les 164 URLs, validées contre les exports Semrush |
| 5 | `docs/TEMPLATES-PAGES.md` | La structure de chaque type de page |
| 6 | `docs/SEO-GEO-REDACTION.md` | Comment on écrit |
| 7 | `docs/CATALOGUE-AMAZON-BE.md` | Le protocole de collecte du catalogue |

---

## Structure

```
CLAUDE.md                    règles de session, garde-fous non négociables
DECISIONS.md                 journal des décisions et des content gaps
config/
  site.config.ts             résout le marché depuis process.env.MARKET
  markets/{be-fr,be-nl,fr-fr}.ts
  routes/                    segments d'URL traduits par marché
  routes.config.ts           toutes les URLs internes passent par ici
data/
  product.schema.ts          schéma unique du catalogue, champs en anglais
  page-registry.ts           une entrée par page commerciale : cluster, intention, liens typés
  merchants.ts               registre des marchands et de leurs programmes
  internal-links.json        source de vérité du maillage, vérifiée au build
  catalogue-a-remplir.csv    62 modèles à documenter, ordonnés par volume BE
  keywords/
    clusters-be-fr.csv       2 437 requêtes ≥ 10/mois, mappées à leur page cible
    clusters-summary-be-fr.csv
  products/                  un JSON par modèle (à générer depuis le CSV)
docs/                        doctrine, arborescence, gabarits, protocoles
skills/                      skills Claude Code du projet
scripts/                     contrôles CI
content/be-fr/               les pages MDX
```

---

## Commandes

```bash
npm run dev                  # MARKET=be-fr par défaut
MARKET=be-nl npm run dev     # prévisualiser un autre marché

npm run preflight            # inventaire des mécanismes canoniques
npm run new-page -- --type comparatif --slug robot-piscine-sans-fil
npm run import:catalogue -- data/catalogue-a-remplir.csv

npm run check:all            # les cinq contrôles, dans l'ordre de la CI
```

---

## Les six garde-fous

1. **Zéro chiffre en prose.** Tout passe par un composant adossé à
   `data/products/`.
2. **Source unique et datée.** `sourceUrl` + `sourcedAt` sur chaque fait,
   `priceCheckedAt` sur chaque prix. Si la source ne confirme pas : `null`.
3. **Donnée absente = bloc absent.** Aucune valeur par défaut, jamais. Pas de
   note, pas de `aggregateRating`, pas de `reviewCount` inventé.
4. **Aucun `Review` sans `Person` nommée.** `author: Organization` est interdit.
5. **Aucune page indexable sans contenu réel.**
6. **Content gap documenté** dans `DECISIONS.md` avant création.

Détail dans `CLAUDE.md`.

---

## Discipline de livraison

Une branche `content/<silo>-<slug>` et une PR par page. Jamais de commit
direct sur `main`. La livraison d'un agent s'arrête à l'ouverture de la PR :
le merge est une décision humaine, y compris quand toute la CI est verte.
