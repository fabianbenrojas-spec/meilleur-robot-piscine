# Guide SEO & GEO — rédaction meilleur-robot-piscine.be

> Version 1.0 · Marché fr-BE · Adapté de la doctrine meilleur-vpn.be, avec ce
> que change le passage d'un comparateur de services à un comparateur de
> produits physiques.

À lire avant la première ligne de toute page. À lire aussi :
`docs/AUTHOR-*.md` (la voix qui signe). À activer en parallèle :
`skills/humaniser-fr` en mode production, `skills/boileau` en review finale.

Ce guide décide **quoi écrire et comment le structurer**. Le câblage dans le
code est ailleurs : `skills/piscine-page-creation` (scaffolding, frontmatter),
`skills/piscine-data-integrity` (zéro chiffre en prose, sources datées),
`skills/piscine-maillage-jsonld` (liens bidirectionnels, JSON-LD).

---

## 0. Workflow obligatoire — brief → outline → SERP → rédaction

Ne jamais écrire la première phrase sans avoir validé les trois.

### 0.1 Brief

```
## Brief — [titre provisoire]
- Silo : comparatif · avis · vs · marque · guide · probleme · pieces · outil
- Cluster : thème + sous-thème
- Head term cible : validé contre data/keywords/clusters-be-fr.csv
- Volume + KD : repris du CSV. Sous les seuils du CLAUDE.md §5, on ne crée pas.
- Longue traîne : 3-5 requêtes satellites du même cluster
- Persona dominant : propriétaire de piscine enterrée · propriétaire hors-sol
  ou tubulaire · nouveau propriétaire qui hérite d'un bassin · acheteur en
  remplacement d'un robot mort · bricoleur qui répare
- Intention : informationnelle / commerciale / transactionnelle / support
- Format : voir docs/TEMPLATES-PAGES.md
- Concurrents directs : 3 URLs google.be analysées (cf. §0.3)
- Content gap : l'angle que personne ne couvre — LA raison d'exister de la page
- Angle belge : marchand local (Hubo, Brico, Gamma, Hornbach, Action, Trafic,
  bol.com, Coolblue), garantie légale de 2 ans, SAV et pièces en Belgique,
  dureté de l'eau par commune, tarif électrique et capacitaire, urbanisme
  Wallonie/Flandre/Bruxelles, saison de baignade réelle
- Sources autorité prévues : 2-4 (constructeur, .be officiel, SPF Économie)
- FAQ in-flow H3 prévues : 3-5
- Schemas JSON-LD : selon le gabarit
```

### 0.2 Outline

H1/H2/H3 sans rédaction du corps, validé avant d'écrire.

```
H1 — head term + différenciateur, ≤ 60 caractères, {YEAR} dynamique
  Chapô 40-60 mots — réponse directe à l'intention
  TL;DR — 3-5 bullets (obligatoire dès 400 mots, via frontmatter tldr:)

H2 — [question, formulée comme l'utilisateur la tape] ?
  Réponse directe < 60 mots
  H3 — sous-angle
  H3 — FAQ in-flow

H2 — [question 2]
  …

H2 — FAQ (JSON-LD FAQPage généré depuis le frontmatter faq:)
[Encart Key Takeaways après le H2 majeur central]
AuthorCard
```

### 0.3 Analyse SERP — obligatoire

Identifier les 3 premiers résultats google.be sur le head term. Pour chacun :
titre exact, chapô, longueur estimée, H2 visibles, présence de FAQ, données
affichées, angle.

**C'est de cette analyse que sort le content gap.** Le documenter noir sur
blanc dans `DECISIONS.md` :

> « Aucun éditorial .be indépendant qui [X]. Les concurrents traitent [Y]
> mais aucun ne [Z]. Différenciateur retenu : [gap]. »

Ne jamais inventer ce que disent les concurrents. Si la SERP ne peut pas être
analysée, on ne rédige pas.

---

## 1. Philosophie

Une seule question : *pourquoi lire cette page plutôt qu'une autre ?*

Trois mots : **expertise, preuve, utilité.**

Posture : un expert qui parle à un pair légèrement moins avancé. Direct,
parfois opinioné, jamais neutre au point d'être creux.

**Le contexte concurrentiel est particulier sur cette niche.** Les acteurs en
place sont des revendeurs — piscinistes, magasins de bricolage, boutiques
spécialisées. Ils ont de l'autorité et de l'ancienneté, mais ils ne peuvent
pas être neutres sur une comparaison de technologies ni sur le coût réel
d'exploitation. Le site occupe cette place vide, avec des données et des
mesures, pas des arguments de vente. À l'inverse, les éditoriaux français
récents écrivent bien mais ne savent rien de la Belgique.

Le différenciateur du site tient en trois choses : le prix belge relevé et
daté, la disponibilité réelle chez les marchands belges, et l'aveu de ce qui
n'a pas été testé.

---

## 2. Marché et entités

- **Marché** : Belgique francophone (fr-BE). Moteurs : google.be, bing.be.
- **Moteurs génératifs cibles** : ChatGPT, Perplexity, Gemini, Claude,
  Copilot, Google AI Overviews.
- **Entités nommées prioritaires** :
  - Marques : Dolphin/Maytronics, Zodiac, Aiper, Wybot, Beatbot, BWT, Intex,
    Bestway, Polaris, Hayward, Kokido, Dreame, Mammotion
  - Technique : robot électrique, hydraulique, à surpression, brosse PVC vs
    mousse, finesse de filtration en microns, débit de filtration, cycle,
    gyroscope, cartographie, câble antitorsion, chariot, liner, coque
    polyester, ligne d'eau, skimmer, pente composée
  - Belgique : Hubo, Brico, Gamma, Hornbach, Action, Trafic, Aveve, bol.com,
    Coolblue, Amazon.com.be · garantie légale de conformité de 2 ans (SPF
    Économie) · droit de rétractation de 14 jours

---

## 3. Anti-patterns IA — lexicaux et structurels

Les tics lexicaux généraux sont couverts par `skills/humaniser-fr` et
`skills/boileau`. Ici on ajoute ce qui est propre à la niche et aux
structures qui simulent l'expérience.

### 3.1 Clichés piscine à bannir

*une eau cristalline toute l'année*, *le plaisir de la baignade sans les
contraintes*, *transformez votre piscine en oasis*, *l'entretien devient un
jeu d'enfant*, *fini la corvée du nettoyage*, *votre piscine impeccable sans
effort*, *prolongez la saison de baignade* employé mécaniquement, *le
compagnon idéal de votre bassin*, *la propreté au bout des doigts*.

### 3.2 Transverses à bannir

*véritable* antéposé, *incontournable*, *révolutionnaire*, *crucial*,
*essentiel*, *ne fait aucun compromis*, *rapport qualité-prix imbattable*,
*Dans le monde actuel…*, *À l'ère du…*, *Il est important de noter que…*,
*Nous allons voir dans cet article…*.

### 3.3 Titres et H2 à bannir

Tout ce qui annonce l'authenticité par la forme : *Mon avis honnête sur…*,
*Verdict final*, *Le piège à éviter*, *Sans langue de bois*, *Le vrai test*,
*Faut-il craquer ?*, *Ce que les vendeurs ne veulent pas que vous sachiez*,
*Ce qu'il faut savoir sur…*, *Ce que personne ne vous dit*.

**Test** : remplace le H2 par 💥. Si le paragraphe garde son sens, c'est
clickbait, pas factuel.

### 3.4 H2 déclaratifs propres — les 30 % autorisés

Un H2 déclaratif annonce une donnée ou une catégorie, jamais un sentiment.

Corrects : *Critères d'évaluation utilisés*, *Compatibilité par type de
revêtement*, *Prix relevés chez les marchands belges*, *Trois vérifications
avant d'acheter d'occasion*.

Interdits : *Notre verdict honnête*, *Le détail qui change tout*, *Ce qui
m'a surpris*.

### 3.5 Fausses affirmations produit — drapeau E-E-A-T

À ne jamais écrire tel quel : *un robot remplace totalement l'entretien de
l'eau*, *plus besoin de traiter votre piscine*, *nettoie 100 % du bassin*,
*compatible avec toutes les piscines*.

Formuler juste : un robot ramasse les débris et brosse les surfaces ; il ne
remplace ni le traitement chimique, ni la filtration, ni le passage à
l'épuisette après un orage. La compatibilité dépend du revêtement, de la
forme, de la présence d'un escalier et de la pente du fond — c'est justement
le critère le plus mal traité par les revendeurs.

### 3.6 Ponctuation et typographie

- Tiret cadratin : max 3 par page
- Guillemets « » avec espaces insécables, apostrophe courbe `'`
- Espace insécable avant `:` `;` `?` `!`
- Accents sur les majuscules : *État*, *À propos*
- Pas de virgule avant « et » dans une énumération
- Un gras par paragraphe maximum
- Aucun émoji dans les titres ou les puces
- Pas de liste à puces à en-tête en gras systématique — c'est la signature
  visuelle la plus reconnaissable des LLM

### 3.7 Conclusions de section

Pas de phrase-pont (*Maintenant que nous avons vu X, passons à Y*), pas de
résumé qui répète, pas de question rhétorique transitionnelle. Une section
termine sur sa dernière info utile ; le H2 suivant attaque directement.

---

## 4. Structure SEO

### 4.1 Hiérarchie des titres

```
H1 — unique, mot-clé principal, max 60 caractères
  H2 — sous-thèmes majeurs, ≥ 70 % en forme de question
    H3 — précisions, FAQ in-flow, cas particuliers
```

Règle des 70 % stricte. Comptent : *Faut-il…*, *Quel…*, *Comment…*,
*Pourquoi…*, *Est-ce que…*, *Combien…*, *X ou Y : lequel choisir ?*

### 4.2 Titles et meta

| Type | Format title | Format description |
|---|---|---|
| Home | Meilleur robot de piscine en Belgique {YEAR} \| meilleur-robot-piscine.be | Comparatif indépendant. Prix belges relevés, compatibilité par bassin, SAV local. |
| Comparatif | Meilleur robot de piscine [segment] {YEAR} \| … | [Réponse directe]. Modèles comparés, prix belges, verdict par profil. Max 155 car. |
| Fiche modèle | [Modèle] : test et avis {YEAR} \| … | Analyse complète. Filtration, autonomie, compatibilité, prix belge. Verdict. |
| Duel | [A] ou [B] {YEAR} : lequel choisir ? \| … | Comparaison critère par critère. Verdict par profil. |
| Marque | Robots [Marque] : gamme, avis et SAV en Belgique {YEAR} \| … | Toute la gamme comparée. Disponibilité, garantie et pièces en Belgique. |
| Guide | [Mot-clé] : [bénéfice] {YEAR} \| … | [Réponse à l'intention]. Cas belge concret. Max 155 car. |
| Problème | [Symptôme] : causes et solutions \| … | Diagnostic étape par étape. Ce qui se répare, ce qui ne se répare pas. |
| Outil | [Outil] gratuit \| … | [Ce que fait l'outil]. Résultat immédiat, sans inscription. |

Title : 50-60 caractères, mot-clé en début, différenciateur en fin.
Meta description : 140-155 caractères, mot-clé + variante, verbe d'action.
Slug : kebab-case, mot-clé en tête, sans stop-words.

### 4.3 Longueurs cibles

| Gabarit | Mots | FAQ minimum |
|---|---|---|
| Home | 1 500-2 500 | 8 |
| Comparatif | 1 500-2 500 | 6 |
| Fiche modèle | 1 200-2 000 | 6 |
| Duel | 1 200-1 800 | 6 |
| Marque | 1 200-1 800 | 6 |
| Guide | 1 200-1 800 | 6 |
| Problème | 800-1 400 | 4 |
| Outil (contenu sous l'outil) | 600-1 200 | 4 |

Densité : paragraphes de 3-5 phrases, phrases de 15-25 mots avec variation,
ratio 70 % prose / 30 % blocs structurés.

**Règle des 3 premiers paragraphes** : mot-clé principal + définition
contextuelle + promesse de valeur, avant le premier H2.

### 4.4 Maillage interne

Voir `docs/TEMPLATES-PAGES.md` §10 pour la matrice complète. Règles
éditoriales complémentaires :

- Minimum 2 liens internes contextuels vers des piliers par page
- Minimum 1 lien réciproque déclaré dans `data/internal-links.ts`
- Maximum 6 liens internes contextuels par page
- Maximum 1 lien externe par 500 mots, sources d'autorité uniquement
- Ancres descriptives et variées, jamais « cliquez ici »
- Contenu replié : render-then-hide en CSS, jamais de conditional render

---

## 5. Critères GEO

Les moteurs génératifs ne cherchent pas la page qui « matche », ils cherchent
la source qui mérite d'être citée.

### 5.1 Citabilité par chunk

Chaque H2 doit pouvoir être copié seul dans une conversation IA et faire
sens, sans « voir plus haut » ni pronom dont le référent est ailleurs.

### 5.2 Pattern réponse - explication - exemple

Structure obligatoire de chaque H2 :

1. Réponse directe à la question du H2, moins de 60 mots
2. Explication, contexte, nuance — 2 à 4 paragraphes
3. Exemple concret, cas belge, ou donnée mesurée rendue par composant

Les LLM extraient la première réponse. L'ordre inverse est nettement moins
cité.

Exemple :

> **H2 — Un robot de piscine fonctionne-t-il sur une piscine hors-sol ?**
> Oui, mais pas n'importe lequel. Les bassins hors-sol ont un fond plat, des
> parois souples et une faible profondeur : un robot conçu pour grimper aux
> parois d'une piscine enterrée y perd son temps, et son poids peut déformer
> le liner. *(réponse < 60 mots)*
> [explication : fond plat vs pente composée, adhérence, poids…]
> [exemple : la gamme Intex ZX vise exactement ce cas — rendu via `<SpecsTable>`]

### 5.3 Signaux de définition

Une définition par concept central, dans les 200 premiers mots :
*X désigne…*, *X est défini comme…*, *Concrètement, X signifie…*

Concepts à définir proprement : robot électrique vs hydraulique vs à
surpression, finesse de filtration en microns, débit de filtration, brosse
PVC vs mousse, cycle, ligne d'eau, pente composée.

### 5.4 Désambiguïsation explicite

Quand un terme est ambigu, désambiguïser dès le chapô.

Cas typiques sur cette niche, tous à traiter :

- **« aspirateur de piscine »** : robot électrique autonome vs balai manuel
  branché sur skimmer vs aspirateur à batterie portatif. Trois produits, trois
  prix, trois usages. C'est l'ambiguïté centrale de la niche.
- **« sans fil »** : sans câble flottant vers un transformateur (robot à
  batterie) vs sans fil de pilotage mais toujours filaire.
- **« nettoie les parois »** : monte réellement jusqu'à la ligne d'eau vs
  monte de quelques centimètres et redescend.
- **« autonome »** : cycle automatique programmé vs capacité à se recharger
  seul, ce qu'aucun robot de piscine grand public ne fait aujourd'hui.
- **« compatible toutes piscines »** : formule marketing. La compatibilité
  dépend du revêtement, de la forme, de la pente et de l'escalier.

### 5.5 Signaux d'Expérience — au moins trois par page

Parmi :

- Un prix relevé chez un marchand belge nommé, avec sa date de relevé
- Une disponibilité réelle vérifiée (« indisponible chez Hubo au [date],
  livrable sous X semaines chez [marchand] »)
- Un **fait négatif assumé** — la brosse qui s'use vite, le panier trop petit
  pour les feuilles d'automne, le chariot vendu séparément, l'application qui
  n'apporte rien
- Un cas spécifique qui limite la généralité (« ce classement vaut pour un
  bassin enterré de 8 × 4 à liner ; sur une coque à pente composée, le
  raisonnement change »)
- Une opinion contre-intuitive argumentée
- Une référence vérifiable : capture de la fiche constructeur datée, photo

**L'expérience ne s'annonce jamais par une formule d'authenticité.** Une
phrase qui dit « notre comparatif indépendant » sans preuve est un signal
négatif. Elle se prouve par le détail.

### 5.6 Anticipation des follow-ups

Après la question principale, 3-4 follow-ups naturels en H3. Une page qui
pré-répond à 4 follow-ups peut être citée 4 fois dans une session AI Overview.

Exemple sur « quel robot de piscine choisir » :
- *Et si mon bassin a un escalier ?*
- *Est-ce que ça marche sur un liner qui commence à se décoller ?*
- *Combien ça consomme sur une saison au tarif belge ?*
- *Où le faire réparer en Belgique quand il tombe en panne ?*

### 5.7 Tableau comparatif normé

En-têtes de 1 à 3 mots. Cellules sans phrases complètes : valeurs, chiffres,
oui/non. Pas de cellules fusionnées, pas d'icônes mélangées au texte, une
ligne = un modèle, max 5-6 colonnes, suivi d'une phrase de verdict explicite.
Les chiffres viennent des composants adossés à `data/products/`, jamais en dur
dans la cellule.

### 5.8 Hiérarchie des sources

1. Officiels belges : SPF Économie (garantie légale), autorités régionales
   (urbanisme), gestionnaires d'eau (dureté par commune)
2. UE officielles
3. Pages officielles des constructeurs — pour les specs, prix, garantie
4. Fiches marchands belges — pour prix et disponibilité, datées
5. Mesures et relevés internes, datés, via composants
6. Presse spécialisée nommée et datée, en complément uniquement

Format : *« Selon [Nom] ([année]), [fait]. »* avec lien sur le nom.

### 5.9 Fraîcheur

`datePublished` et `dateModified` visibles. Année via `currentYear()`, jamais
en dur. Au moins une donnée datée de moins de 12 mois dans le corps — sur
cette niche, les prix et la disponibilité bougent vite et fortement selon la
saison.

---

## 6. Voix maison

**Tutoiement** systématique, registre pro et accessible, jamais condescendant.

**Ancrage belge concret.** Pas « selon votre région » mais des cas réels : la
saison de baignade qui dure quatre mois, le pollen de mai qui sature les
filtres, les feuilles de septembre, la dureté de l'eau qui entartre, le prix
de l'électricité, la disponibilité chez Hubo ou Brico, la garantie légale de
deux ans, le SAV quand le fabricant est chinois et sans importateur belge.

**Transparence radicale — la signature.** Publier ce qui déçoit. Dire ce qui
n'a pas été testé. Formuler le non-vérifié honnêtement plutôt que de meubler.

**Intros** : entrer dans le problème réel du lecteur dès la première phrase.
Jamais de mise en contexte générale.

**Verdicts nuancés** : « lequel pour qui », pas de gagnant absolu artificiel.
Un produit médiocre est décrit comme médiocre, même s'il est bien commissionné.

**Références visuelles** : Wirecutter et le Financial Times pour la densité
éditoriale et la retenue. Repoussoirs : les comparateurs affiliés à CTA
agressifs. Si une page commence à ressembler au second groupe, reculer.

---

## 7. Test du footprint

Sur les pages structurelles — méthodologie, à propos, divulgation
d'affiliation — prendre une phrase entre guillemets et la chercher sur
Google. Si d'autres sites affiliés ressortent, réécrire. La divulgation
d'affiliation en particulier doit être rédigée à la main et **varier selon
les pages** : une phrase copiée sur mille sites est une empreinte détectable.

---

## 8. Contrôle final avant commit

- La page est-elle scannable en dix secondes ?
- Le H1 adresse-t-il l'intent dominant du cluster, ou un head term supposé ?
- Un chiffre traîne-t-il en prose ?
- Chaque H2 fait-il sens copié seul ?
- Y a-t-il au moins trois signaux d'Expérience réels ?
- La divulgation d'affiliation est-elle visible et rédigée à la main ?
- Le contenu ressemble-t-il plus à Wirecutter qu'à un comparateur générique ?
- **Un fait négatif est-il assumé quelque part sur la page ?**

La dernière question est celle qui trahit le plus vite le contenu commercial.
Une page où tout est bien est une page que personne ne croit.
