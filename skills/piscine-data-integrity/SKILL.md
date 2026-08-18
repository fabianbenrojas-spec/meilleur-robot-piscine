---
name: piscine-data-integrity
description: >-
  Garantit l'intégrité des données de meilleur-robot-piscine.be : règle « zéro
  chiffre en prose », provenance sourcée et datée de chaque fait, fraîcheur des
  prix relevés, et validation de la demande avant toute création de page. À
  utiliser dès qu'un contenu mentionne un prix, une surface, une autonomie, un
  débit, une finesse de filtration, une note ou n'importe quel nombre ; dès
  qu'on cite un fait constructeur ; dès qu'on décide si une page mérite
  d'exister. Consulter si l'utilisateur dit « ajoute ce chiffre », « cite cette
  source », « valide le mot-clé », ou si un nombre est sur le point d'apparaître
  dans le corps de texte — mettre un chiffre directement en prose au lieu d'un
  composant adossé à data/products est la régression la plus fréquente du projet.
---

# Intégrité des données — meilleur-robot-piscine.be

Quatre garde-fous. Ils portent toute la crédibilité E-E-A-T du site.

---

## Garde-fou 1 — Zéro chiffre en prose

Tout prix, surface couverte, longueur de câble, autonomie, débit de
filtration, finesse en microns, poids, puissance, note vient d'un composant
alimenté par `data/products/*.json`.

- Interdit : « le Scuba S1 Pro tient environ 150 minutes et filtre à 130
  microns »
- Correct : `<SpecsTable product="aiper-scuba-s1-pro" />` et une prose qui
  commente sans chiffrer — « son autonomie couvre confortablement un bassin
  familial en une passe, et sa filtration descend assez fin pour retenir le
  pollen de printemps »

Un chiffre en dur se périme en silence et finit par contredire le composant
d'à côté. Quand la donnée change dans le JSON, la prose ment.

**Auto-contrôle avant de valider une page** : relire chaque paragraphe et se
demander « ce nombre peut-il changer ? ». Si oui, composant. Si un chiffre
semble indispensable en prose, c'est qu'il manque un champ au schéma produit
— l'ajouter à la source, jamais au texte.

Vérification mécanique : `node scripts/check-placeholders.mjs` signale les
suites de chiffres en prose MDX hors composant.

**Exception unique** : les nombres qui ne sont pas des données produit et qui
ne peuvent pas changer — « les trois familles d'aspirateurs », « la garantie
légale de deux ans ». La garantie légale est une règle de droit, pas une
spec ; elle peut rester en prose.

---

## Garde-fou 2 — Source unique et datée

Chaque fait produit porte `sourceUrl` + `sourcedAt`. Chaque prix porte
`priceCheckedAt`. Structure `Sourced<T>` dans `data/product.schema.ts`.

Règles :

1. **Une donnée = une source officielle.** Le constructeur pour les specs, la
   fiche marchand pour le prix et la disponibilité. Jamais un agrégateur,
   jamais un autre comparateur, jamais une fiche Amazon rédigée par un
   vendeur tiers quand la fiche constructeur existe.
2. **Si la source ne confirme pas : `null`.** La page affiche « non
   communiqué ». Ne jamais estimer, ne jamais interpoler depuis un modèle
   voisin de la même gamme. Ce refus d'inventer, affiché, est un signal de
   crédibilité plus fort qu'une valeur approximative.
3. **Ne jamais écraser une source précise par une source générique.** Une
   re-vérification sans changement met à jour `sourcedAt` seulement.
4. **Les prix vieillissent.** `check-prices` échoue au-delà de 90 jours sur
   une fiche active. Le prix relevé daté est le signal de fraîcheur le plus
   lisible qui existe pour Google — et le seul actif du site qui ne se copie
   pas.

**Piège propre à cette niche** : les constructeurs annoncent une « surface
maximale » calculée dans des conditions idéales, comme les fabricants de
robots tondeuses. Sur un bassin réel avec escalier, angles et pente
composée, la couverture effective est inférieure. Ne jamais présenter la
surface annoncée comme une performance mesurée — la nommer pour ce qu'elle
est : une valeur constructeur.

---

## Garde-fou 3 — Notes et tests

`overallRating` est calculée par `computeOverallRating()` depuis `scores` et
`RATING_WEIGHTS`. Jamais saisie à la main. Jamais une moyenne d'avis Amazon
recopiée.

Trois obligations :

1. La méthode et les pondérations sont publiées sur `/methodologie`. Modifier
   `RATING_WEIGHTS` implique de mettre à jour cette page dans la même PR.
2. La note balisée en JSON-LD est celle qui est visible sur la page. Jamais
   de note balisée invisible.
3. `testedInPerson: false` déclenche l'encart de transparence, qui dit
   explicitement : évaluation sur specs constructeur, retours utilisateurs et
   comparaison de gamme, sans test physique.

Google a interdit les avis faux ou incités non divulgués, dans le contenu
comme dans le balisage. Une note inventée n'est plus seulement malhonnête,
c'est un motif de perte d'éligibilité aux rich results.

---

## Garde-fou 4 — Validation de la demande

Aucune page sans cluster validé dans `data/keywords/clusters-be-fr.csv`.
Seuils dans `CLAUDE.md` §5.

Trois précisions propres à ce projet :

**Le cluster compte, pas la requête.** Un cluster de 40 requêtes à 20
recherches/mois bat une requête isolée à 800 sur ce type de site. Le critère
de sélection est le nombre de requêtes distinctes à intention commerciale.

**La base BE est mince et ment par défaut.** Beaucoup de combinaisons réelles
y sortent à zéro alors qu'elles convertissent. C'est pour ça que la règle de
la fiche modèle existe : disponible chez un marchand belge = page créée, même
à volume nul.

**Le seuil se recalibre après trois mois de Search Console.** C'est la Search
Console filtrée sur la Belgique, pas Semrush, qui donne la vraie demande
belge. Le rapport de requêtes révèle des expressions qu'aucun outil ne
remonte — c'est la raison pour laquelle il faut publier tôt plutôt
qu'analyser longtemps.

---

## Cas particuliers de la niche

**Les tests de robot de piscine ne sont pas mesurables comme un débit VPN.**
Il n'y a pas d'équivalent Ookla ici. Les signaux d'Expérience disponibles
sont d'un autre ordre : prix relevé chez un marchand belge nommé et daté,
disponibilité réelle vérifiée, fait négatif assumé, cas belge précis. Ne
jamais simuler une mesure qui n'a pas eu lieu.

**Les avis Amazon ne sont pas une donnée.** Ils peuvent nourrir une
observation qualitative — « les retours utilisateurs mentionnent souvent
l'usure de la brosse » — mais ne se citent jamais comme un chiffre, ne se
balisent jamais en `AggregateRating`, et ne remplacent jamais la note maison.

**La compatibilité prime sur le prix.** Sur cette niche, le critère d'achat
le plus discriminant est la compatibilité avec le revêtement, la forme, la
pente et l'escalier — et c'est ce que les revendeurs traitent le plus mal.
Chaque champ `compatibility` non documenté par le constructeur reste vide et
la page le dit.
