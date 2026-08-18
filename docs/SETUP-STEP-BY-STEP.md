# Mise en place — pas à pas

De « j'ai un nom de domaine » à « la première page est en ligne et indexée ».
Compte deux soirées pour les phases 1 à 4, puis le rythme de production.

---

## Phase 0 — Ce que tu as déjà

| Élément | État |
|---|---|
| Domaine `meilleur-robot-piscine.be` | Acheté |
| Compte Amazon Partenaires `.com.be` | Actif |
| Tracking ID | `meilleur-robot-piscine06-21` — câblé dans `config/markets/be-fr.ts` |
| StoreID du compte | `meilleurteste-21` — **ne jamais mettre dans une URL** |
| Exports Semrush | Traités, clusters dans `data/keywords/` |

Sur le StoreID : c'est l'identifiant de ton compte Partenaires, pas un tag de
lien. Le paramètre `?tag=` d'une URL Amazon prend le **tracking ID**. Mettre
le StoreID à la place fait perdre l'attribution silencieusement — le lien
fonctionne, la commission part ailleurs.

Le tracking ID est spécifique à ce site : c'est ce qui te permettra de
comparer les revenus par site sans démêler un rapport unique.

---

## Phase 1 — Le repo (30 min)

### 1.1 Scaffolder Next.js

```bash
cd ~/dev   # ou l'endroit où tu ranges tes projets

npx create-next-app@latest meilleur-robot-piscine \
  --typescript --tailwind --eslint --app --no-src-dir \
  --import-alias "@/*" --turbopack --use-npm --yes

cd meilleur-robot-piscine
```

### 1.2 Poser le scaffold par-dessus

Le `-o` écrase sans demander : c'est voulu, le scaffold remplace
`package.json`, `next.config.ts`, `.gitignore` et `README.md`.

```bash
unzip -o ~/Downloads/mrp-scaffold-v2-2026-08-18.zip -d .
npm install
```

### 1.3 Vérifier avant de committer

```bash
npm run preflight     # doit afficher : 0 erreur(s)
npm run check:all     # les cinq contrôles
npx tsc --noEmit      # zéro erreur de typage
```

`preflight` est le seul qui compte à ce stade : il vérifie que les dix
mécanismes canoniques existent, qu'aucun script déclaré n'est fantôme, qu'il
n'y a ni client de base de données, ni `next/image`, ni `revalidate`, et que le
tracking ID est renseigné.

### 1.4 Créer le dépôt et pousser

Dépôt **privé**, sans README ni `.gitignore` ni licence — le scaffold les
contient.

```bash
git init
git add -A   # SEULE exception tolérée : le commit initial
git commit -m "chore: socle, doctrine, arborescence et clusters be-fr"
git branch -M main

gh repo create meilleur-robot-piscine --private --source=. --remote=origin
git push -u origin main
```

Sans `gh` :

```bash
git remote add origin git@github.com:<toi>/meilleur-robot-piscine.git
git push -u origin main
```

Après ce commit, `git add -A` est interdit — toujours des chemins explicites.

### 1.5 Protéger `main`

Settings → Branches → Add rule sur `main` : PR obligatoire, status checks
requis (`checks`), pas de push direct.

## Phase 2 — Vercel, coût et domaine (40 min)

### 2.1 Créer le projet

vercel.com → **Add New → Project → Import** le dépôt GitHub. Framework détecté :
Next.js. Ne rien changer aux commandes de build : `vercel.json` les fixe déjà.

### 2.2 Poser le plafond de dépense AVANT tout déploiement

**Settings → Billing → Spend Management.** Fixer un montant maximal et activer
la mise en pause des projets au dépassement.

C'est le seul garde-fou qui agit sans toi, et c'est l'étape que tout le monde
saute. Tous les récits de facture à trois chiffres commencent par « je n'avais
jamais regardé le tableau de bord d'usage ».

### 2.3 Palier de machine de build

**Settings → Build and Deployment → Build Machine.** Descendre au palier le
moins cher qui tienne le temps de build. Le palier rapide est activé par défaut
et coûte plusieurs fois le prix, pour un gain nul sur un SSG de 164 pages.

### 2.4 Ignored Build Step

Même écran, champ **Ignored Build Step** :

```bash
bash scripts/ignored-build-step.sh
```

Une correction de `DECISIONS.md` ou de documentation n'a pas à déclencher un
build. À neuf déploiements, c'est le poste qui dérape le plus vite.

### 2.5 Variables d'environnement

**Settings → Environment Variables.**

Sur les trois environnements (Production, Preview, Development) :

```
MARKET = be-fr
```

Sur **Production uniquement**, pour l'instant :

```
SITE_LAUNCHED = false
```

Tant que cette variable n'est pas `true`, `app/robots.ts` renvoie un
`Disallow: /` global. On ne laisse pas Google indexer un site à trois pages.
Tu la passeras à `true` quand les 14 pages de la vague 1 seront en ligne.

Le tracking ID Amazon n'est **pas** ici : il vit dans
`config/markets/be-fr.ts`, versionné et relu en PR. Ce n'est pas un secret — il
est public dans chaque URL sortante — et une variable oubliée sur un nouveau
projet produirait des liens sans attribution.

### 2.6 Protéger les previews

**Settings → Deployment Protection → Vercel Authentication** sur les
préproductions. Sans ça, tes branches de contenu sont crawlables et tu crées du
duplicate content contre ton propre site. C'est un coût SEO, pas financier,
mais plus lourd que la facture.

### 2.7 Brancher le domaine

**Settings → Domains → Add** : `www.meilleur-robot-piscine.be`, puis
`meilleur-robot-piscine.be`.

`www` en domaine canonique, apex redirigé en 308 par Vercel.

Chez ton registrar `.be` :

```
Type    Nom     Valeur
CNAME   www     cname.vercel-dns.com
A       @       76.76.21.21
```

Vérifier la propagation :

```bash
dig +short www.meilleur-robot-piscine.be
dig +short meilleur-robot-piscine.be
```

Vercel émet le certificat automatiquement une fois les DNS résolus.

### 2.8 Redéploiement mensuel programmé

**Settings → Git → Deploy Hooks**, créer un hook sur `main` nommé
`monthly-freshness`. Le brancher sur un cron (GitHub Actions `schedule`,
cron-job.org, ou n'importe quel planificateur) au 1er de chaque mois.

En 100 % SSG, `{{MONTH_YEAR}}` est résolu au build. Sans redéploiement, un site
non touché pendant quatre mois annonce un mois périmé dans ses titles — ce qui
abîme précisément le signal de fraîcheur qu'ils produisent.

## Phase 3 — Search Console et mesure (20 min)

### 3.1 Search Console

Ajouter une propriété **Domaine** (pas Préfixe d'URL) :
`meilleur-robot-piscine.be`. Validation par enregistrement TXT chez le
registrar. La propriété Domaine couvre www, apex, http et https d'un coup.

Fais-le **maintenant**, avant la mise en index. L'historique commence le jour
où la propriété existe, pas le jour où tu la consultes.

### 3.2 Le filtre qui compte

Dès les premières impressions, dans **Performances**, crée un filtre
sauvegardé sur **Pays = Belgique**. C'est ta vraie source de demande, bien
plus fiable que Semrush sur ce marché : la base BE est mince et beaucoup de
requêtes qui convertissent y sortent à zéro.

C'est aussi la Search Console qui te dira, vers le troisième mois, s'il faut
recalibrer le seuil de 30 recherches/mois du `CLAUDE.md` §5.

### 3.3 Analytics

Vercel Analytics suffit au départ, ou Plausible si tu veux du RGPD-friendly
sans bandeau. Ce qu'il faut mesurer en priorité n'est pas le trafic mais le
**taux de clic sortant par gabarit** : c'est lui qui dit quel type de page
mérite d'être produit ensuite.

---

## Phase 4 — Le catalogue (2 à 3 soirées, en parallèle)

C'est le vrai goulot du démarrage. Pas le code.

### 4.1 Remplir les 20 premiers modèles

Ouvre `data/catalogue-a-remplir.csv`. Les 62 lignes sont déjà triées par
volume de recherche belge. Filtre sur `priorite_vague = V2` : ce sont les 20
à faire d'abord.

Protocole complet dans `docs/CATALOGUE-AMAZON-BE.md`. Les trois règles qui
comptent :

- **Les specs viennent du constructeur, jamais d'Amazon.** Les fiches Amazon
  sont écrites par des vendeurs et comportent des specs recopiées d'un autre
  modèle.
- **Une valeur non publiée reste vide.** Elle deviendra `null` et la page
  affichera « non communiqué ». Ne jamais estimer, ne jamais interpoler depuis
  un modèle voisin.
- **Le prix porte sa date de relevé.** `check-prices` échoue au-delà de
  90 jours.

### 4.2 Récupérer un ASIN

Sur la fiche Amazon.com.be, l'ASIN est dans l'URL, entre `/dp/` et le `/`
suivant : `amazon.com.be/…/dp/**B0C1XYZ234**/…`. C'est tout ce qu'il faut :
`lib/affiliate.ts` reconstruit l'URL canonique et y attache ton tracking ID.
Ne colle pas l'URL longue avec ses paramètres de tracking, elle serait
nettoyée de toute façon.

### 4.3 Le cas fréquent : le modèle n'est pas sur Amazon.com.be

Ça arrive beaucoup sur Zodiac et le haut de gamme Dolphin, qui se vendent en
réseau pisciniste. Laisse les colonnes Amazon vides et **crée quand même la
fiche**. Elle vit de la longue traîne de marque, et dire honnêtement où le
modèle s'achète en Belgique est exactement ce qui distingue le site des
comparateurs qui inventent une disponibilité.

### 4.4 Générer les JSON

```bash
npm run import:catalogue -- data/catalogue-a-remplir.csv
```

Un fichier par produit dans `data/products/`. Le script refuse d'écrire si un
prix est présent sans date, si une valeur est présente sans URL constructeur,
ou si un relevé a plus de 90 jours.

Les champs éditoriaux — `scores`, `pros`, `cons`, `verdict`,
`testedInPerson` — ne sont **jamais** importés depuis le CSV. Ils s'écrivent à
la main, page par page, au moment de la rédaction.

---

## Phase 5 — La première page (une soirée)

Prends la home, puisque c'est la page money du site.

```bash
git checkout -b content/home
```

Dans une session Claude Code, à la racine du repo :

```
/reprise
```

Puis :

```
Crée la home de meilleur-robot-piscine.be.
Silo : home. Cluster : tête « robot piscine » + « meilleur robot piscine ».
Suis docs/TEMPLATES-PAGES.md §1 pour la séquence des 13 blocs,
docs/SEO-GEO-REDACTION.md pour la structure et la voix.
Analyse d'abord la SERP google.be sur « meilleur robot piscine » et écris le
content gap dans DECISIONS.md avant d'écrire la première ligne.
```

Claude Code lit `CLAUDE.md` automatiquement, charge `humaniser-fr` en mode
production, et refusera de rédiger sans content gap documenté. C'est voulu.

Avant la PR :

```bash
npm run check:all
```

Cinq contrôles. `check-placeholders` est celui qui attrapera le plus de
choses au début — la règle « zéro chiffre en prose » est contre-intuitive et
c'est la régression n° 1 du projet.

---

## Phase 6 — Ordre de production

`docs/ARBORESCENCE.md` §13 donne les sept vagues. Les 14 premières pages :

1. Home — comparatif maître
2. `/aspirateur-piscine/` — le hub de désambiguïsation
3. `/comparatif/robot-piscine-sans-fil/` — 3 490/mois, le plus gros segment
4. `/comparatif/robot-piscine-hors-sol/` — 1 300/mois
5. `/comparatif/robot-piscine-pas-cher/`
6. `/comparatif/robot-piscine-fond-parois-ligne-eau/`
7. `/comparatif/robot-piscine-escalier/` — [GAP], critère jamais comparé
8. `/comparatif/robot-piscine-enterree/`
9. `/outil/selecteur-robot-piscine/` — la page de captation
10. `/methodologie/`
11. `/a-propos/` — auteur nommé, ancrage belge
12. `/affiliation/` — rédigée à la main, pas de boilerplate
13. `/guide/ou-acheter-un-robot-de-piscine-en-belgique/` — 1 030/mois, [GAP]
14. `/guide/comment-choisir-robot-piscine/`

Quand ces 14 sont en ligne : passe `SITE_LAUNCHED=true` sur Vercel, soumets
le sitemap dans Search Console, et demande l'indexation de la home.

**Contrainte de calendrier.** La saison va d'avril à août et l'indexation
prend des semaines. Les vagues 1 à 3 doivent être en ligne **avant fin
mars**. Un pic manqué se paie un an.

---

## Phase 7 — Rythme de croisière

| Fréquence | Action |
|---|---|
| Par page | Branche + PR, content gap dans `DECISIONS.md`, `check:all` vert |
| Hebdomadaire | Relevé de prix sur les fiches actives (bimensuel d'avril à août) |
| Mensuel | Search Console filtrée Belgique — quelles requêtes sortent que Semrush ne voyait pas |
| Mensuel | `skills/geo-monitoring` — est-ce que Perplexity et ChatGPT citent le site |
| À 20 pages indexées | Candidater aux programmes marque : Maytronics, Aiper, Beatbot, Wybot |

Ce dernier point est le plus rentable du tableau. Sur un panier de 1 200 €,
l'écart entre Amazon et un programme constructeur est d'un facteur 2 à 4 —
plus que ce que rapporteraient 50 pages supplémentaires.

---

## Ce qui reste ouvert

- **Le domaine néerlandophone.** Décidé : **déploiement à part entière** —
  son propre domaine, son propre projet Vercel, son propre contenu issu de son
  propre cluster. Mais **sur ce repo**, avec `MARKET=be-nl`. Jamais un repo
  séparé : trois repos divergent, et c'est très exactement ce qui a produit le
  `verdict_court` / `verdict_kort` du réseau aspirateurs. Réserve le nom
  (`zwembadrobot.be` ou équivalent) pendant qu'il est libre.
- **Ta photo et ta bio d'auteur**, pour `AuthorByline` et le JSON-LD
  `Person`. Un site produit affilié sans auteur nommé laisse sur la table le
  seul signal E-E-A-T qu'un concurrent français ne peut pas produire.
- **La question du test physique.** Est-ce que tu prends deux ou trois robots
  en main, ou est-ce que le site assume `testedInPerson: false` partout ? Les
  deux options sont défendables. La seconde à condition de le dire — elle
  change `/methodologie` et l'encart de transparence, pas l'architecture.
