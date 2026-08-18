# Catalogue Amazon.com.be — protocole de collecte

C'est le goulot d'étranglement du démarrage. Pas le code.

---

## 1. Pourquoi c'est manuel

L'accès programmatique au catalogue Amazon a changé : la PA-API v5 s'est
arrêtée, et le Creators API qui la remplace exige un compte Partenaires
approuvé avec au moins 10 ventes qualifiées sur les 30 derniers jours. Au
lancement, tu n'auras donc **pas d'accès API**.

Le schéma `data/product.schema.ts` est conçu pour ça : rempli à la main
d'abord, synchronisé par API ensuite, sans migration. Les champs `sourceUrl`
et `sourcedAt` de chaque valeur restent valides dans les deux régimes.

---

## 2. Ce qui est déjà fait

`data/catalogue-a-remplir.csv` contient **62 modèles**, extraits des requêtes
marque + modèle ayant au moins 10 recherches/mois sur la base BE de tes
exports. Ce ne sont pas des modèles supposés populaires : ce sont ceux que
les Belges tapent réellement dans Google.

Colonnes déjà remplies : `slug`, `marque`, `modele`, `type`,
`search_volume_be`, `wave`.

Les 30 colonnes suivantes sont à remplir.

---

## 3. Ordre de remplissage

Ne remplis pas les 62 d'un coup. Suis l'ordre du calendrier de publication.

| Vague | Modèles | Quand |
|---|---|---|
| **V2** | Les 20 premiers du CSV, triés par volume | Avant la vague 2 de publication |
| **V5** | Les 38 suivants | Semaines 17-24 |
| **V6** | Le reste | Mois 7-10 |

Compte deux à trois heures pour vingt modèles une fois le rythme pris.

---

## 4. Par modèle, ce qu'il faut relever

### 4.1 Sur Amazon.com.be

Recherche le modèle exact. Trois cas.

**Cas A — le modèle est vendu sur Amazon.com.be.** Relève : `amazon_be_asin`
(dans l'URL, format `/dp/XXXXXXXXXX/`), `amazon_title` (exact, il sert au
contrôle anti-dérive), `price_eur`, `price_checked_at` (date du jour, format
ISO `2026-08-15`), `availability`.

**Cas B — le modèle est vendu par un vendeur tiers sur Amazon.com.be.**
Relève quand même, mais note-le : la disponibilité d'un marchand tiers est
volatile et le SAV n'est pas le même. C'est un fait à dire sur la page, pas à
cacher.

**Cas C — le modèle n'est pas sur Amazon.com.be.** C'est fréquent sur Zodiac
et le haut de gamme Dolphin, qui se vendent en réseau pisciniste. Laisse les
colonnes Amazon vides et **crée quand même la fiche**. Elle vit de la longue
traîne de marque, et l'honnêteté sur « où l'acheter en Belgique » est
précisément ce qui distingue le site.

Le `PriceTable` est multi-marchand par construction : une fiche sans ligne
Amazon reste une fiche valide.

### 4.2 Sur le site du constructeur

C'est **la** source des specs, jamais Amazon. Les fiches Amazon sont écrites
par des vendeurs et comportent des erreurs de conversion et des specs
recopiées d'un autre modèle.

Relève `manufacturer_url` et toutes les colonnes techniques. Sites de
référence : `maytronics.com` / `dolphin-pool-cleaners.com`, `zodiac.com`,
`aiper.com`, `wybotpool.com`, `beatbot.com`, `bwt-pool.com`, `intexcorp.com`,
`bestwaycorp.com`, `hayward-pool.eu`, `polarispool.eu`.

**Règle absolue** : si le constructeur ne publie pas une valeur, la colonne
reste **vide**. Elle deviendra `null` dans le JSON et la page affichera « non
communiqué ». Ne jamais estimer, ne jamais interpoler, ne jamais reprendre la
valeur d'un modèle voisin. Ce refus d'inventer, affiché, est un signal de
crédibilité plus fort que n'importe quel argumentaire — et c'est vérifiable
par un lecteur, contrairement à une spec approximative.

### 4.3 Le champ qui décide de tout : `stairs`

`compatibility.stairs` est le critère d'achat le plus discriminant et le
plus mal traité par les revendeurs. Beaucoup de constructeurs restent flous.
Trois valeurs possibles :

- `true` si le constructeur l'affirme explicitement
- `false` si le constructeur exclut explicitement les escaliers
- vide si ce n'est pas documenté — et alors la page le dit

Une page qui répond honnêtement « le constructeur ne le précise pas, voici ce
qu'en disent les retours utilisateurs » bat toutes les pages qui affirment
sans savoir.

---

## 5. Colonnes à remplir, format attendu

| Colonne | Format | Note |
|---|---|---|
| `amazon_be_asin` | 10 caractères | Vide si absent du catalogue BE |
| `price_eur` | `749.00` | Point décimal, sans symbole |
| `price_checked_at` | `2026-08-15` | ISO, date du relevé, pas d'approximation |
| `availability` | `en-stock` \| `rupture` \| `precommande` \| `indisponible` | |
| `cleaned_zones` | `fond,parois,ligne-eau` | Séparateur virgule, sans espace |
| `battery_life_min` | entier, minutes | Uniquement si batterie |
| `filtration_fineness_microns` | entier | Le chiffre clé au printemps belge |
| `filter_type` | `panier` \| `sac` \| `cartouche` \| `multi-panier` | |
| `brush_type` | `pvc` \| `mousse` \| `mixte` \| `picots` | |
| `control` | `application,programmation` | Ou `aucun` |
| `caddy_included` | `true` \| `false` | Souvent vendu séparément — à dire |
| `surfaces` | `liner,coque-polyester,carrelage` | |
| `shapes` | `rectangulaire,ovale,libre` | |
| `above_ground` / `in_ground` / `stairs` / `compound_slope` | `true` \| `false` \| vide | |

---

## 6. Du CSV au JSON

```bash
npm run import:catalogue -- data/catalogue-a-remplir.csv
```

Le script (`scripts/import-catalogue.mjs`) génère un fichier par produit dans
`data/products/[slug].json`, enveloppe chaque valeur factuelle dans la
structure `Sourced<T>` avec l'URL constructeur et la date de relevé, et
refuse d'écrire si :

- une valeur est présente sans `manufacturer_url`
- `price_eur` est présent sans `price_checked_at`
- `price_checked_at` a plus de 90 jours
- le slug existe déjà avec un contenu divergent non justifié

Les champs éditoriaux (`scores`, `pros`, `cons`, `verdictShort`,
`bestFor`, `notFor`, `testedInPerson`) ne sont **jamais** importés depuis le
CSV. Ils s'écrivent à la main, page par page, au moment de la rédaction.

---

## 7. Fraîcheur des prix

Un prix relevé est un prix daté. `check-prices` échoue si un `priceCheckedAt`
dépasse 90 jours sur une fiche active.

Rythme réaliste en solo : un passage mensuel hors saison, bimensuel d'avril à
août. Le relevé de prix belge daté et affiché est le seul actif du projet qui
ne se copie pas et qu'aucun moteur génératif ne peut inventer — c'est aussi
le signal de fraîcheur le plus lisible qui existe pour Google.

---

## 8. Ce qui manque encore

- **Le tag Amazon est renseigné** : `meilleur-robot-piscine06-21` dans
  `config/markets/be-fr.ts`. Un tracking ID vaut pour un store donné — celui-ci
  ne rémunère que amazon.com.be. Ne jamais le coller sur un lien amazon.fr.
- **Les autres marchands.** bol.com (Partnerprogramma), Coolblue, Hubo et
  Brico n'ont pas tous un programme d'affiliation ouvert. À vérifier avant de
  câbler leurs lignes dans `data/merchants.ts` — un lien non monétisé reste
  utile pour l'utilisateur, mais il doit alors être en `rel="nofollow"` simple
  et pas passer par `/go/`.
- **Les programmes marque.** Maytronics/Dolphin, Aiper, Beatbot et Wybot
  paient nettement mieux qu'Amazon sur cette niche. Candidater dès que le
  site a 20 pages indexées : c'est plus rentable que 50 pages de plus.
