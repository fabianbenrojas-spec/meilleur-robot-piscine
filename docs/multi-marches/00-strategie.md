# Stratégie multi-marchés

Trois marchés, un repo, trois domaines. Ce document cadre l'ordre, les
conditions de passage et les pièges connus.

---

## 1. Séquence

| Phase | Marché | Fenêtre | Condition de lancement |
|---|---|---|---|
| 1 | `be-fr` | Mois 1-10 | — |
| 2 | `be-nl` | Mois 10-16 | Le modèle fonctionne en FR : premières ventes, taux de commission conforme, taux de clic sortant décent |
| 3 | `fr-fr` | Mois 18+ | Les deux premiers ont clairement réussi |

Ne pas lancer le NL avant d'avoir la preuve que le modèle marche en FR.
Dupliquer un modèle qui ne fonctionne pas double le travail sans doubler le
revenu.

La phase 3 est la plus risquée des trois : c'est là qu'on perd l'avantage
local qui fait tout le différenciateur du site belge. Sur le marché français,
le site affronte des éditoriaux établis sans avoir de prix belges à opposer.

---

## 2. Ce qui est câblé dès maintenant

Même avec un seul marché déployé :

- `config/markets/` avec les trois entrées
- `config/routes/` avec les segments traduits
- `locales/fr-BE.json`, `nl-BE.json`, `fr-FR.json` — aucune string en dur
- `content/be-fr/`, `content/be-nl/`, `content/fr-fr/`
- champ `i18n` dans le schéma produit
- hreflang fonctionnel même avec une seule langue déclarée

Coût de cette anticipation : quelques heures. Coût de son absence : une
migration.

---

## 3. hreflang — les quatre pièges

**1. Le code est `nl-be`, pas `be-nl`.** La langue vient avant le pays.
`be-nl` désignerait une page destinée aux néerlandophones de Biélorussie.

**2. hreflang ne protège pas un contenu dupliqué.** Si les versions se
ressemblent trop, Google reprend la main, ignore la canonique et le hreflang,
et en désindexe une. C'est le risque n° 1 du passage au NL.

**3. Anticiper `fr-fr` dès maintenant.** Déclarer `fr-be` sans réserver la
place de `fr-fr` construit une cannibalisation à retardement. À l'ouverture
française, `fr-fr` s'ajoute à la grappe avec réciprocité complète des deux
côtés.

**4. Auto-référence obligatoire et réciprocité totale.** Chaque page déclare
toutes les variantes, y compris elle-même. Une déclaration unilatérale est
ignorée.

Grappe cible au lancement :

```html
<link rel="alternate" hreflang="fr-BE" href="https://www.meilleur-robot-piscine.be/…" />
<link rel="alternate" hreflang="x-default" href="https://www.meilleur-robot-piscine.be/" />
```

Puis, à l'ouverture NL et FR, ajout des lignes correspondantes sur les deux
domaines.

**Pas de redirection automatique par IP.** Googlebot crawle depuis les
États-Unis et se retrouverait piégé dans une version. Un sélecteur de langue
visible partout, et éventuellement une suggestion basée sur `Accept-Language`,
sans redirection forcée.

---

## 4. Le principe qui décide du succès de la version NL

**On adapte ce qui marche, on ne traduit pas ce qui existe.**

Une page NL part de son propre cluster de mots-clés, avec sa propre analyse
de SERP sur google.be en néerlandais. Le contenu FR sert de référence
factuelle, jamais de texte source.

Trente pages flamandes bien travaillées valent mieux que cent-cinquante
traduites — et évitent le scénario où Google en désindexe la moitié.

### Ce qui change réellement

**Le vocabulaire.** Le néerlandais de Flandre n'est pas celui des Pays-Bas,
et l'écart porte précisément sur des termes qui sont des mots-clés
commerciaux. C'est validé par les exports Semrush BE contre NL, jamais par
intuition.

**Piège connu et documenté sur cette niche** : `zwembad` seul renvoie
massivement vers les piscines publiques. La qualification commerciale passe
par `privézwembad`, `opzetzwembad` et `inbouwzwembad`. Construire les clusters
sans cette qualification revient à cibler le trafic des piscines communales.

**Les concurrents.** Sur la SERP néerlandophone belge, ce ne sont plus les
éditoriaux français mais les acteurs néerlandais : Tweakers, Kieskeurig,
Consumentenbond, les pages conseil de Coolblue et bol.com. Même asymétrie
qu'en français, autres acteurs. L'avantage reste le même : prix belge,
disponibilité, garantie et SAV locaux.

**Les marchands.** bol.com et Coolblue passent devant Amazon dans les
tableaux de prix des pages NL. Hubo, Brico et Gamma pour le retail physique.
C'est déjà reflété dans `activeMerchantIds` de `config/markets/be-nl.ts`.

**Les backlinks.** Les liens flamands vont aux pages NL, les liens wallons et
bruxellois aux pages FR. Un lien depuis un `.be` vaut structurellement plus
qu'un lien étranger équivalent pour ranker en Belgique.

**Le ton reste identique** : tutoiement (`je` / `jouw`), même transparence,
même retenue.

---

## 5. Périmètre de la phase NL

Le miroir n'est pas complet. On adapte les 40 % de pages qui portent 80 % du
revenu : environ 70 URLs. Détail dans `docs/ARBORESCENCE.md` §14.

Priorité : la home, le hub de désambiguïsation, les comparatifs sans-fil et
hors-sol, les 25 fiches de modèles réellement distribués chez bol.com,
Coolblue, Hubo et Brico, puis les guides d'achat local. Le silo problèmes
vient en dernier.

---

## 6. Pilotage

Search Console filtrée par pays dès le premier jour. Contrôle mensuel :
filtrer par Belgique **et** Pays-Bas sur la version NL. Un trafic néerlandais
anormalement élevé signale que Google traite mal le ciblage, ou que le
contenu n'est pas assez flamand. Symétriquement côté FR avec la France.

Trois indicateurs qui décident de tout :

1. **Taux de commission moyen constaté**, mois par mois. S'il reste bas, le
   modèle ne tient pas quel que soit le trafic — c'est le signal qu'il faut
   basculer sur les programmes marque.
2. **Ventes qualifiées par millier de sessions, par gabarit.** Ça dit où
   placer les liens et quels contenus produire ensuite. Un comparatif qui ne
   convertit pas n'a pas un problème de trafic.
3. **Part du trafic sur les requêtes de marque**, à 12 et 24 mois. C'est
   l'indicateur de survie face aux moteurs génératifs. S'il ne monte pas, on
   construit un actif qui dépend entièrement d'un algorithme.
