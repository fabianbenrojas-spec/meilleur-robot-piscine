#!/usr/bin/env node
/**
 * import-catalogue — CSV → data/products/[slug].json
 *
 * Enveloppe chaque valeur factuelle dans la structure Sourced<T> (valeur +
 * sourceUrl + sourcedAt) et refuse d'écrire si la provenance est incomplète.
 *
 * Ce qui n'est JAMAIS importé : scores, avantages, inconvénients, verdict,
 * testeEnMain. Ces champs s'écrivent à la main au moment de la rédaction.
 *
 * Usage : node scripts/import-catalogue.mjs data/catalogue-a-remplir.csv
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [, , csvPath] = process.argv;
if (!csvPath) {
  console.error("Usage : node scripts/import-catalogue.mjs <fichier.csv>");
  process.exit(1);
}

const OUT = "data/products";
const MAX_AGE_DAYS = 90;
mkdirSync(OUT, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift();
  return rows.filter(r => r.some(c => c.trim())).map(r =>
    Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

const num = v => (v === "" ? null : Number(v));
const bool = v => (v === "" ? null : v.toLowerCase() === "true");
const list = v => (v === "" ? null : v.split(",").map(s => s.trim()).filter(Boolean));

let written = 0, skipped = 0, errors = 0;

for (const r of parseCsv(readFileSync(csvPath, "utf8"))) {
  const src = r.url_produit_constructeur;
  const now = new Date().toISOString().slice(0, 10);

  // Une ligne non renseignée n'est pas une erreur : c'est une ligne à faire.
  const hasSpecs = ["surface_max_m2", "autonomie_min", "debit_filtration_lh", "poids_kg"]
    .some(k => r[k] !== "");
  if (!hasSpecs && !r.asin_amazon_be) { skipped++; continue; }

  if (hasSpecs && !src) {
    console.error(`✗ ${r.slug} : specs présentes sans url_produit_constructeur. Une donnée sans source n'entre pas dans le catalogue.`);
    errors++; continue;
  }
  if (r.prix_releve_eur && !r.releve_le) {
    console.error(`✗ ${r.slug} : prix sans releve_le.`);
    errors++; continue;
  }
  if (r.releve_le) {
    const age = Math.floor((Date.now() - Date.parse(r.releve_le)) / 86_400_000);
    if (Number.isNaN(age)) { console.error(`✗ ${r.slug} : releve_le illisible « ${r.releve_le} ».`); errors++; continue; }
    if (age > MAX_AGE_DAYS) { console.error(`✗ ${r.slug} : relevé vieux de ${age} j, à refaire avant import.`); errors++; continue; }
  }

  const S = (value) => ({ value, sourceUrl: src || null, sourcedAt: now });

  const merchants = [];
  if (r.asin_amazon_be) {
    merchants.push({
      merchantId: "amazon-be",
      ref: r.asin_amazon_be,
      url: `https://www.amazon.com.be/dp/${r.asin_amazon_be}/`,
      prix: num(r.prix_releve_eur),
      devise: "EUR",
      releveLe: r.releve_le,
      disponibilite: r.disponibilite || "indisponible",
      delaiLivraisonJours: null,
    });
  }

  const path = join(OUT, `${r.slug}.json`);
  // On ne réécrit jamais par-dessus l'éditorial déjà rédigé.
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;

  const product = {
    slug: r.slug,
    nom: `${r.marque[0].toUpperCase()}${r.marque.slice(1)} ${r.modele}`,
    marque: r.marque,
    gamme: null,
    annee: null,
    type: r.type,
    specs: {
      surfaceMaxM2: sourced(num(r.surface_max_m2)),
      longueurMaxBassinM: sourced(num(r.longueur_max_bassin_m)),
      profondeurMaxM: sourced(num(r.profondeur_max_m)),
      zonesNettoyees: sourced(list(r.zones_nettoyees)),
      autonomieMin: sourced(num(r.autonomie_min)),
      tempsChargeMin: sourced(num(r.temps_charge_min)),
      cyclesMin: sourced(null),
      longueurCableM: sourced(num(r.longueur_cable_m)),
      cableAntitorsion: sourced(null),
      debitFiltrationLh: sourced(num(r.debit_filtration_lh)),
      finesseFiltrationMicrons: sourced(num(r.finesse_filtration_microns)),
      capaciteFiltreL: sourced(num(r.capacite_filtre_l)),
      typeFiltre: sourced(r.type_filtre || null),
      typeBrosse: sourced(r.type_brosse || null),
      poidsKg: sourced(num(r.poids_kg)),
      puissanceW: sourced(num(r.puissance_w)),
      pilotage: sourced(list(r.pilotage)),
      sortieDeLEauAutonome: sourced(null),
      chariotInclus: sourced(bool(r.chariot_inclus)),
      garantieMois: sourced(num(r.garantie_mois)),
    },
    compatibilite: {
      revetements: sourced(list(r.revetements)),
      formes: sourced(list(r.formes)),
      horsSol: sourced(bool(r.hors_sol)),
      enterree: sourced(bool(r.enterree)),
      fondPlat: sourced(null),
      penteComposee: sourced(bool(r.pente_composee)),
      escalier: sourced(bool(r.escalier)),
    },
    // Éditorial : préservé s'il existe, jamais généré.
    noteGlobale: existing?.noteGlobale ?? null,
    scores: existing?.scores ?? null,
    testeEnMain: existing?.testeEnMain ?? false,
    dateTest: existing?.dateTest ?? null,
    avantages: existing?.avantages ?? [],
    inconvenients: existing?.inconvenients ?? [],
    verdict: existing?.verdict ?? "",
    pourQui: existing?.pourQui ?? "",
    pasPourQui: existing?.pasPourQui ?? "",
    merchants,
    categories: existing?.categories ?? [],
    image: r.image_url || existing?.image || "",
    galerie: existing?.galerie ?? [],
    i18n: existing?.i18n ?? {},
    updatedAt: new Date().toISOString(),
    isActive: existing?.isActive ?? false,
  };

  writeFileSync(path, JSON.stringify(product, null, 2) + "\n");
  written++;
}

console.log(`\nimport-catalogue : ${written} écrit(s), ${skipped} ligne(s) vide(s) ignorée(s), ${errors} erreur(s)`);
if (written > 0) {
  console.log("Les fiches sont créées avec isActive:false et testeEnMain:false.");
  console.log("Les champs éditoriaux se remplissent à la rédaction, pas ici.");
}
process.exit(errors > 0 ? 1 : 0);
