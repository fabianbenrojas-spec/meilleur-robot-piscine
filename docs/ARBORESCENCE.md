# Arborescence — meilleur-robot-piscine.be (be-fr)

Chaque URL de ce document est adossée à un cluster mesuré dans
`data/keywords/clusters-be-fr.csv` (2 437 requêtes ≥ 10/mois sur la base BE,
39 890 recherches/mois cumulées, issues des exports broad-match du 14/08/2026).
Les volumes cités sont des cumuls de cluster, pas des volumes de requête
unique. Les pages marquées **[GAP]** ne sont couvertes par aucun concurrent
identifié sur google.be.

Total v1 : **164 URLs FR-BE.**

---

## 0. Ce que dit la donnée, en cinq points

**1. Le head term n'est pas celui du domaine.** `aspirateur piscine` pèse
1 300/mois, `robot piscine` 1 000/mois. La famille « aspirateur » cumule
5 630/mois contre 8 260/mois pour la famille « robot ». Il faut les deux.

**2. Le sans-fil est le segment dominant, et de loin.** 3 490/mois sur 186
requêtes. C'est le cœur monétaire du site : panier élevé, intention
commerciale nette, marques Amazon disponibles (Aiper, Wybot, Beatbot,
Dolphin Liberty).

**3. Zodiac et Intex écrasent la SERP belge, et aucun des deux n'est un bon
payeur.** Zodiac cumule 3 340/mois mais se vend surtout en réseau pisciniste ;
Intex 2 610/mois sur des produits à 50-150 €. Il faut les couvrir pour
l'autorité de catégorie, la monétisation vient d'ailleurs.

**4. Le silo pièces et entretien est énorme et personne ne le tient.**
1 730/mois sur les pièces détachées, 1 100/mois sur « comment ça marche »,
630/mois sur les pannes. Zéro conversion directe, mais c'est ce qui construit
la légitimité et le trafic récurrent hors saison.

**5. La demande est massivement belge et locale.** 1 030/mois sur des
requêtes marchand (`aspirateur piscine hubo`, `brico`, `action`, `trafic`,
`decathlon`). Aucun site français ne peut adresser ça.

---

## 1. Racine et pages transverses (9)

```
/                                   comparatif maître + tableau filtrable
/methodologie/                      notation, pondérations, ce qui est testé et ce qui ne l'est pas
/a-propos/                          auteur nommé, ancrage belge
/contact/
/affiliation/                       divulgation rédigée à la main, variable par page
/sources/                           sources et dates de relevé
/mentions-legales/
/politique-de-confidentialite/
/plan-du-site/
```

**Décision d'architecture : la page money est la home.** `/` porte le
comparatif maître, le top 3, le tableau filtrable de tous les modèles et le
top 10. C'est l'URL la plus forte du domaine et c'est la requête la plus
disputée — aucune raison de diluer l'autorité sur `/comparatif/`. Le repo
aspirateurs fait exactement ça, et il convertit.

`/comparatif/` devient le hub des comparatifs segmentés.

---

## 2. Hub de désambiguïsation (4) — [GAP] majeur

```
/aspirateur-piscine/                          hub : robot, balai manuel, ou aspirateur à batterie ?
/aspirateur-piscine/manuel-balai/             ~2 010/mois — silo bas, trafic sans conversion
/aspirateur-piscine/batterie-portatif/        ~800/mois — Intex ZR100/ZR200, Kokido
/aspirateur-piscine/hydraulique-surpression/  ~140/mois — technologie ancienne, encore demandée
```

C'est le meilleur content gap du projet. La requête `aspirateur piscine`
mélange trois produits qui n'ont ni le même prix, ni le même usage, ni le
même acheteur, et aucun résultat de google.be ne le clarifie. Une page qui
sépare proprement les trois familles et route vers la bonne répond à la
question réellement posée.

Densité affiliée : basse sur le hub, nulle sur `/manuel-balai/`, moyenne sur
`/batterie-portatif/`.

---

## 3. Silo comparatifs — 22 pages

```
/comparatif/                                       hub

  ── Par technologie                               [le cœur monétaire]
/comparatif/robot-piscine-sans-fil/                3 490/mois — page pilier n° 2 après la home
/comparatif/robot-piscine-electrique-filaire/
/comparatif/robot-piscine-batterie-longue-autonomie/
/comparatif/robot-piscine-connecte-application/
/comparatif/robot-piscine-solaire/                 40/mois — section, pas page, tant que < 30

  ── Par type de bassin
/comparatif/robot-piscine-hors-sol/                1 300/mois
/comparatif/robot-piscine-tubulaire-intex-bestway/
/comparatif/robot-piscine-enterree/                400/mois
/comparatif/robot-piscine-liner/
/comparatif/robot-piscine-coque-polyester/
/comparatif/robot-piscine-carrelage/               [GAP]
/comparatif/robot-piscine-petite-piscine/          120/mois
/comparatif/robot-piscine-grande-piscine/          40/mois — section d'abord

  ── Par zone nettoyée
/comparatif/robot-piscine-fond-seul/               600/mois
/comparatif/robot-piscine-fond-parois-ligne-eau/   270/mois
/comparatif/robot-piscine-surface-feuilles/        460/mois
/comparatif/robot-piscine-escalier/                100/mois — [GAP], critère d'achat réel jamais comparé

  ── Par budget et disponibilité
/comparatif/robot-piscine-pas-cher/                820/mois
/comparatif/robot-piscine-moins-500-euros/
/comparatif/robot-piscine-moins-1000-euros/
/comparatif/robot-piscine-haut-de-gamme/
/comparatif/robot-piscine-occasion-reconditionne/  270/mois — [GAP], angle garantie légale belge
```

Chaque comparatif segmenté est une page à part entière, avec son propre
tableau filtrable et son propre verdict par profil. C'est là que se gagne la
première année : les concurrents concentrent tout sur une page géante et
laissent la segmentation entièrement libre.

---

## 4. Silo marques — 14 pages

```
/marque/                             hub
/marque/dolphin-maytronics/          1 400/mois
/marque/zodiac/                      3 340/mois — le plus gros volume de la niche
/marque/aiper/                       710/mois
/marque/wybot/                       450/mois
/marque/beatbot/                     160/mois
/marque/intex/                       2 610/mois — volume énorme, panier faible
/marque/bestway/                     590/mois
/marque/bwt/                         230/mois
/marque/hayward/                     370/mois
/marque/polaris/                     230/mois
/marque/kokido/                      170/mois
/marque/dreame/                      120/mois — nouvel entrant, à surveiller
/marque/mammotion/                   80/mois — nouvel entrant
```

**Angle propre à chaque page marque, que les concurrents n'ont pas** :
disponibilité réelle en Belgique, réseau de SAV, accès aux pièces détachées.
Dolphin et Zodiac ont un réseau pisciniste dense ; Aiper, Wybot et Beatbot
n'en ont aucun et dépendent d'un SAV par transporteur. Sur un appareil à
900 €, c'est un critère d'achat réel et personne ne le documente.

---

## 5. Silo avis — 58 fiches modèles

Convention unique : `/avis/[marque]-[modele]/`. Une seule variante, jamais
trois comme chez les concurrents.

Liste extraite des requêtes de marque + modèle ayant ≥ 10 recherches/mois sur
la base BE. Ordre de production par volume décroissant à l'intérieur de
chaque marque.

```
  ── Dolphin / Maytronics (18)
/avis/dolphin-liberty-400/        /avis/dolphin-liberty-300/
/avis/dolphin-liberty-200/        /avis/dolphin-liberty-600/
/avis/dolphin-s200/               /avis/dolphin-s300/
/avis/dolphin-s300i/              /avis/dolphin-s400/
/avis/dolphin-s100/               /avis/dolphin-e10/
/avis/dolphin-e20/                /avis/dolphin-e25/
/avis/dolphin-e30/                /avis/dolphin-m400/
/avis/dolphin-m600/               /avis/dolphin-poolstyle-40i/
/avis/dolphin-z3i/                /avis/dolphin-zenit-20/

  ── Zodiac (14)
/avis/zodiac-vortex-3/            /avis/zodiac-vortex-4-4wd/
/avis/zodiac-vortex-2/            /avis/zodiac-rc-4400/
/avis/zodiac-mx8/                 /avis/zodiac-mx9/
/avis/zodiac-mx10/                /avis/zodiac-rf-5400-iq/
/avis/zodiac-rf-5200-iq/          /avis/zodiac-alpha-oa-6600-iq/
/avis/zodiac-cnx-30-iq/           /avis/zodiac-cnx-li-52-iq/
/avis/zodiac-freedom-of-42-iq/    /avis/zodiac-voyager-re-4600-iq/

  ── Aiper (6)
/avis/aiper-scuba-s1/             /avis/aiper-scuba-s1-pro/
/avis/aiper-scuba-x1/             /avis/aiper-pilot-x1/
/avis/aiper-pilot-v2/             /avis/aiper-seagull-pro/

  ── Wybot (8)
/avis/wybot-c2/                   /avis/wybot-c2-vision/
/avis/wybot-a1/                   /avis/wybot-s2/
/avis/wybot-c1/                   /avis/wybot-c1-pro/
/avis/wybot-f1/                   /avis/wybot-osprey-200/

  ── Beatbot (2)
/avis/beatbot-aquasense-2/        /avis/beatbot-aquasense-2-pro/

  ── Intex / Bestway (6)
/avis/intex-zx300/                /avis/intex-zr100/
/avis/intex-zr200/                /avis/intex-zx100/
/avis/bestway-aquatronix-g100/    /avis/bestway-aquarover/

  ── BWT (3)
/avis/bwt-p500/                   /avis/bwt-p600/
/avis/bwt-f1/

  ── Autres (5)
/avis/dreame-z1/                  /avis/dreame-z1-pro/
/avis/polaris-280/                /avis/hayward-aquavac-600/
/avis/mammotion-spino-e1/
```

**Règle d'entrée** : une fiche est créée si le modèle est disponible chez au
moins un marchand belge, quel que soit son volume. Ces pages vivent de la
longue traîne de marque, que les outils voient mal.

**Tension à assumer** : les modèles les plus recherchés (Zodiac, Dolphin haut
de gamme) sont souvent absents ou mal servis sur Amazon.com.be. Sur ces
fiches, le `PriceTable` peut n'avoir aucune ligne Amazon. Ce n'est pas une
raison de ne pas créer la page — c'est une raison de câbler le multi-marchand
dès le départ et de dire honnêtement sur la page où le modèle s'achète en
Belgique.

---

## 6. Silo duels — 16 pages [GAP majeur]

Format le plus transactionnel, le mieux aligné sur le cookie Amazon de 24 h,
et quasi absent de la SERP belge. Convention : `/vs/[a]-vs-[b]/`.

```
  ── Duels de technologie
/vs/robot-sans-fil-vs-electrique-filaire/
/vs/robot-piscine-vs-balai-aspirateur-manuel/     [GAP] — prolonge le hub de désambiguïsation
/vs/robot-piscine-vs-nettoyeur-hydraulique/

  ── Duels intra-marque (montée en gamme)
/vs/dolphin-liberty-300-vs-liberty-400/
/vs/dolphin-e20-vs-e30/
/vs/dolphin-s200-vs-s300/
/vs/zodiac-vortex-3-vs-vortex-4/
/vs/zodiac-mx8-vs-mx9/
/vs/aiper-scuba-s1-vs-s1-pro/
/vs/wybot-c1-vs-c2/

  ── Duels inter-marques
/vs/dolphin-liberty-400-vs-aiper-scuba-s1-pro/
/vs/aiper-scuba-s1-vs-wybot-c2/
/vs/beatbot-aquasense-2-vs-dolphin-liberty-400/
/vs/wybot-c2-vs-dreame-z1/
/vs/dolphin-vs-zodiac/
/vs/aiper-vs-wybot/
```

---

## 7. Silo guides — 20 pages

```
/guide/                                              hub

  ── Choisir
/guide/comment-choisir-robot-piscine/
/guide/robot-sans-fil-ou-filaire/
/guide/quelle-autonomie-pour-mon-bassin/
/guide/finesse-de-filtration-et-pollen/             [GAP] — printemps belge
/guide/compatibilite-revetement-liner-coque-carrelage/
/guide/robot-piscine-avec-escalier-ou-pente-composee/ [GAP]

  ── Utiliser
/guide/comment-fonctionne-un-robot-de-piscine/       1 100/mois sur le cluster
/guide/premiere-mise-en-route/
/guide/frequence-de-nettoyage/
/guide/entretien-et-nettoyage-du-filtre/
/guide/hivernage-du-robot-de-piscine/
/guide/duree-de-vie-et-que-faire-quand-il-lache/

  ── Coût et achat en Belgique                       [GAP belge complet]
/guide/ou-acheter-un-robot-de-piscine-en-belgique/   1 030/mois — Hubo, Brico, Action, Trafic, bol.com, Amazon
/guide/prix-d-un-robot-de-piscine/                   820/mois
/guide/robot-piscine-d-occasion-ce-qu-il-faut-verifier/ [GAP]
/guide/garantie-legale-de-deux-ans-en-belgique/      [GAP]
/guide/sav-et-pieces-detachees-en-belgique/          [GAP] — le vrai frein d'achat
/guide/consommation-electrique-d-un-robot-de-piscine/ [GAP] — angle tarif belge
/guide/louer-plutot-qu-acheter/                      350/mois — [GAP], répond à une vraie question
/guide/robot-de-piscine-et-spa-jacuzzi/              140/mois
```

Densité affiliée basse. Ces pages portent l'autorité, le maillage et la
citabilité par les moteurs génératifs.

---

## 8. Silo problèmes — 14 pages

Trafic récurrent, zéro lien affilié sauf pièce directement pertinente.
630/mois sur le cluster, en croissance saisonnière forte d'avril à août.

```
/probleme/                                        hub
/probleme/robot-ne-monte-pas-aux-parois/
/probleme/robot-tourne-en-rond/
/probleme/robot-ne-charge-plus/
/probleme/robot-ne-demarre-plus/
/probleme/robot-perd-de-l-aspiration/
/probleme/cable-qui-s-emmele/
/probleme/robot-reste-bloque-sur-le-drain/
/probleme/robot-ne-remonte-pas-a-la-surface/
/probleme/transformateur-en-panne/                 volume net dans les exports
/probleme/robot-qui-flotte-ou-qui-ne-descend-pas/
/probleme/codes-erreur-zodiac/                     erreur 10, erreur 02 — longue traîne massive
/probleme/codes-erreur-dolphin/
/probleme/codes-erreur-aiper/
/probleme/codes-erreur-wybot/
```

Les pages de codes d'erreur par marque sont un gisement de longue traîne
non travaillé sur google.be. Une page par marque, tableau code /
signification / résolution.

---

## 9. Silo pièces et consommables — 12 pages

1 730/mois cumulés. Deuxième plus gros cluster hors tête, et intégralement
libre. Lien affilié autorisé (la pièce, pas le robot).

```
/pieces/                                          hub
/pieces/brosses-et-rouleaux/
/pieces/filtres-et-cartouches/
/pieces/chenilles-et-courroies/
/pieces/roues-et-galets/
/pieces/moteur-et-turbine/
/pieces/batterie-de-remplacement/
/pieces/transformateur-et-alimentation/
/pieces/cable-flottant/
/pieces/compatibilite-dolphin/
/pieces/compatibilite-zodiac/
/pieces/ou-trouver-des-pieces-en-belgique/         [GAP]
```

---

## 10. Outils — 5 pages

```
/outil/                                           hub
/outil/selecteur-robot-piscine/                   revêtement, forme, taille, escalier, budget → 3 recommandations
/outil/volume-de-bassin/                          m³ selon forme et profondeur
/outil/cout-electrique-annuel/                    puissance × cycles × tarif belge éditable
/outil/comparateur-modeles/                       sélection libre jusqu'à 4 modèles
```

Le sélecteur est la page de captation principale. Un calculateur ne se résume
pas, il s'utilise : c'est la meilleure défense contre les AI Overviews sur
cette niche.

Règle de conception : les hypothèses de calcul sont affichées sous le
résultat, la méthode est publiée sur `/methodologie`, et les résultats sont
donnés en fourchette. Un outil qui affiche une valeur unique ment sur sa
précision.

---

## 11. Prix et promos — 2 pages

```
/prix/                                            relevés datés, historique par modèle
/promo/                                           page saisonnière, forte valeur avril-juillet
```

Le relevé de prix **belge**, daté et affiché, est le seul actif du projet qui
ne se copie pas et qu'aucun moteur génératif ne peut inventer.

---

## 12. Récapitulatif

| Silo | Pages | Volume cluster (BE, /mois) | Densité affiliée |
|---|---|---|---|
| Racine et transverses | 9 | — | Haute sur `/` |
| Hub désambiguïsation | 4 | ~2 950 | Basse à nulle |
| Comparatifs | 22 | ~8 000 | Haute |
| Marques | 14 | ~10 700 | Moyenne |
| Avis modèles | 58 | ~1 660 direct + longue traîne | Haute |
| Duels | 16 | faible mesuré, forte conversion | Haute |
| Guides | 20 | ~3 500 | Basse |
| Problèmes | 14 | ~630 | Nulle |
| Pièces | 12 | ~1 730 | Sur la pièce uniquement |
| Outils | 5 | — | En sortie de résultat |
| Prix et promos | 2 | ~820 | Haute |
| **Total** | **164** | | |

---

## 13. Vagues de publication

La niche est saisonnière : pic d'avril à août, creux de novembre à février.
La production doit précéder la demande de huit à dix semaines.

| Vague | Contenu | Volume | Fenêtre |
|---|---|---|---|
| **V1** | Home comparatif maître, hub désambiguïsation, 6 comparatifs, sélecteur, méthodologie, à propos | 14 | Semaines 1-3 |
| **V2** | 20 fiches modèles best-sellers, 5 pages marque | 25 | Semaines 4-8 |
| **V3** | 10 comparatifs restants, 8 duels, comparateur de modèles | 19 | Semaines 9-12 |
| **V4** | Silo problèmes complet + codes erreur, silo pièces | 26 | Semaines 13-16 |
| **V5** | 38 fiches modèles restantes, 9 marques | 47 | Semaines 17-24 |
| **V6** | Guides belges, prix, promos, 8 duels restants | 33 | Mois 7-10 |
| **V7** | Version `be-nl` | ~70 | Mois 10-16 |

**Contrainte de calendrier** : les pages de la V1 à la V3 doivent être
indexées **avant fin mars**. Après, la saison est commencée et l'indexation
arrive trop tard — un pic manqué se paie un an.

---

## 14. Périmètre de la phase néerlandophone (~70 pages)

Le miroir NL n'est pas complet. On adapte les 40 % de pages qui portent 80 %
du revenu, avec un cluster propre validé sur la base BE néerlandophone —
**pas une traduction**.

Segments d'URL traduits (à déclarer dans `config/routes/be-nl.ts`) :

| FR | NL |
|---|---|
| `/comparatif/` | `/vergelijking/` |
| `/avis/` | `/review/` |
| `/marque/` | `/merk/` |
| `/vs/` | `/vs/` |
| `/guide/` | `/gids/` |
| `/probleme/` | `/probleem/` |
| `/pieces/` | `/onderdelen/` |
| `/outil/` | `/tool/` |
| `/prix/` | `/prijzen/` |

Termes pivots à valider par export Semrush BE avant toute rédaction :
`zwembadrobot`, `zwembadstofzuiger`, `zwembadreiniger`, `zwembadrobot
draadloos`, `beste zwembadrobot`, `zwembadrobot kopen`.

**Piège de vocabulaire connu** : en néerlandais, `zwembad` seul renvoie
massivement vers les piscines publiques. La qualification commerciale passe
par `privézwembad`, `opzetzwembad` et `inbouwzwembad`. Sans ça, les clusters
sont construits à l'envers et le trafic capté est celui des piscines
communales.

Marchands prioritaires côté NL : bol.com et Coolblue passent devant Amazon
dans les tableaux de prix. Hubo, Brico et Gamma pour le retail physique.
