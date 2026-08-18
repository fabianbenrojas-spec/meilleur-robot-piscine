#!/usr/bin/env node
/**
 * check-seo — présence et forme des signaux SEO sur chaque MDX.
 * Ne valide PAS la pertinence : une page peut passer et rester un doublon
 * d'intent. Le fond reste skills/piscine-seo-audit.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

let errors = 0, warnings = 0;
const err = (m) => { console.error(`✗ ${m}`); errors++; };
const warn = (m) => { console.warn(`⚠ ${m}`); warnings++; };

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".mdx")) out.push(p);
  }
  return out;
}

const REQUIRED = ["title", "description", "slug", "silo", "cluster", "headTerm", "author", "datePublished", "dateModified", "tldr", "faq"];
const BANNED_H2 = /^#{2}\s*(mon avis honnête|verdict final|le piège à éviter|sans langue de bois|le vrai test|ce que personne ne vous dit|ce qu'il faut savoir)/im;

const clusters = existsSync("data/keywords/clusters-be-fr.csv")
  ? new Set(readFileSync("data/keywords/clusters-be-fr.csv", "utf8").split("\n").slice(1).map((l) => l.split(",").pop()?.trim()))
  : new Set();

const titles = new Map();

for (const file of walk("content")) {
  const raw = readFileSync(file, "utf8");
  const parts = raw.split(/^---$/m);
  if (parts.length < 3) { err(`${file} — pas de frontmatter`); continue; }
  const fm = parts[1], body = parts.slice(2).join("---");

  for (const k of REQUIRED) {
    if (!new RegExp(`^${k}:`, "m").test(fm)) err(`${file} — frontmatter: ${k} manquant`);
  }

  const title = fm.match(/^title:\s*"?(.+?)"?\s*$/m)?.[1];
  if (title) {
    if (title.length > 60) warn(`${file} — title de ${title.length} car. (cible 50-60)`);
    if (/\b20\d{2}\b/.test(title)) err(`${file} — année en dur dans le title. Utiliser {{YEAR}}.`);
    const prev = titles.get(title);
    if (prev) err(`${file} — title identique à ${prev} : cannibalisation`);
    titles.set(title, file);
  }

  const desc = fm.match(/^description:\s*"?(.+?)"?\s*$/m)?.[1];
  if (desc && (desc.length < 120 || desc.length > 155))
    warn(`${file} — description de ${desc.length} car. (cible 140-155)`);

  const cluster = fm.match(/^cluster:\s*"?(.+?)"?\s*$/m)?.[1];
  if (cluster && clusters.size && !clusters.has(cluster))
    warn(`${file} — cluster "${cluster}" absent de clusters-be-fr.csv`);

  // H1 : un seul, et JAMAIS de marqueur de fraîcheur.
  const h1s = body.match(/^#\s+.+$/gm) ?? [];
  if (h1s.length > 1) err(`${file} — ${h1s.length} H1`);
  for (const h1 of h1s) {
    if (/\{\{\s*(YEAR|MONTH_YEAR|NEXT_YEAR)\s*\}\}/i.test(h1))
      err(`${file} — marqueur de fraîcheur dans le H1. Réservé au title et à la meta.`);
    if (/\b20\d{2}\b/.test(h1)) err(`${file} — année en dur dans le H1`);
  }

  // Marqueurs interdits dans le corps
  if (/\{\{\s*(YEAR|MONTH_YEAR|NEXT_YEAR)\s*\}\}/i.test(body.replace(/^#\s+.+$/gm, "")))
    err(`${file} — marqueur de fraîcheur dans le corps. Réservé au title et à la meta.`);

  // 70 % des H2 en question
  const h2s = body.match(/^##\s+(.+)$/gm) ?? [];
  if (h2s.length) {
    const q = h2s.filter((h) => /\?|^##\s*(faut-il|quel|comment|pourquoi|est-ce|combien|où|quand)/i.test(h)).length;
    const ratio = q / h2s.length;
    if (ratio < 0.7) warn(`${file} — ${Math.round(ratio * 100)} % de H2 en question (cible 70 %)`);
  }
  if (BANNED_H2.test(body)) err(`${file} — H2 de la liste noire (docs/SEO-GEO-REDACTION.md §3.3)`);

  // Un FAQPage écrit à la main double celui généré depuis faq:
  if (/"@type":\s*"FAQPage"/.test(body))
    err(`${file} — FAQPage écrit à la main. Il est généré depuis le frontmatter faq:.`);

  // Saut de niveau
  if (/^####\s/m.test(body) && !/^###\s/m.test(body)) err(`${file} — saut de niveau Hn`);
}

console.log(`\ncheck-seo : ${errors} erreur(s), ${warnings} avertissement(s)`);
process.exit(errors > 0 ? 1 : 0);
