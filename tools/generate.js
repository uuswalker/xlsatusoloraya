#!/usr/bin/env node
/**
 * Generator halaman kota XL SATU Solo Raya
 * Baca data-kota.json + template-kota.html -> generate 6 halaman wifi-<kota>/index.html
 *
 * Cara pakai:
 *   node generate.js
 *
 * Setelah edit data-kota.json (misal ganti harga, deskripsi, dll), tinggal run ulang.
 */
const fs = require('fs');
const path = require('path');

const BUILD_DIR = __dirname;
const OUTPUT_ROOT = path.join(__dirname, 'output');

const template = fs.readFileSync(path.join(BUILD_DIR, 'template-kota.html'), 'utf-8');
const { cities } = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'data-kota.json'), 'utf-8'));

function renderAreaCards(activeSlug, cities) {
  // Replace each {{AREA_CARD:slug:label}} marker with the full <a> block,
  // highlighting the one matching the current page's slug.
  return (html) => html.replace(/\{\{AREA_CARD:([a-z-]+):([^}]+)\}\}/g, (match, slug, label) => {
    const isActive = slug === activeSlug;
    const style = isActive
      ? 'text-decoration:none; border-color:var(--green); background:var(--green-light);'
      : 'text-decoration:none;';
    const city = cities.find(c => c.slug === slug);
    const tipe = city
      ? (city.has_fiber && city.has_wireless ? 'Fiber & Wireless' : city.has_fiber ? 'Fiber Optic' : 'Wireless')
      : 'Fiber & Wireless';
    return `<a href="/${slug}/" class="area-card" style="${style}">
        <i class="fas fa-city"></i>
        <div class="area-name">${label}</div>
        <div class="area-desc">${tipe} tersedia</div>
      </a>`;
  });
}

let generated = 0;
for (const city of cities) {
  if (city.skip_generate) {
    console.log(`⏭ ${city.slug}/ — dilewati (skip_generate)`);
    continue;
  }
  let html = template;

  // Conditional blocks: {{#has_fiber}}...{{/has_fiber}} / {{#has_wireless}}...{{/has_wireless}}
  // If flag is truthy, keep content; if falsy, remove entire block (including markers).
  html = html.replace(/\{\{#has_fiber\}\}([\s\S]*?)\{\{\/has_fiber\}\}/g,
    city.has_fiber ? '$1' : '');
  html = html.replace(/\{\{#has_wireless\}\}([\s\S]*?)\{\{\/has_wireless\}\}/g,
    city.has_wireless ? '$1' : '');

  // Simple {{key}} substitutions
  for (const [key, value] of Object.entries(city)) {
    const re = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(re, value);
  }

  // slug placeholder (used in canonical/og:url etc.)
  html = html.replace(/{{slug}}/g, city.slug);

  // Natural-language kecamatan list: "A, B, C, dan D"
  if (Array.isArray(city.kecamatan_list) && city.kecamatan_list.length > 0) {
    const list = city.kecamatan_list;
    const kecamatanText = list.length === 1
      ? list[0]
      : list.slice(0, -1).join(', ') + ', dan ' + list[list.length - 1];
    html = html.replace(/{{kecamatan_text}}/g, kecamatanText);
  }

  // URL-encoded WA text placeholders (match site's existing style: only spaces -> %20, commas stay literal)
  const waEncode = (s) => encodeURIComponent(s).replace(/%2C/g, ',');
  html = html.replace(/{{wa_float_text_url}}/g, waEncode(city.wa_float_text));
  html = html.replace(/{{wa_widget_text_url}}/g, waEncode(city.wa_widget_text));

  // Area card grid with active-city highlight
  html = renderAreaCards(city.slug, cities)(html);

  const outDir = path.join(OUTPUT_ROOT, city.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  generated++;
  console.log(`✓ ${city.slug}/index.html`);
}

console.log(`\nSelesai. ${generated} halaman kota di-generate ke: ${OUTPUT_ROOT}`);
