#!/usr/bin/env node
/**
 * check-prices — échoue si un prix relevé a plus de 90 jours sur une fiche
 * active, ou si un prix est présent sans date de relevé.
 *
 * Le prix relevé daté est le seul actif du site qui ne se copie pas. Un prix
 * périmé affiché comme frais est pire qu'aucun prix.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "data/products";
const MAX_AGE_DAYS = 90;
const now = Date.now();

let errors = 0;
let warnings = 0;

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const p = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  if (p.isActive === false) continue;

  for (const m of p.merchants ?? []) {
    if (m.prix != null && !m.releveLe) {
      console.error(`✗ ${p.slug} — ${m.merchantId} : prix sans releveLe`);
      errors++;
      continue;
    }
    if (!m.releveLe) continue;

    const ageDays = Math.floor((now - Date.parse(m.releveLe)) / 86_400_000);
    if (Number.isNaN(ageDays)) {
      console.error(`✗ ${p.slug} — ${m.merchantId} : releveLe illisible « ${m.releveLe} »`);
      errors++;
    } else if (ageDays > MAX_AGE_DAYS) {
      console.error(`✗ ${p.slug} — ${m.merchantId} : prix relevé il y a ${ageDays} j`);
      errors++;
    } else if (ageDays > 60) {
      console.warn(`⚠ ${p.slug} — ${m.merchantId} : prix relevé il y a ${ageDays} j, à rafraîchir`);
      warnings++;
    }
  }

  if ((p.merchants ?? []).length === 0) {
    console.warn(`⚠ ${p.slug} : aucune offre marchand. La fiche reste valide, mais elle doit dire où le modèle s'achète en Belgique.`);
    warnings++;
  }
}

console.log(`\ncheck-prices : ${errors} erreur(s), ${warnings} avertissement(s)`);
process.exit(errors > 0 ? 1 : 0);
