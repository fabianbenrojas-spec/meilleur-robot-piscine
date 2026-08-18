---
name: piscine-seo-audit
description: >-
  Audit SEO on-page des pages de meilleur-robot-piscine.be : optimisation
  title/meta, hiérarchie des Hn, adéquation à l'intention de recherche du
  cluster ciblé, signaux E-E-A-T, couverture du maillage interne — en
  complément de check-seo qui ne valide que la présence mécanique des balises
  et l'absence de liens brisés. À utiliser quand l'utilisateur demande
  « audite », « optimise le SEO », « améliore le référencement », « vérifie
  l'intent », « revois les title/meta », ou avant de publier une page qu'on veut
  voir ranker. Consulter chaque fois qu'une page est écrite ou remaniée :
  check-seo au vert est nécessaire mais pas suffisant pour ranker.
---

# Audit SEO on-page — meilleur-robot-piscine.be

Sept contrôles, dans cet ordre. Chacun se conclut par un verdict binaire et
une correction concrète, jamais par un commentaire général.

## 1. Adéquation à l'intent du cluster

Ouvrir `data/keywords/clusters-be-fr.csv` et filtrer sur le `cluster` du
frontmatter. Vérifier :

- Le H1 adresse-t-il l'**intent dominant** du cluster, ou un head term
  supposé ? Ce n'est pas la même chose. Un cluster majoritairement
  informationnel avec un H1 transactionnel ne rankera pas.
- Les requêtes satellites du cluster sont-elles couvertes par un H2 ou un H3 ?
  Celles qui ne le sont pas sont soit à ajouter, soit le signe qu'elles
  appartiennent à un autre cluster.
- Le gabarit choisi correspond-il à l'intention ? Un cluster support traité
  en comparatif est un échec structurel, pas un problème de rédaction.

**Piège propre à cette niche** : le mot « aspirateur » couvre trois produits.
Vérifier que la page ne mélange pas robot électrique, balai manuel et
aspirateur à batterie sans les distinguer. Si elle les mélange, elle ne
ranke sur aucun des trois.

## 2. Title et meta

- Title : 50-60 caractères, mot-clé en début, différenciateur en fin,
  `{YEAR}` dynamique et jamais d'année en dur
- Meta description : 140-155 caractères, mot-clé + variante, verbe d'action
- Formats de référence par gabarit : `docs/SEO-GEO-REDACTION.md` §4.2
- Pas de deux-points décoratif en fin de H2

Vérifier aussi l'unicité : deux pages du même silo avec des titles proches
se cannibalisent. Grep sur les frontmatter du silo.

## 3. Hiérarchie des Hn

- H1 unique, ≤ 60 caractères
- **≥ 70 % des H2 en forme de question.** Comptent : *Faut-il*, *Quel*,
  *Comment*, *Pourquoi*, *Est-ce que*, *Combien*, *X ou Y : lequel choisir ?*
  Ne comptent pas : *Choisir en 3 étapes*, *Le meilleur robot 2026*
- Aucun H2 de la liste noire (`docs/SEO-GEO-REDACTION.md` §3.3)
- Aucun saut de niveau (H2 → H4)
- Un H3 ne paraphrase jamais son H2

## 4. Citabilité par chunk

Pour chaque H2, appliquer le test : copier le H2 et son bloc seuls, sans
contexte. Font-ils sens ? Un pronom dont le référent est ailleurs, un « voir
plus haut », un « comme évoqué » cassent le chunk.

Vérifier aussi le pattern **réponse - explication - exemple** : chaque H2
commence-t-il par une réponse directe de moins de 60 mots ?

## 5. Signaux E-E-A-T

Compter les signaux d'Expérience réels. Minimum trois par page :

- un prix relevé chez un marchand belge nommé, avec sa date
- une disponibilité réelle vérifiée
- **un fait négatif assumé**
- un cas belge précis qui limite la généralité
- une opinion contre-intuitive argumentée

Vérifier la présence de `AuthorByline`, `UpdatedDate`,
`AffiliateDisclosure` visible et **rédigée à la main**, `SourcesVerifiees`.

Le contrôle qui trahit le plus vite : **y a-t-il un fait négatif quelque part
sur cette page ?** Une page où tout est bien est une page que personne ne
croit.

## 6. Couverture du maillage

- Minimum 2 liens internes contextuels vers des piliers
- Maximum 6 au total
- Réciprocité déclarée dans `data/internal-links.ts`
- Ancres descriptives et variées, jamais « cliquez ici »
- Maximum 1 lien externe par 500 mots, sources d'autorité uniquement
- Aucun lien croisé entre versions linguistiques

## 7. Fraîcheur et données

- `dateModified` à jour
- Au moins une donnée datée de moins de 12 mois dans le corps
- Aucun `priceCheckedAt` de plus de 90 jours sur les produits cités
- **Zéro chiffre en prose** — dernier passage, c'est la régression la plus
  fréquente

## Sortie de l'audit

Un tableau : contrôle | verdict | correction. Pas de prose d'introduction,
pas de résumé final. Les corrections sont appliquées ou listées, jamais
suggérées vaguement.
