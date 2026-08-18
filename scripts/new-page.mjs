#!/usr/bin/env node
/**
 * new-page — scaffold d'une page MDX conforme au gabarit de son silo.
 * Usage : npm run new-page -- --type comparison --slug robot-piscine-sans-fil
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const get = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : null; };

const type = get("type"), slug = get("slug");
const TYPES = ["comparison", "review", "versus", "brand", "guide", "problem", "parts", "tool", "hub"];
if (!type || !slug || !TYPES.includes(type)) {
  console.error(`Usage : npm run new-page -- --type <${TYPES.join("|")}> --slug <slug>`);
  process.exit(1);
}

const FAQ_MIN = { problem: 4, tool: 4 };
const DENSITY = { comparison: "high", review: "high", versus: "high", brand: "medium", guide: "low", problem: "none", parts: "low", tool: "low", hub: "low" };

const market = process.env.MARKET ?? "be-fr";
const dir = join("content", market, type);
mkdirSync(dir, { recursive: true });
const file = join(dir, `${slug}.mdx`);
if (existsSync(file)) { console.error(`✗ ${file} existe déjà. Enrichir plutôt que dupliquer.`); process.exit(1); }

const today = new Date().toISOString().slice(0, 10);
const faqCount = FAQ_MIN[type] ?? 6;

const fm = `---
title: "TODO — 50-60 car., {{YEAR}} jamais en dur"
description: "TODO — 140-155 car."
slug: "${slug}"
silo: ${type}
cluster: "TODO — doit exister dans data/keywords/clusters-be-fr.csv"
headTerm: "TODO"
clusterVolume: 0
intent: "TODO — informational | commercial | transactional | support"
affiliateDensity: ${DENSITY[type]}
author: "TODO"
datePublished: "${today}"
dateModified: "${today}"
tldr:
  - "TODO"
  - "TODO"
  - "TODO"
faq:
${Array.from({ length: faqCount }, () => `  - question: "TODO"\n    answer: "TODO"`).join("\n")}
products: []
links: []
---

# TODO — H1 sans marqueur de fraîcheur, sans année en dur

TODO — chapô de 40-60 mots qui répond directement à l'intention.

## TODO — H2 en question ?

TODO — réponse directe en moins de 60 mots, puis explication, puis exemple
belge concret. Aucun chiffre en prose : tout passe par un composant.
`;

writeFileSync(file, fm);
console.log(`✓ ${file}`);
console.log(`\nAvant d'écrire :`);
console.log(`  1. Analyser la SERP google.be et écrire le content gap dans DECISIONS.md`);
console.log(`  2. Ajouter l'entrée dans data/page-registry.ts`);
console.log(`  3. Déclarer le maillage bidirectionnel dans data/internal-links.json`);
console.log(`  4. Charger skills/humaniser-fr en mode production AVANT la première ligne`);
