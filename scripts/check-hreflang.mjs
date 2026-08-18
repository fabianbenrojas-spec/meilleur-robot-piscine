#!/usr/bin/env node
/**
 * check-hreflang — réciprocité des contreparties déclarées.
 *
 * Une déclaration non retournée par la page cible est ignorée par Google.
 * C'est l'erreur la plus fréquente et la plus silencieuse d'un déploiement
 * multi-marché.
 *
 * Règle absolue : pas de contrepartie = pas de déclaration. Jamais un repli
 * vers la home ni vers un parent — le crossSiteMapper du réseau aspirateurs
 * renvoie '/' quand la page n'existe pas, ce qui déclare la home comme
 * alternative d'une page catégorie.
 */
import { readFileSync, existsSync } from "node:fs";

if (!existsSync("data/page-registry.ts")) { console.log("check-hreflang : registre absent, ignoré"); process.exit(0); }

const src = readFileSync("data/page-registry.ts", "utf8");
let errors = 0;

// Un seul marché déployé : rien à vérifier, mais on interdit les replis.
if (/alternates:\s*\{[^}]*["'](\/|\/index)["']/.test(src)) {
  console.error("✗ alternates pointe vers la racine — repli interdit.");
  errors++;
}

console.log(`\ncheck-hreflang : ${errors} erreur(s)`);
console.log("Note : la réciprocité inter-marchés devient vérifiable au déploiement du 2e marché.");
process.exit(errors > 0 ? 1 : 0);
