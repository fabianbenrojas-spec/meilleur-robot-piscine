# Décisions structurantes — meilleur-robot-piscine.be

Quatre décisions à prendre avant le premier commit. Chacune coûte quelques
heures maintenant et une refonte dans dix-huit mois.

---

## 1. Stack : le core VPN, pas le repo aspirateurs

Les deux repos fournis ne jouent pas le même rôle.

| | meilleurs-aspirateurs-robots.fr | vpn-affiliate-core |
|---|---|---|
| Stack | Vite + React SPA + Supabase | Next.js 15 App Router, 100 % SSG |
| Rendu SEO | Snapshots prégénérés servis par edge function | Server-side natif |
| Contenu | Rangé en base, édité par panel admin | MDX versionné + JSON dans le repo |
| Multi-marché | Duplication de repo et de projet Supabase | Registre `config/markets` natif |
| Ce qu'il apporte ici | **La typologie de pages et le maillage** | **Le socle technique et éditorial** |

**Recommandation : partir du core VPN pour la technique, du repo aspirateurs
pour la structure de pages.**

Trois raisons.

La première est le rendu. Le site aspirateurs est une SPA qui compense
l'absence de rendu serveur par un système de snapshots
(`generate-seo-snapshots`, `serve-seo-snapshot`, `webhook-snapshot-regenerate`).
Ça fonctionne — le site convertit, c'est prouvé — mais c'est une pièce mobile
de plus, et elle se situe exactement sur le chemin critique du SEO. En
Next.js, ce problème n'existe pas.

La deuxième est le multi-marché. Tu as annoncé une version flamande puis une
version française. Le core VPN a déjà `config/markets/{be-fr,be-nl,fr-fr}.ts`,
`config/routes/` avec des segments d'URL traduits par marché, et
`locales/*.json`. Le repo aspirateurs, lui, a résolu le même problème en
dupliquant le repo entier — le README documente une différenciation manuelle
de 30 % entre le `.be` et le `.fr`. Ça marche à deux marchés, ça ne tient pas
à quatre.

La troisième est la doctrine. Les skills, `check-seo`, `check-placeholders`,
`preflight`, `DECISIONS.md`, les hooks `.claude/` : tout ce système
anti-régression est écrit pour ce repo-là. Le porter sur une SPA Supabase
revient à le réécrire.

**Ce qu'on reprend du site aspirateurs, en revanche, est précieux et se
reprend tel quel** : la typologie de pages, la découpe de la homepage en
treize blocs, le simulateur, la table de comparaison, le maillage
catégorie ↔ produit ↔ marque ↔ comparatif. C'est ce qui convertit, et c'est
détaillé dans `docs/TEMPLATES-PAGES.md`.

**Ce qu'on ne reprend pas** : Supabase et le panel admin. Sur un site solo à
150-200 pages avec un catalogue de 60 produits, un JSON versionné dans le repo
est plus rapide à éditer, plus facile à contrôler en CI, et diffable en PR. Si
le besoin d'un back-office apparaît (il apparaît vers 300+ produits), il
s'ajoute ensuite sans migration.

---

## 2. Le domaine est français, le marché ne l'est pas

`meilleur-robot-piscine.be` est un EMD français. C'est très bien pour `be-fr`,
c'est le meilleur choix possible sur la requête principale. Mais il ferme une
option : un Flamand qui voit cette URL dans la SERP clique moins, et un
`/nl/` sous un domaine français paie ce coût sur chaque impression.

**Recommandation : trois domaines, un seul repo.**

```
meilleur-robot-piscine.be    →  MARKET=be-fr   (maintenant)
[à réserver].be              →  MARKET=be-nl   (phase 2)
[à réserver].fr              →  MARKET=fr-fr   (phase 3)
```

Pour le `.be` néerlandophone, réserve maintenant, pendant que c'est libre :
`zwembadrobot.be`, `beste-zwembadrobot.be` ou `zwembadrobots.be`. Coût
annuel négligeable, et ça évite de découvrir dans dix-huit mois que le nom
est pris.

Conséquences techniques, à câbler dès le premier commit même si un seul
marché est déployé :

- `config/markets/` avec les trois entrées, `MARKET=be-fr` par défaut
- `config/routes/` avec les segments traduits (`/comparatif/` → `/vergelijking/`)
- `locales/fr-BE.json`, `nl-BE.json`, `fr-FR.json` — aucune string en dur
- `content/be-fr/`, `content/be-nl/`, `content/fr-fr/`
- hreflang réciproque et auto-référencé, `nl-be` et jamais `be-nl`,
  `x-default` sur le `.be` francophone tant que lui seul existe
- champ `i18n` dans le schéma produit dès maintenant

Le coût de cette anticipation est de quelques heures. Le coût de son absence
est une migration.

**Un piège précis** : hreflang ne protège pas un contenu dupliqué. Si la page
NL est une traduction de la page FR, Google reprend la main, ignore la
canonique et le hreflang, et en désindexe une. La règle est : **on adapte ce
qui marche, on ne traduit pas ce qui existe.** Trente pages flamandes issues
de leur propre recherche de mots-clés valent mieux que cent-cinquante
traduites.

---

## 3. Le nom du site ne recouvre pas la demande

C'est le point le plus important de ce document, et il vient directement des
exports Semrush.

Sur la base BE, `aspirateur piscine` pèse **1 300 recherches/mois**, contre
**1 000** pour `robot piscine`. La famille « aspirateur » cumule environ
5 600 recherches/mois. Mais elle est ambiguë : elle mélange trois produits
différents.

| Intention réelle derrière « aspirateur piscine » | Volume approx. | Panier |
|---|---|---|
| Robot électrique autonome | le gros du volume | 300–1 800 € |
| Balai aspirateur manuel branché sur skimmer | ~2 000/mois | 20–80 € |
| Aspirateur à batterie portatif type Intex ZR100 | ~800/mois | 40–150 € |

Un site qui s'appelle « meilleur-robot-piscine » et qui ignore le mot
« aspirateur » se prive du plus gros head term de sa niche. Un site qui
l'attaque frontalement récupère du trafic à panier de 30 € qui ne finance
rien.

**Recommandation : une page hub `/aspirateur-piscine/` qui désambiguïse et
route.** Elle répond à la question réellement posée — « quel appareil pour
nettoyer ma piscine » — sépare explicitement les trois familles, et renvoie
vers le silo robots pour celle qui monétise. C'est de loin le meilleur
content gap disponible : personne sur google.be ne traite cette confusion, et
c'est exactement le genre de page que les moteurs génératifs citent parce
qu'elle clarifie une ambiguïté.

Le corollaire, moins agréable : **la marque Intex écrase la SERP belge**
(2 610 recherches/mois cumulées, deuxième marque derrière Zodiac). Ce sont
des produits à 50-150 €, à commission Amazon dérisoire. Il faut les couvrir
pour l'autorité de catégorie, mais la monétisation vient de Dolphin, Zodiac,
Aiper, Wybot et Beatbot.

---

## 4. Amazon au lancement, pas Amazon pour toujours

Amazon.com.be est le bon choix de départ : catalogue large, conversion
élevée, confiance, pas de négociation. Mais la commission Maison/Jardin est
faible et la fenêtre est de 24 h.

À installer comme réflexe dès la première page :

- Le composant prix est **multi-marchand par construction**
  (`PriceTable`), même si une seule ligne Amazon est remplie au lancement.
  Ajouter bol.com, Coolblue ou Hubo plus tard ne doit pas demander de
  refonte de gabarit.
- Candidater aux programmes marque et revendeurs dès que le site a 20 pages
  indexées. Sur cette niche : Maytronics/Dolphin, Aiper, Beatbot et Wybot ont
  des programmes propres ou passent par des réseaux (Awin, Impact, TradeDoubler).
  Sur un panier de 1 200 €, l'écart de rémunération est d'un facteur 2 à 4.
- Les pages `probleme` et `pieces` ne portent pas de lien affilié produit.
  Elles construisent la légitimité et le trafic récurrent, pas le chiffre.

---

## 5. Ce qu'il me manque pour aller plus loin

Par ordre de blocage décroissant.

**1. Le catalogue produit Amazon.com.be.** Je ne peux pas accéder à Amazon
depuis cet environnement — le réseau est restreint à une liste de domaines
qui ne l'inclut pas, et l'API produit n'est de toute façon pas ouverte à ton
compte tant que les 10 ventes qualifiées ne sont pas faites. J'ai reconstruit
la liste des modèles **réellement recherchés en Belgique** depuis tes exports
(voir `docs/CATALOGUE-AMAZON-BE.md`, 58 modèles identifiés), mais il me faut
de ta part, par modèle : ASIN, titre exact, prix relevé, disponibilité,
image, et les specs de la fiche. Le protocole de collecte et le CSV
d'import sont dans ce fichier. C'est deux à trois soirées, et c'est le vrai
goulot d'étranglement du démarrage — pas le code.

**2. Ton tag d'affiliation Amazon Partenaires BE.** Fourni :
`meilleur-robot-piscine06-21`, câblé dans `config/markets/be-fr.ts`. Un
tracking ID par site et par store, jamais partagé : un tag émis pour
amazon.com.be ne rémunère pas un lien amazon.fr. Le StoreID du compte
(`meilleurteste-21`) n'est pas un tag de lien et n'entre dans aucune URL.

**3. Les exports Semrush manquants.** Ceux que tu as fournis couvrent bien
la tête « robot / aspirateur piscine ». Il manque, par ordre d'utilité :
- **les seeds néerlandophones sur base BE** (`zwembadrobot`, `zwembadstofzuiger`,
  `zwembadreiniger`, `beste zwembadrobot`, `zwembadrobot draadloos`,
  `zwembadrobot kopen`, `privézwembad`) — sans eux je construis la phase NL
  à l'aveugle. Exporte BE **et** NL séparément : l'écart entre les deux me dit
  quels termes sont réellement flamands ;
- **un export par marque** en broad match (`dolphin`, `zodiac`, `aiper`,
  `wybot`, `beatbot`, `bwt`, `polaris`, `hayward`) — c'est ce qui fixe la
  liste et l'ordre de priorité des fiches modèles ;
- **Organic Research** sur `guide-piscine.fr`, `piscine-center.net`,
  `mypiscine.com`, `aqua-jardin.fr`, `hubo.be`, `brico.be`, `bol.com` — base
  BE, rapport Positions puis Pages top 100 ;
- **Keyword Gap** à 5 domaines sur base BE, filtres Missing et Weak.

**4. Deux arbitrages de ta part** :
- Réserves-tu un domaine `.be` néerlandophone maintenant ? (§2)
- Est-ce que tu prends en main au moins deux ou trois robots physiquement,
  ou est-ce que le site assume `testedInPerson: false` partout ? La réponse
  change la page `/methodologie` et l'encart de transparence, pas
  l'architecture. Les deux options sont défendables — la seconde à condition
  de la dire.

**5. Ce qui n'est pas bloquant mais utile** : ta photo et ta bio d'auteur
pour `AuthorByline` et le JSON-LD `Person`. Un site produit affilié sans
auteur nommé avec un visage et une adresse belge laisse sur la table le seul
signal E-E-A-T qu'un concurrent français ne peut pas produire.
