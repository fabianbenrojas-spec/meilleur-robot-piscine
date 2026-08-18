#!/usr/bin/env node
/**
 * check-placeholders — deux contrôles sur le contenu MDX.
 *
 * 1. Bloquant : placeholders oubliés (TODO, XXX, lorem, [à compléter]).
 * 2. Bloquant : chiffres en prose hors composant — la régression n° 1 du
 *    projet. Un chiffre en dur se périme en silence et finit par contredire
 *    le composant d'à côté.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "content";
const PLACEHOLDERS = /\b(TODO|FIXME|XXX|lorem ipsum|\[à compléter\]|\[TBD\])\b/i;

/** Unités produit qui n'ont rien à faire en prose. */
const NUMBERS_IN_PROSE =
  /\d+[\s ]?(€|EUR|m²|m2|microns?|µm|L\/h|litres?|kg|W|dB|min|minutes?|heures?|h\b|mètres?|m\b)/i;

/** Ce qui reste autorisé : années, versions de modèle, garantie légale. */
const ALLOWED = [
  /\b(19|20)\d{2}\b/,
  /garantie légale de deux ans/i,
  /\{YEAR\}/,
];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".mdx")) out.push(p);
  }
  return out;
}

let blocking = 0;

for (const file of walk(ROOT)) {
  const lines = readFileSync(file, "utf8").split("\n");
  let inFrontmatter = false;

  lines.forEach((line, i) => {
    if (line.trim() === "---") { inFrontmatter = !inFrontmatter; return; }
    if (inFrontmatter) return;
    // On ignore les lignes de composant : c'est là que les chiffres vivent.
    if (/^\s*<[A-Z]/.test(line)) return;
    if (/^\s*\|/.test(line)) return;

    if (PLACEHOLDERS.test(line)) {
      console.error(`✗ ${file}:${i + 1} — placeholder : ${line.trim().slice(0, 80)}`);
      blocking++;
    }
    if (NUMBERS_IN_PROSE.test(line) && !ALLOWED.some((re) => re.test(line))) {
      console.error(`✗ ${file}:${i + 1} — chiffre en prose : ${line.trim().slice(0, 80)}`);
      console.error(`   → passer par un composant adossé à data/products/, ou ajouter le champ manquant au schéma.`);
      blocking++;
    }
  });
}

console.log(`\ncheck-placeholders : ${blocking} problème(s) bloquant(s)`);
process.exit(blocking > 0 ? 1 : 0);
