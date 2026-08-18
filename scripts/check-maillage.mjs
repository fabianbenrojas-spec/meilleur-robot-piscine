#!/usr/bin/env node
/**
 * check-maillage — bidirectionnalité, cibles existantes, densité.
 *
 * Source de vérité : data/internal-links.ts (importé en JSON via le build,
 * ou parsé directement ici en dev). La CI casse sur un lien unidirectionnel :
 * un lien qui ne revient pas est un lien qui fuit du PageRank.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_LINKS_PER_PAGE = 6;
const MIN_PILLAR_LINKS = 2;

const raw = readFileSync("data/internal-links.json", "utf8");
/** @type {Record<string, string[]>} */
const graph = JSON.parse(raw);

const published = new Set();
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".mdx")) {
      const fm = readFileSync(p, "utf8").match(/^---\n([\s\S]*?)\n---/);
      const slug = fm?.[1].match(/^slug:\s*"?([^"\n]+)"?/m)?.[1];
      if (slug) published.add(slug.startsWith("/") ? slug : `/${slug}`);
    }
  }
}
walk("content");

let errors = 0;

// Bootstrap : tant qu'aucune page n'est publiée, le graphe est un exemple.
if (published.size === 0) {
  console.log("check-maillage : aucune page publiée, contrôle ignoré (bootstrap)");
  process.exit(0);
}

for (const [from, targets] of Object.entries(graph)) {
  // Les clés de documentation ne sont pas des nœuds du graphe.
  if (from.startsWith("_") || !Array.isArray(targets)) continue;
  if (targets.length > MAX_LINKS_PER_PAGE) {
    console.error(`✗ ${from} : ${targets.length} liens contextuels (max ${MAX_LINKS_PER_PAGE})`);
    errors++;
  }
  if (targets.length < MIN_PILLAR_LINKS) {
    console.error(`✗ ${from} : ${targets.length} lien(s), minimum ${MIN_PILLAR_LINKS}`);
    errors++;
  }
  for (const to of targets) {
    if (!published.has(to)) {
      console.error(`✗ ${from} → ${to} : cible non publiée`);
      errors++;
    }
    if (!(graph[to] ?? []).includes(from)) {
      console.error(`✗ ${from} → ${to} : lien unidirectionnel, réciproque manquant`);
      errors++;
    }
    // Interdits structurels
    if (from.startsWith("/probleme/") && to.startsWith("/comparatif/")) {
      console.error(`✗ ${from} → ${to} : une page probleme ne pointe jamais vers un comparatif`);
      errors++;
    }
  }
}

console.log(`\ncheck-maillage : ${errors} erreur(s)`);
process.exit(errors > 0 ? 1 : 0);
