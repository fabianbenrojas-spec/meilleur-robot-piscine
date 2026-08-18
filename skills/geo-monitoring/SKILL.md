---
name: geo-monitoring
version: 1.0.0
description: Mesure et suit la citabilité de meilleur-robot-piscine.be par les moteurs génératifs (ChatGPT, Perplexity, Google AI Overviews, Claude, Gemini). À utiliser une fois par mois, ou quand l'utilisateur dit « check la citabilité », « est-ce qu'on sort dans les IA », « monitoring GEO », « est-ce qu'on est cité par Perplexity/ChatGPT », ou après un refresh d'article pour vérifier qu'il est bien repris. Produit / met à jour tasks/geo-monitoring.md.
allowed-tools:
  - Read
  - Write
  - Edit
  - WebSearch
---

# geo-monitoring — suivi de citabilité par les moteurs génératifs

Pas de monitoring = optimisation à l'aveugle. Ranker sur Google ne garantit pas d'être **cité** par une IA. Ce skill mesure la seconde chose.

## Quand l'exécuter

- Passe mensuelle systématique (5 head terms)
- Après le refresh d'une page important (vérifier qu'il est repris)
- Sur alerte : chute de trafic organique sur une page qui rankait

## Procédure mensuelle (5 head terms)

1. **Choisir 5 head terms publiés** représentatifs des silos actifs (`/avis`, `/pays`, `/vs`, `/meilleur`, `/guides`). Varier d'un mois sur l'autre pour couvrir le catalogue.

2. **Pour chaque head term, tester la citabilité** sur les moteurs génératifs disponibles :
   - **Perplexity** : taper la requête, regarder si meilleur-robot-piscine.be figure dans les sources citées (encart Sources).
   - **ChatGPT Search** : idem, vérifier les liens de sources.
   - **Google AI Overview** : idem (encadré en haut de la SERP Google.be).
   - **Claude** (si recherche active) : idem.
   - **Gemini** : idem si accessible.

   Note : ce skill peut préparer et lancer des `WebSearch` pour reproduire les requêtes et voir ce qui ressort côté SERP classique, mais la vérification de citation dans les réponses génératives se fait manuellement (les moteurs génératifs ne sont pas tous accessibles en tool). Le skill structure le relevé ; l'humain confirme la présence dans les réponses IA.

3. **Logger le résultat** dans `tasks/geo-monitoring.md` : pour chaque (head term × moteur), `cité / non cité / partiel`, avec la date et l'URL de la page qui aurait dû être citée.

4. **Diagnostiquer les non-citations** :
   - La page ranke sur Google mais n'est pas citée par les IA → problème de **citabilité GEO** : chunks H2 non autonomes, pas de réponse directe < 60 mots, pas de signal de définition, tableau non normé. Relancer un audit via `docs/SEO-GEO-REDACTION.md` §5.
   - La page ne ranke pas du tout → problème SEO classique, pas GEO : voir `skills/vpn-seo-audit`.
   - La page est citée mais avec une donnée fausse/périmée → refresh urgent (prix, mesure, statut audit).

## Signaux de correction (checklist rapide sur une page non citée)

- [ ] Chaque H2 est-il un chunk citable seul (Answer-Explanation-Example) ?
- [ ] Réponse directe < 60 mots en tête de chaque H2 stratégique ?
- [ ] Signal de définition présent pour le concept central dans les 200 premiers mots ?
- [ ] Tableau comparatif normé (en-têtes courts, une ligne = un VPN, pas de merged cells) ?
- [ ] FAQ in-flow qui pré-répond aux follow-ups ?
- [ ] Chunks repliés (render-then-hide) bien présents dans le DOM ?
- [ ] Fraîcheur signalée (`dateModified`, donnée datée < 12 mois) ?
- [ ] SpeakableSpecification dans le JSON-LD ?
- [ ] robots.ts n'interdit aucun crawler IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) ?
- [ ] La page est-elle dans `public/llms.txt` si c'est une page prioritaire ?

## Format du log

Voir le gabarit `tasks/geo-monitoring.md`. Une entrée par passe mensuelle, tableau (head term × moteur), plus une section « Actions déclenchées » listant les audits/refresh lancés suite à une non-citation.

Une chute brutale de citabilité sur un head term qui sortait avant = signal fort. Ne pas attendre la passe mensuelle suivante, traiter tout de suite.
