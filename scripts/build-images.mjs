#!/usr/bin/env node
/**
 * build-images — génère les trois variantes webp à l'INGESTION.
 *
 * Vercel facture l'Image Optimization à l'exécution, sur un compteur qui ne
 * consomme pas le TB inclus (DOCTRINE-RESEAU §3.3 et §4). Ce script fait la
 * même chose une fois pour toutes, gratuitement, avec un meilleur contrôle du
 * résultat.
 *
 * Node plutôt que Python : le repo n'a qu'une chaîne d'outils, un seul
 * `npm ci` en CI, et sharp est déjà l'encodeur webp que Next embarque.
 *
 *   npm i -D sharp
 *   npm run build:images -- source/
 *
 * Nommage : <imageKey>-{400,800,1200}.webp. La clé est locale-agnostique :
 * un repo qui sert trois marchés porte le visuel une seule fois.
 */
import { readdirSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, parse } from "node:path";

const SRC = process.argv[2] ?? "assets/product-sources";
const OUT = "public/images/products";
const VARIANTS = [400, 800, 1200];
const MAX_KB = { 400: 25, 800: 60, 1200: 120 };

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("✗ sharp absent. npm i -D sharp");
  process.exit(1);
}

if (!existsSync(SRC)) { console.error(`✗ dossier source absent : ${SRC}`); process.exit(1); }
mkdirSync(OUT, { recursive: true });

let made = 0, skipped = 0, heavy = 0;

for (const file of readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
  const key = parse(file).name;
  const input = join(SRC, file);
  const meta = await sharp(input).metadata();

  for (const w of VARIANTS) {
    // Jamais d'agrandissement : si la source fait 900 px, on ne génère pas de 1200.
    if (meta.width && meta.width < w) { skipped++; continue; }
    const out = join(OUT, `${key}-${w}.webp`);
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(out);
    const kb = Math.round(statSync(out).size / 1024);
    if (kb > MAX_KB[w]) { console.warn(`⚠ ${out} : ${kb} KB (seuil ${MAX_KB[w]})`); heavy++; }
    made++;
  }
}

console.log(`\nbuild-images : ${made} variante(s), ${skipped} évitée(s) (source trop petite), ${heavy} au-dessus du seuil`);
