#!/usr/bin/env node
/** check-images — trois variantes présentes par produit actif, poids sous les seuils. */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_KB = { 400: 25, 800: 60, 1200: 120 };
const DIR = "public/images/products";
let errors = 0, warnings = 0;

if (!existsSync("data/products")) { console.log("check-images : aucun produit, ignoré"); process.exit(0); }

for (const f of readdirSync("data/products").filter((x) => x.endsWith(".json"))) {
  const p = JSON.parse(readFileSync(join("data/products", f), "utf8"));
  if (!p.isActive) continue;
  if (!p.imageKey) { console.error(`✗ ${p.slug} — imageKey manquante`); errors++; continue; }
  for (const w of [400, 800, 1200]) {
    const file = join(DIR, `${p.imageKey}-${w}.webp`);
    if (!existsSync(file)) { console.error(`✗ ${file} absent — npm run build:images`); errors++; continue; }
    const kb = Math.round(statSync(file).size / 1024);
    if (kb > MAX_KB[w]) { console.warn(`⚠ ${file} : ${kb} KB (seuil ${MAX_KB[w]})`); warnings++; }
  }
}
console.log(`\ncheck-images : ${errors} erreur(s), ${warnings} avertissement(s)`);
process.exit(errors > 0 ? 1 : 0);
