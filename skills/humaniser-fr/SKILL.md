---
name: humaniser-fr
version: 1.0.0
description: Détecte ET prévient les marqueurs de rédaction par IA dans tout texte français produit pour le site meilleur-robot-piscine.be. À utiliser dans DEUX cas. (1) Mode production : quand l'utilisateur demande de produire du contenu en français — « rédige un avis produit », « écris une fiche modèle », « crée un comparatif vs », « rédige la FAQ », « génère le texte de », « fais-moi un guide », « produis un brief », « compose un titre SEO », « rédige l'intro », « écris le verdict ». Dans ce mode, Claude internalise les règles AVANT d'écrire la première ligne. (2) Mode review : quand l'utilisateur fait relire un texte existant — « humanise ce texte », « ça sonne IA », « ça sent ChatGPT », « retire les tics IA », « relis cette fiche produit ». NE PAS charger pour du code TS/JS, des configs, ou des questions purement techniques sans dimension rédactionnelle.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
---

# humaniser-fr — éditeur anti-IA pour textes français (meilleur-robot-piscine.be)

Ce skill a deux usages distincts. Identifie lequel s'applique avant d'agir.

## Mode production (par défaut quand on te demande de rédiger)

L'utilisateur te demande de produire un texte : avis fournisseur, page pays, comparatif /vs, best-of, guide, page outil, FAQ, brief, intro, verdict, titre SEO, meta-description. Le skill se charge **avant** la rédaction.

Procédure courte :

1. **Lire** une fois les catégories A à J ci-dessous pour internaliser ce qu'il faut éviter.
2. **Garder en tête les cinq règles d'or** :
   - Privilégier *est* / *sont* aux verbes pompeux (*constitue*, *représente*, *incarne*, *s'impose comme*).
   - Bannir les connecteurs en pluie en début de phrase (*Par ailleurs*, *De plus*, *En outre*, *Néanmoins*, *Ainsi*).
   - Donner au moins un fait concret (chiffre mesuré, date, nom propre, source) par paragraphe — pas du remplissage adjectival.
   - Interdire *véritable* anteposé, les triades systématiques, et les conclusions positives génériques (*surfez l'esprit tranquille*).
   - Respecter la typographie française (« » avec espace insécable, espace insécable avant `:` `;` `?` `!`, accents sur majuscules : *À, É, È, Ê, Ô*).
3. **Écrire directement propre.** Pas de premier jet IA à corriger ensuite — le but est de sortir un texte qui ne nécessitera PAS de passe humaniser-fr derrière.
4. **Audit interne** avant de livrer : appliquer en silence les cinq tests rapides (verbe être, connecteur d'ouverture, opinion, chiffres concrets, *véritable*). Corriger ce qui sonne encore IA.
5. **Livrer.**

Le réflexe à acquérir : un bon texte n'est pas un texte IA *qui a été corrigé*. C'est un texte qui n'a jamais été IA dès le départ.

**Important pour meilleur-robot-piscine.be** : en mode production, applique aussi la catégorie G (spécifique sites éditoriaux affiliés) systématiquement. Le secteur du VPN est saturé de contenu affilié généré par IA, celui que Google a le plus vu passer. Les patterns « blog comparateur VPN générique » sont éliminatoires : *le VPN ultime*, *une sécurité de niveau militaire*, *surfez en toute sécurité*, *notre comparatif indépendant*, *tous les VPN testés*.

**Rappel data-integrity** : les chiffres (vitesse, prix, note, nombre de serveurs) ne se rédigent PAS en prose — ils sont rendus par des composants adossés à `data/products/*.json` / `SpeedTestChart` / `CountrySpeedChart`. Ce skill traite la prose ; il ne doit jamais te pousser à écrire un chiffre en dur. Cf. `skills/piscine-data-integrity`.

## Mode review (relecture d'un texte existant)

L'utilisateur te donne un texte déjà écrit et te demande de l'humaniser. Pour une review chirurgicale en 9 étapes, utiliser plutôt le skill compagnon [`boileau`](../boileau/SKILL.md), conçu pour la réécriture auditée.

---

## Cinq tests rapides : ce texte sonne-t-il IA ?

1. **Test du verbe être.** Compte les *est* et *sont*. Moins d'un par paragraphe = suspect.
2. **Test du connecteur d'ouverture.** Combien de phrases commencent par *Par ailleurs*, *De plus*, *En outre*, *Cependant*, *Néanmoins*, *Ainsi*, *En effet* ? Plus d'une fois par paragraphe = IA.
3. **Test de l'opinion.** Trouve une phrase qui exprime un point de vue, un doute, un sentiment mêlé. Aucune en deux paragraphes = IA.
4. **Test des chiffres concrets.** Combien de faits vérifiables (date, nom propre, chiffre mesuré, source) ? Moins d'un par 100 mots = IA en train de meubler.
5. **Test du *véritable*.** Compte les occurrences de *véritable* avant un nom. Plus de zéro = à reformuler.

Trois tests sur cinq positifs = le texte est IA, intervenir.

---

## Catégorie A — Vocabulaire qui dit grand-chose et ne dit rien

### A1. Vocabulaire gonflant

Suspects récurrents : *crucial, essentiel, fondamental, incontournable, indispensable, majeur, central, stratégique, robuste, innovant, dynamique, profond, durable, pertinent, significatif*.

**Avant**
> NordVPN constitue une véritable référence du marché grâce à une approche dynamique et innovante de la sécurité.

**Après**
> NordVPN fait deux choses bien : les vitesses les plus rapides qu'on ait mesurées vers Bruxelles, et un serveur physique belge (pas une localisation virtuelle).

### A2. *Véritable* anteposé

**Avant** : *Le kill switch représente un véritable atout pour la confidentialité.*
**Après** : *Le kill switch coupe tout le trafic internet si le tunnel VPN tombe, ce qui évite que ton IP réelle fuite pendant la reconnexion.*

### A3. Verbes passe-partout

**Avant** : *Ce VPN permet de répondre aux besoins en optimisant la sécurité.*
**Après** : *Surfshark autorise un nombre illimité d'appareils simultanés sur un seul abonnement, là où NordVPN plafonne à 10.*

### A4. Doublets d'adjectifs

*Simple et intuitif*, *rapide et fiable*, *sûr et performant*. Garde un seul, et seulement si tu peux le justifier.

### A5. Clichés VPN à haute fréquence (spécifique)

*sécurité de niveau militaire (military-grade)*, *anonymat total*, *invisible en ligne*, *bouclier numérique*, *forteresse imprenable*, *tranquillité d'esprit absolue*. Un VPN chiffre le trafic et masque l'IP à un site — il ne rend pas *anonyme* ni *invisible*. Le dire faux est un problème E-E-A-T, pas seulement stylistique.

---

## Catégorie B — Tournures qui essaient de « faire pro »

### B1. Évitement du verbe être

**Avant** : *Ce protocole constitue une référence et s'impose comme l'outil incontournable.*
**Après** : *WireGuard est plus rapide qu'OpenVPN sur presque toutes nos mesures, avec un code beaucoup plus court à auditer.*

### B2. Phrases en miroir et parallélismes négatifs

*Ce n'est pas X, c'est Y.* *Loin d'être X, c'est Y.* *Bien plus qu'un simple X, c'est Y.* *Non seulement X, mais Y aussi.*

**Avant** : *Ce n'est pas un simple VPN, c'est un véritable écosystème de sécurité.*
**Après** : *Proton VPN inclut un palier gratuit sans limite de données, financé par les abonnements payants de Proton Mail — pas par la revente de données de connexion.*

### B3. Triades systématiques

*Rapide, sécurisé et fiable* → réduis à un seul élément concret.

### B4. Anaphores marketing

*Pour ceux qui streament. Pour ceux qui voyagent. Pour ceux qui ne transigent pas.* — tic de slogan publicitaire.

### B5. Connecteurs académiques en pluie

*Par ailleurs, De plus, En outre, De surcroît, Néanmoins, Toutefois, Cependant, En effet, Ainsi, Par conséquent, En définitive.* Dans 80 % des cas tu peux les supprimer.

**Avant** : *Le marché du VPN évolue. Par ailleurs, les usages changent. De plus, le streaming se durcit.*
**Après** : *En cinq ans, le streaming a durci ses blocages géo : Netflix détecte et bloque des plages d'IP VPN entières, ce qui explique pourquoi un serveur qui marchait le mois dernier peut tomber du jour au lendemain.*

### B6. Tournures pseudo-soutenues

*Il convient de noter que, force est de constater que, dans cette optique, à l'aune de.* À supprimer presque toujours.

### B7. Fausses gammes (« de X à Y »)

*Du streaming au torrent, en passant par le gaming, ce VPN couvre tout.* → *On a testé Surfshark sur trois usages précis : Auvio depuis l'étranger, torrent avec port forwarding, et ping en jeu vers des serveurs européens.*

### B8. Auto-validation rhétorique

*Et c'est précisément le but. Voilà toute la question.* À supprimer systématiquement.

### B9. Méta-annonces

*Voici ce qu'on en sait. Pour bien comprendre, il faut savoir que.* Supprime, attaque directement le contenu.

### B10. Posture didactique

*Ce qu'il faut comprendre, c'est que. Il faut savoir que. Notez que.* Position de prof face à un élève. Présente l'info, le lecteur en tire ses conclusions.

---

## Catégorie C — Automatismes du chatbot qui se voient

### C1. Artefacts conversationnels

*Bien sûr ! Avec plaisir ! Voici… J'espère que cela vous aide. N'hésitez pas à…* → supprimer.

### C2. Avis de coupure de connaissance

*À ma dernière mise à jour, selon les informations disponibles.* Si on n'a pas la donnée, on ne meuble pas ; on la mesure ou on le dit (encart transparence pour les destinations non testées).

### C3. Ton flatteur ou servile

*Excellente question ! Vous avez tout à fait raison.* À enlever en contenu publié.

### C4. Sur-qualification (hedging)

*On pourrait potentiellement penser qu'il est possible que ce VPN puisse avoir un certain impact sur la vitesse.* Garde un seul modalisateur, ou aucun.

### C5. Conclusions positives génériques

*L'avenir de la vie privée s'annonce prometteur.* Remplace par un fait : *L'APD a publié en 2026 des recommandations sur les traceurs, mais un VPN n'agit pas sur les cookies — c'est une confusion fréquente qu'on démonte plus bas.*

---

## Catégorie D — Calques de l'anglais

### D1. Anglicismes IA

| Forme IA | Forme française |
|---|---|
| adresser un problème | traiter un problème |
| faire du sens | avoir du sens |
| supporter (un protocole) | prendre en charge |
| délivrer de la sécurité | apporter quelque chose de concret |
| implémenter | mettre en place |
| basé sur | fondé sur, à partir de |
| matcher | correspondre |
| sourcer | trouver |

Note VPN : *split tunneling*, *kill switch*, *no-logs*, *WireGuard* sont des termes techniques établis — on les garde tels quels, ce ne sont pas des calques à corriger.

### D2. Calques syntaxiques

- **Virgule d'Oxford** : *On a testé la vitesse, le streaming, et la fuite DNS.* → *…la vitesse, le streaming et la fuite DNS.*
- ***En termes de*** : *En termes de vitesse…* → *Côté vitesse…*
- ***Bien que + indicatif*** → subjonctif obligatoire

### D3. Transitions pseudo-journalistiques

*Est moins rapide qu'on ne le pense. En apparence sécurisé, en réalité troué. Derrière les chiffres se cache.* Un humain donne la nuance directement.

---

## Catégorie E — Typographie française

### E1. Guillemets

`"texte"` (droits) → `« texte »` avec espace insécable à l'intérieur.

### E2. Espace insécable avant `:` `;` `?` `!`

*Voici le résultat: c'est validé!* → *Voici le résultat : c'est validé !*

### E3. Apostrophe

L'apostrophe courbe (`’`) est plus propre que la droite (`'`). Être cohérent dans un même texte.

### E4. Accents sur les majuscules

*Etat, Apres, A propos, Ecole, Evolution* → *État, Après, À propos, École, Évolution.*

### E5. Accents oubliés sur les mots fréquents

Couples à surveiller : *où/ou*, *à/a*, *là/la*, *ça/ca*, *dû/du*, *sûr/sur*.

---

## Catégorie F — Structure obsessionnelle des LLM

### F1. Surutilisation du tiret cadratin (—)

Max 3 occurrences par article. Remplace par virgule, deux-points, ou parenthèse.

### F2. Gras mécanique

Un gras par paragraphe maximum.

### F3. Listes à puces « en-tête en gras : »

Signature visuelle ultime des LLM. Convertir en prose ou en liste simple.

### F4. Émojis décoratifs

🚀 🔒 ✅ dans les titres ou puces. À retirer en contenu publié.

### F5. Variation élégante (synonymie excessive)

L'IA évite la répétition en cyclant 4 synonymes. Répète le nom propre sans honte : *NordVPN, NordVPN, NordVPN* est plus clair que *NordVPN, le fournisseur panaméen, le service, l'application*.

---

## Catégorie G — Spécifique sites éditoriaux affiliés (LE PLUS IMPORTANT ICI)

Ces patterns sont la signature numéro un du contenu éditorial affilié généré par IA, celle que Google a vu passer le plus souvent dans le secteur VPN. Ne jamais les laisser passer.

### G1. Méta-discours d'autorité

| Pattern à bannir | Pourquoi |
|---|---|
| *Notre comparatif indépendant…* | Le mot *indépendant* dans une page à liens affiliés est un drapeau rouge s'il n'est pas prouvé. |
| *Notre méthodologie rigoureuse…* | Sauf explication concrète (protocole Ookla 3 passes, ISP testés, dates) sur trois lignes minimum, supprime. |
| *Tous les VPN ont été testés…* | Si le VPN n'a pas été réellement mesuré depuis la Belgique, ne le dis pas. Encart transparence pour ce qui n'est pas mesuré. |
| *Pourquoi nous faire confiance ?* | Section vide neuf fois sur dix. |
| *Notre verdict, sans hésiter…* | Tic de fiche produit IA. |
| *Le rapport qualité-prix imbattable* | Cliché de PMU SEO. |
| *Le coup de cœur de la rédaction* | Sonne faux sur un site affilié. |
| *À l'heure de choisir… / À l'heure où…* | Ouverture d'article tic. |

### G2. Boilerplate inter-sites (footprint SEO)

Les pages structurelles (À propos, Méthodologie, mentions, FAQ génériques) sont les plus copiées-collées entre sites affiliés. Google compare ces pages entre sites pour détecter les réseaux. Pour meilleur-robot-piscine.be, ces pages doivent :

- Mentionner un **nom propre réel** (Léna Vanderbeke, pas « l'équipe éditoriale »).
- Mentionner un **ancrage belge réel** (Belgique, ISP local, RTBF Auvio, ville si pertinent).
- Mentionner une **méthode réelle et datée** (protocole Ookla 3 passes, ISP Proximus/VOO/Telenet, dates de test).
- Avoir un **wording propre** : ne JAMAIS copier-coller le texte d'un autre comparateur VPN.

**Test du footprint** : prends une phrase au hasard de la page « Méthodologie » ou « À propos », mets-la entre guillemets dans Google. Si Google retourne d'autres sites VPN affiliés avec la même phrase, footprint détecté — réécris.

### G3. Conclusions de fiche produit génériques

*Si vous cherchez un VPN qui combine sécurité et simplicité, ce modèle est fait pour vous.* → *NordVPN convient si tu veux la vitesse maximale et un serveur belge natif. Si tu tiens surtout à la confidentialité et que tu acceptes un poil moins de débit, Proton VPN passe devant.*

### G4. FAQ génériques

*Comment fonctionne le VPN X ? Pourquoi choisir Y ?* avec des réponses vagues de trois lignes = pattern le plus dupliqué entre sites IA. Pose des questions précises : *NordVPN débloque-t-il RTBF Auvio depuis la France ?* avec un fait daté, pas une généralité.

### G5. Disclaimers affiliés copiés-collés

*Ce site contient des liens affiliés. Lorsque vous achetez via ces liens, nous touchons une commission sans surcoût pour vous.* Ce texte exact apparaît sur des milliers de sites. Reformule par page (anti-footprint) : *Souscrire un VPN via nos liens partenaires nous rapporte une commission. Le prix pour toi ne change pas, et le classement ne dépend pas du montant de cette commission — il dépend de nos mesures.*

### G6. Fausses affirmations de sécurité (spécifique VPN, drapeau E-E-A-T)

À ne jamais écrire tel quel : *un VPN vous rend anonyme*, *un VPN vous protège des virus*, *sécurité de niveau militaire*, *personne ne peut vous tracer*. Ce sont à la fois des tics IA et des inexactitudes techniques. Formuler juste : *un VPN masque ton IP au site que tu visites et chiffre le trafic entre ton appareil et le serveur ; il ne bloque pas les malwares (sauf module dédié) et ne t'anonymise pas face à un compte auquel tu es connecté.*

---

## Catégorie H — Inflation et brochure

### H1. Inflation d'importance

*Marque un tournant, moment charnière, étape cruciale, à l'aube de, dans un monde en perpétuelle mutation.* À supprimer.

### H2. Inflation de notoriété

*Plébiscité par la presse, des millions d'utilisateurs, leader incontesté.* Une mention concrète datée vaut mieux qu'une liste vague.

### H3. Langage promotionnel

*Bouclier ultime, forteresse numérique, protection sans faille, tranquillité absolue.* L'IA tombe dedans dès qu'on lui parle de « sécurité ».

### H4. Analyses en participe présent

*Soulignant, mettant en lumière, témoignant de, illustrant, contribuant à, ouvrant la voie à.* À supprimer presque toujours.

### H5. Attributions floues

*Selon les experts, plusieurs sources indiquent.* Cite une source précise (APD, audit Cure53/Deloitte nommé et daté) ou ne cite pas.

### H6. Sections « Défis et perspectives » en clôture

Plan-type IA : un dernier paragraphe qui aligne *défis + opportunités + perspectives* sans rien dire. Supprime, ou remplace par un fait daté et chiffré.

---

## Catégorie I — Phrases creuses et délayage

| Forme IA | Forme courte |
|---|---|
| Afin de pouvoir atteindre cet objectif | Pour atteindre cet objectif |
| Dans le cadre de la mise en place | Pour |
| À l'heure actuelle | Aujourd'hui (ou rien) |
| Le VPN a la capacité de traiter | Le VPN traite |
| Il est important de noter que | ∅ |
| Force est de constater que | ∅ |
| En définitive | ∅ |

### Faux registre familier dans contexte pro

*ça envoie*, *ça déchire*, *fait le job* mélangés à un fond technique. Un humain choisit son registre et s'y tient. Le tutoiement maison (« tu ») est cohérent — le registre PMU ne l'est pas.

---

## Catégorie J — Le piège de la voix manquante

Un texte peut être nettoyé de tous les marqueurs ci-dessus et sonner encore IA, parce qu'il n'a **aucune voix**.

### Signes
- Toutes les phrases ont la même longueur
- Aucune opinion, juste des faits neutres alignés
- Aucun doute, aucune nuance
- Pas de première personne quand le contexte s'y prête
- Lit comme une fiche Wikipédia

### Comment ramener une voix

**Avoir une opinion.** *Franchement, le palier gratuit de Proton VPN suffit pour un usage occasionnel depuis la Belgique ; payer un abonnement juste pour « être protégé » sans savoir contre quoi, c'est se rassurer plus que se protéger* est plus humain que *ce VPN présente certains avantages et inconvénients*.

**Varier le rythme.** Phrases courtes. Puis une phrase plus longue, qui prend le temps de poser le contexte avant d'arriver à l'idée.

**Reconnaître la complexité.** *NordVPN est le plus rapide qu'on ait mesuré, mais son appli est dense et un débutant peut se perdre dans les réglages ; Surfshark est plus simple, un peu moins rapide.*

**Utiliser *on* / *je* quand c'est juste.** La première personne en test produit est une signature d'auteur (Léna Vanderbeke).

**Laisser passer un peu de désordre.** Une parenthèse, une digression brève. La structure parfaite sonne algorithmique.

---

## Compatibilité avec les autres skills/docs meilleur-robot-piscine.be

- **`docs/AUTHOR-lena-vanderbeke.md`** — voix de l'auteure (qui parle, comment). Référence prioritaire pour le ton.
- **`docs/SEO-GEO-REDACTION.md`** — structure pour Google + LLM, brief, outline, signaux GEO.
- **`skills/piscine-seo-audit`** — tokens, hiérarchie visuelle, ton maison (complémentaire, côté design).
- **`skills/piscine-data-integrity`** — zéro chiffre en prose ; ce skill traite la prose uniquement.
- **`skills/humaniser-fr`** (ce skill) — anti-IA mode production.
- **`skills/boileau`** — anti-IA mode review pure (audit + réécriture auditée).

Sur les triggers de rédaction, ces éléments se chargent en parallèle.

---

## Référence

Ce skill est l'adaptation VPN du skill `humaniser-fr` éprouvé sur l'écosystème éditorial belge francophone. Il s'inspire des observations terrain sur les contenus français générés par IA, et complète le skill `boileau` (alxbd/boileau, MIT) qui couvre la review pure.

---

## Catégorie P — clichés propres à la niche piscine (spécifique)

À bannir sans exception dans tout contenu de ce site :

*une eau cristalline toute l'année*, *le plaisir de la baignade sans les
contraintes*, *transformez votre piscine en oasis*, *l'entretien devient un
jeu d'enfant*, *fini la corvée du nettoyage*, *votre bassin impeccable sans
effort*, *le compagnon idéal de votre piscine*, *la propreté au bout des
doigts*, *prolongez la saison de baignade* employé mécaniquement.

Ces formules sont la signature exacte du contenu de revendeur de piscine, et
elles sont partout sur la SERP belge. Les utiliser, c'est se ranger
visuellement dans le groupe dont le site cherche à se distinguer.

### Fausses affirmations produit — drapeau E-E-A-T

À ne jamais écrire tel quel : *un robot remplace totalement l'entretien de
l'eau*, *plus besoin de traiter votre piscine*, *nettoie 100 % du bassin*,
*compatible avec toutes les piscines*.

Ce sont à la fois des tics d'IA et des inexactitudes techniques. Formuler
juste : un robot ramasse les débris et brosse les surfaces ; il ne remplace
ni le traitement chimique, ni la filtration, ni l'épuisette après un orage.
La compatibilité dépend du revêtement, de la forme, de la pente du fond et de
la présence d'un escalier.

### Le vocabulaire technique établi n'est pas un calque

*liner*, *skimmer*, *coque polyester*, *ligne d'eau*, *pente composée*,
*micron*, *inverter* : termes techniques du métier, à garder tels quels. Ce
ne sont pas des anglicismes à corriger.
