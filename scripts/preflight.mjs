#!/usr/bin/env node
/**
 * preflight — inventaire des mécanismes canoniques + garde-fous structurels.
 *
 * Un mécanisme = une seule implémentation. Ce script existe pour qu'un agent
 * voie l'existant AVANT de créer un doublon, et pour attraper les dérives
 * structurelles que les autres contrôles ne voient pas.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

let errors = 0;
const warn = (m) => console.warn(`⚠ ${m}`);
const err = (m) => { console.error(`✗ ${m}`); errors++; };

// ── Inventaire ───────────────────────────────────────────────────────────────
console.log("Mécanismes canoniques\n");
const canonical = [
  ["Config marché", "config/site.config.ts", "siteConfig, résolu depuis MARKET"],
  ["Registre marchés", "config/markets/index.ts", "be-fr, be-nl, fr-fr"],
  ["URLs internes", "config/routes.config.ts", "routes.*, routeFor(), absoluteUrlFor()"],
  ["Liens affiliés", "lib/affiliate.ts", "resolveMerchantUrl(), subIdFromPath()"],
  ["Catalogue", "lib/products.ts", "getProduct(), findOffer(), getVisibleOffers()"],
  ["Images", "lib/images.ts", "productImage(), productImageProps()"],
  ["Schéma produit", "data/product.schema.ts", "Product, Sourced<T>, RATING_WEIGHTS"],
  ["Registre pages", "data/page-registry.ts", "une entrée par page commerciale"],
  ["Maillage", "data/internal-links.json", "graphe bidirectionnel"],
  ["Marchands", "data/merchants.ts", "MERCHANTS"],
];
for (const [label, path, what] of canonical) {
  const ok = existsSync(path);
  console.log(`  ${ok ? "✓" : "✗"} ${label.padEnd(16)} ${path.padEnd(32)} ${what}`);
  if (!ok) err(`${path} est absent — mécanisme canonique manquant`);
}

// ── Garde-fous structurels ───────────────────────────────────────────────────
console.log("\nGarde-fous\n");

function walk(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, ext, out);
    else if (ext.some((x) => p.endsWith(x))) out.push(p);
  }
  return out;
}

const code = [...walk("app", [".ts", ".tsx"]), ...walk("lib", [".ts"]), ...walk("components", [".tsx"])];

// 1. Aucune dépendance de service à l'exécution (principe A)
for (const f of code) {
  const src = readFileSync(f, "utf8");
  if (/@supabase|createClient\(|prisma|mongodb|redis/i.test(src)) {
    err(`${f} — client de service détecté. Le contenu vit en MDX + JSON versionnés.`);
  }
}

// 2. Aucun ISR ni rendu dynamique hors /go/
for (const f of code) {
  if (f.includes("app/go/")) continue;
  const src = readFileSync(f, "utf8");
  if (/export const revalidate/.test(src)) err(`${f} — revalidate interdit : 100 % SSG.`);
  if (/export const dynamic\s*=\s*["']force-dynamic["']/.test(src))
    err(`${f} — force-dynamic hors /go/.`);
}

// 3. next/image interdit
for (const f of code) {
  if (/from ["']next\/image["']/.test(readFileSync(f, "utf8")))
    err(`${f} — next/image active un compteur facturé. Utiliser lib/images.ts.`);
}

// 4. Notes inventées
for (const f of code) {
  const src = readFileSync(f, "utf8");
  if (/rating\s*\|\|\s*\d|ratingValue:\s*[^,\n]*\|\|/.test(src))
    err(`${f} — valeur de note par défaut. Donnée absente = bloc absent.`);
  if (/"@type":\s*"Review"[\s\S]{0,300}"@type":\s*"Organization"/.test(src))
    err(`${f} — Review avec author Organization. L'auteur est une Person nommée.`);
}

// 5. Tracking ID présent pour le marché courant
const market = process.env.MARKET ?? "be-fr";
const mf = `config/markets/${market}.ts`;
if (existsSync(mf) && /amazon:\s*""/.test(readFileSync(mf, "utf8")))
  err(`${mf} — affiliateTags.amazon vide. Aucun lien /go/ ne peut être généré.`);

// 6. StoreID jamais dans une URL
for (const f of [...code, ...walk("data", [".ts", ".json"])]) {
  if (/[?&]tag=meilleurteste/.test(readFileSync(f, "utf8")))
    err(`${f} — StoreID utilisé comme tag de lien. La commission part ailleurs.`);
}

// 7. Tout script déclaré existe
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
for (const [name, cmd] of Object.entries(pkg.scripts ?? {})) {
  const m = cmd.match(/scripts\/[\w-]+\.(mjs|ts)/);
  if (m && !existsSync(m[0])) err(`package.json "${name}" référence ${m[0]}, absent.`);
}

// 8. Pages-gabarits sans contenu
for (const f of walk("content", [".mdx"])) {
  const body = readFileSync(f, "utf8").split(/^---$/m)[2] ?? "";
  if (body.trim().length < 200) warn(`${f} — moins de 200 caractères de corps. Ne pas publier.`);
}

console.log(`\npreflight : ${errors} erreur(s)`);
process.exit(errors > 0 ? 1 : 0);
