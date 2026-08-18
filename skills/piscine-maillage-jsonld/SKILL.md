---
name: piscine-maillage-jsonld
description: >-
  Impose le maillage interne bidirectionnel et la correction des données
  structurées (JSON-LD) sur meilleur-robot-piscine.be. À utiliser dès qu'on
  ajoute ou modifie un lien interne, qu'on branche une nouvelle page dans le
  graphe, ou qu'on ajoute/vérifie du balisage Schema.org (Product, Review,
  ItemList, BreadcrumbList, FAQPage, HowTo, WebApplication). Toujours consulter
  quand l'utilisateur parle de « maillage », « liens internes », « schema »,
  « JSON-LD », « rich results », ou quand les liens entrants/sortants d'une page
  doivent être posés — la CI casse le build sur un lien brisé ou
  unidirectionnel, et un FAQPage écrit à la main qui double celui généré depuis
  le frontmatter est une erreur SEO silencieuse et fréquente.
---

# Maillage et JSON-LD — meilleur-robot-piscine.be

## 1. Source de vérité du maillage

`data/internal-links.ts`. Aucun lien contextuel n'est écrit en dur dans un
MDX sans y être déclaré. La CI vérifie trois choses :

1. **Bidirectionnalité.** A → B implique B → A déclaré. Un lien
   unidirectionnel casse le build.
2. **Cible existante.** Un lien vers une page non publiée casse le build.
3. **Densité.** Maximum 6 liens internes contextuels par page. Au-delà, le
   PageRank se dilue et la lecture souffre.

La matrice complète par gabarit est dans `docs/TEMPLATES-PAGES.md` §10.

## 2. Interdits de maillage

- Une page `probleme` ne pointe **jamais** vers un comparatif. L'intent ne le
  supporte pas : quelqu'un dont le robot est en panne n'achète pas, il répare.
  Elle pointe vers le guide parent, la pièce concernée, et la page marque si
  c'est un code erreur.
- Une page `guide` ne porte pas de lien affilié dense. Elle renvoie vers le
  comparatif, qui porte les liens.
- **Aucun lien contextuel croisé entre versions linguistiques.** Le seul pont
  entre `be-fr` et `be-nl` est le sélecteur de langue et le hreflang. Un lien
  contextuel FR → NL dans le corps de texte est un signal de traduction, pas
  d'adaptation.
- Le hub `/aspirateur-piscine/` route vers le silo robots, jamais l'inverse
  de façon systématique : `/manuel-balai/` est un cul-de-sac assumé côté
  monétisation, il n'a pas à recevoir du jus depuis les pages money.

## 3. JSON-LD par gabarit

| Gabarit | Schemas |
|---|---|
| Home | `WebSite` + `Organization` + `ItemList` + `FAQPage` + `BreadcrumbList` |
| Comparatif | `ItemList` (produits) + `ItemList` (pros/cons) + `FAQPage` + `BreadcrumbList` |
| Fiche modèle | `Product` + `Review` (auteur nommé) + `ItemList` pros/cons + `FAQPage` + `BreadcrumbList` |
| Duel | `ItemList` (2 produits) + `FAQPage` + `BreadcrumbList` |
| Marque | `ItemList` + `Organization` (marque) + `FAQPage` + `BreadcrumbList` |
| Guide | `Article` (auteur) + `FAQPage` + `BreadcrumbList` |
| Problème | `HowTo` si les étapes sont réelles, sinon `Article` + `FAQPage` + `BreadcrumbList` |
| Outil | `WebApplication` + `FAQPage` + `BreadcrumbList` |
| Partout | `Organization` avec adresse belge réelle |

## 4. Les cinq erreurs à ne jamais commettre

**1. Écrire un `FAQPage` à la main.** Il est généré exclusivement depuis le
frontmatter `faq:`. Un FAQPage écrit dans le corps en plus de celui généré
produit un doublon que Search Console signale et que Google ignore.

**2. Baliser une note invisible.** Si `AggregateRating` ou `Review` porte une
note, l'utilisateur doit voir cette note sur la page. Sans exception.

**3. Utiliser `Product` comme une page marchande.** Le site n'est pas le
point d'achat : c'est un **Product snippet**, pas un Merchant listing. Search
Console distingue les deux rapports. Ne pas baliser d'`offers` avec
`availability` comme le ferait un e-commerce — le prix affiché est un prix
relevé chez un tiers, daté, et il doit être présenté comme tel.

**4. Oublier `positiveNotes` / `negativeNotes`.** Le rich result
avantages/inconvénients est réservé par Google aux pages de test
**éditoriales** et interdit aux pages produit marchandes. C'est un avantage
structurel rare face aux revendeurs qui occupent la SERP belge : ils ne
peuvent pas l'utiliser. À implémenter sur chaque fiche modèle et chaque
comparatif, via `ItemList`.

**5. Baliser un `HowTo` sur un dépannage qu'on n'a pas vérifié.** Sur les
pages `probleme`, `HowTo` n'est légitime que si les étapes sont réelles,
ordonnées et vérifiables. Sinon `Article`.

## 5. Contrôle

```
npm run check-maillage    # bidirectionnalité, cibles, densité
npm run check-seo         # metadata, canonical, JSON-LD, liens brisés
```

`check-seo` valide la présence et la forme. Il ne valide pas la pertinence :
une page peut passer les deux contrôles et rester un doublon d'intent. La
validation de fond reste `skills/piscine-seo-audit`.
