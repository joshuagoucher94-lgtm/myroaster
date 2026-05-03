/**
 * Prints INSERT SQL for fallbackCatalogue (used for remote seeding via Supabase SQL editor / MCP).
 * Run: npx tsx scripts/export-catalogue-seed-sql.ts
 */
import { fallbackCatalogue } from "../src/db/catalogue-data";

function esc(s: string) {
  return s.replaceAll("'", "''");
}

function arrSql(a: string[]) {
  return `ARRAY[${a.map((x) => `'${esc(x)}'`).join(",")}]::text[]`;
}

const lines: string[] = [];

lines.push("BEGIN;");
lines.push(
  "TRUNCATE TABLE product_prices, order_items, orders, coffee_products, bag_options, bag_sizes, label_options, grind_options CASCADE;"
);

for (const c of fallbackCatalogue.coffees) {
  lines.push(
    `INSERT INTO coffee_products (id, name, slug, description, tasting_notes, origin_type, shop_category_slug, subtitle, roast_level, hero_image_path, active) VALUES ('${esc(c.id)}', '${esc(c.name)}', '${esc(c.slug)}', '${esc(c.description)}', ${arrSql(c.tastingNotes)}, '${esc(c.originType)}', '${esc(c.shopCategorySlug)}', '${esc(c.subtitle)}', '${esc(c.roastLevel)}', '${esc(c.heroImagePath)}', true);`
  );
}

for (const b of fallbackCatalogue.bags) {
  lines.push(
    `INSERT INTO bag_options (id, name, slug, colour, finish, mockup_asset_path, active) VALUES ('${esc(b.id)}', '${esc(b.name)}', '${esc(b.slug)}', '${esc(b.colour)}', '${esc(b.finish)}', '${esc(b.mockupAssetPath)}', true);`
  );
}

for (const s of fallbackCatalogue.sizes) {
  lines.push(
    `INSERT INTO bag_sizes (id, label, slug, grams, active) VALUES ('${esc(s.id)}', '${esc(s.label)}', '${esc(s.slug)}', ${s.grams}, true);`
  );
}

for (const l of fallbackCatalogue.labels) {
  const safe = JSON.stringify(l.safeArea).replaceAll("'", "''");
  const place = JSON.stringify(l.mockupPlacement).replaceAll("'", "''");
  lines.push(
    `INSERT INTO label_options (id, name, slug, shape, width_mm, height_mm, safe_area, mockup_placement, active) VALUES ('${esc(l.id)}', '${esc(l.name)}', '${esc(l.slug)}', '${esc(l.shape)}', '${l.widthMm}', '${l.heightMm}', '${safe}'::jsonb, '${place}'::jsonb, true);`
  );
}

for (const g of fallbackCatalogue.grinds) {
  lines.push(
    `INSERT INTO grind_options (id, name, slug, description, active) VALUES ('${esc(g.id)}', '${esc(g.name)}', '${esc(g.slug)}', '${esc(g.description)}', true);`
  );
}

for (const p of fallbackCatalogue.prices) {
  lines.push(
    `INSERT INTO product_prices (id, coffee_product_id, bag_option_id, bag_size_id, min_quantity, unit_amount_pence, setup_fee_pence, currency) VALUES ('${esc(p.id)}', '${esc(p.coffeeProductId)}', '${esc(p.bagOptionId)}', '${esc(p.bagSizeId)}', ${p.minQuantity}, ${p.unitAmountPence}, ${p.setupFeePence}, '${esc(p.currency)}');`
  );
}

lines.push("COMMIT;");

console.log(lines.join("\n"));
