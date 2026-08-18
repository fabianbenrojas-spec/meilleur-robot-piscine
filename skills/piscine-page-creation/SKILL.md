---
name: piscine-page-creation
description: >-
  Scaffold et rédige une nouvelle page de contenu pour meilleur-robot-piscine.be
  — site Next.js + Tailwind de comparaison et d'affiliation de robots de piscine
  (fr-BE). À utiliser pour toute création de page /comparatif, /avis, /vs,
  /marque, /guide, /probleme, /pieces, /outil, ou quand l'utilisateur dit « crée
  une page », « nouvelle fiche modèle », « ajoute un robot au comparatif »,
  « transforme ce brief en MDX ». Toujours charger ce skill avant d'écrire un
  MDX à la main — il impose le gabarit par silo, le frontmatter, la validation
  keyword, le maillage et la discipline de PR. Sauter cette étape produit des
  pages qui échouent à check-seo ou qui dupliquent l'existant.
---

# Création de page — meilleur-robot-piscine.be

## Étape 0 — Avant d'écrire quoi que ce soit

1. Lire `CLAUDE.md` puis lancer `npm run preflight`.
2. **Anti-doublon.** Lister le silo cible dans `content/be-fr/<type>/` et
   vérifier dans `docs/ARBORESCENCE.md` qu'aucune page ne couvre déjà le même
   intent. Si une page proche existe : ne pas créer, proposer de l'enrichir,
   s'arrêter. Un doublon d'intent cannibalise plus qu'il n'apporte.
3. **Valider la demande.** Le cluster doit exister dans
   `data/keywords/clusters-be-fr.csv`. Seuils (`CLAUDE.md` §5) :
   - ≥ 30/mois cumulé sur la base BE → page
   - 10 à 30 → section dans une page existante, pas de page
   - < 10 avec intention transactionnelle nette et KD < 20 → exception à
     documenter dans `DECISIONS.md`
   - fiche modèle disponible chez un marchand belge → créée même à volume nul

   Sous le seuil sans exception justifiée : ne pas créer, et **documenter le
   refus** dans `DECISIONS.md`. Le refus documenté a autant de valeur que la
   page créée.
4. **Analyser la SERP google.be** sur le head term et formuler le content gap.
   Procédure complète : `docs/SEO-GEO-REDACTION.md` §0.3. Sans content gap
   identifié et écrit dans `DECISIONS.md`, la page ne se crée pas.

## Étape 1 — Scaffolder

```
npm run new-page -- --type <comparatif|avis|vs|marque|guide|probleme|pieces|outil> --slug <slug>
```

Ne pas créer le fichier à la main quand `new-page` couvre le type : le
template garantit le frontmatter et la structure de sections du gabarit.

## Étape 2 — Charger la doctrine AVANT la première phrase

En parallèle, avant d'écrire :

- `docs/SEO-GEO-REDACTION.md` — brief, outline, 70 % de H2 en question,
  pattern réponse-explication-exemple, citabilité par chunk
- `docs/TEMPLATES-PAGES.md` — la séquence de blocs du gabarit visé
- `docs/AUTHOR-*.md` — la voix qui signe
- `skills/humaniser-fr` en **mode production** — les règles anti-IA
  s'internalisent avant d'écrire, pas en correction après coup
- `skills/piscine-data-integrity` — zéro chiffre en prose, sources datées

## Étape 3 — Frontmatter obligatoire

```yaml
---
title: "…"                    # 50-60 car., {YEAR} dynamique, jamais d'année en dur
description: "…"              # 140-155 car.
slug: "…"
silo: comparatif              # doit matcher un ContentType de routes.config.ts
cluster: "robot-piscine-sans-fil"   # doit exister dans clusters-be-fr.csv
headTerm: "robot piscine sans fil"
volumeBe: 3490                # cumul du cluster, pour audit
author: "…"
datePublished: "2026-…"
dateModified: "2026-…"
tldr:
  - "…"                       # 3-5 bullets, obligatoire dès 400 mots
faq:                          # 6 minimum (4 pour probleme et outil)
  - question: "…"
    answer: "…"
produits:                     # slugs de data/products/ cités sur la page
  - "aiper-scuba-s1-pro"
liensInternes:                # déclarés aussi dans data/internal-links.ts
  - "/comparatif/robot-piscine-hors-sol"
---
```

Le `FAQPage` JSON-LD est généré **exclusivement** depuis `faq:`. Ne jamais
l'écrire à la main dans le corps : c'est la source de doublons silencieux la
plus fréquente.

## Étape 4 — Rédiger selon le gabarit

Suivre la séquence de blocs de `docs/TEMPLATES-PAGES.md` pour le silo visé.
Points de vigilance par gabarit :

**Comparatif** — le tableau ne dépasse pas 6 colonnes, chaque ligne est un
modèle, une phrase de verdict suit le tableau. Le verdict final est « lequel
pour qui », jamais un gagnant absolu.

**Fiche modèle** — au moins trois inconvénients réels. Si `testedInPerson` vaut
`false`, l'encart de transparence est obligatoire et le dit explicitement.
La note balisée est celle qui est visible.

**Duel** — si les différences tiennent en deux lignes, ce n'est pas une page,
c'est une section du comparatif parent. S'arrêter et le dire.

**Marque** — le H2 « disponibilité et SAV en Belgique » est le
différenciateur. Une page marque sans lui n'a pas de raison d'exister face
aux pages officielles du constructeur.

**Guide** — densité affiliée basse. Un guide qui envoie sur Amazon deux
semaines avant l'achat brûle le clic de 24 h.

**Problème** — la cause la plus fréquente est donnée en deux phrases avant
tout le reste. Densité affiliée nulle sauf la pièce concernée. `HowTo`
uniquement si les étapes sont réelles et vérifiables.

**Outil** — l'outil est au-dessus de la ligne de flottaison, sans
inscription. Les hypothèses de calcul sont affichées sous le résultat. Les
résultats sont donnés en fourchette.

## Étape 5 — Maillage

Déclarer les liens dans `data/internal-links.ts`, dans les **deux** sens. La
CI échoue sur un lien unidirectionnel. Maximum 6 liens internes contextuels
par page.

Interdits : une page `probleme` ne pointe jamais vers un comparatif ; aucun
lien contextuel croisé entre versions linguistiques.

## Étape 6 — Review avant PR

1. `skills/boileau` — passe anti-IA sur le brouillon.
2. Les huit questions du contrôle final (`docs/SEO-GEO-REDACTION.md` §8).
3. Les six contrôles : `preflight`, `check-seo`, `check-maillage`,
   `check-placeholders`, `check-prices`, passe anti-IA.
4. Mettre à jour `public/llms.txt` si la page est majeure.

## Étape 7 — Livraison

Branche `content/<silo>-<slug>`, une PR par page, `DECISIONS.md` mis à jour
avec le content gap. La livraison s'arrête à l'ouverture de la PR : jamais
`gh pr merge`, jamais de commit direct sur `main`.
