/**
 * Quick audit: every ready category has 4 products per subcategory (+ sale).
 * Requires `npm run dev` and DEMO_CATALOG=true.
 * Run: DEMO_CATALOG=true node scripts/verify-demo-catalog.mjs
 */
if (process.env.DEMO_CATALOG?.trim().toLowerCase() !== "true") {
  console.error("Set DEMO_CATALOG=true to run demo catalog checks.");
  process.exit(2);
}
const categories = [
  "beds",
  "mattresses",
  "sofas",
  "tables",
  "dining-sets",
  "chairs",
  "dressers",
  "wardrobes",
  "hallways",
  "kitchens",
  "textiles",
];

const expectedSubs = {
  beds: 6,
  mattresses: 5,
  sofas: 9,
  tables: 6,
  "dining-sets": 5,
  chairs: 11,
  dressers: 6,
  wardrobes: 6,
  hallways: 6,
  kitchens: 5,
  textiles: 2,
};

async function fetchText(path) {
  const res = await fetch(`http://localhost:3000${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.text();
}

function countMatches(html, re) {
  return (html.match(re) || []).length;
}

let failed = 0;

for (const slug of categories) {
  const html = await fetchText(`/catalog/${slug}`);
  const cards = countMatches(html, /class="product-card"/g);
  const expected = expectedSubs[slug] * 4 + 4;
  // next-intl may embed unused message strings; detect the empty UI by class.
  const emptyUi = html.includes('class="category-empty"');
  const divider = html.includes("category-product-divider");
  const headings = [
    ...html.matchAll(/category-section-heading">([^<]+)/g),
  ].map((match) => match[1]);
  const saleHeading = headings.filter((heading) => heading === "Розпродаж").length;
  const saleLast = headings.at(-1) === "Розпродаж";
  const titles = [...html.matchAll(/product-card-title">([^<]+)/g)].map(
    (match) => match[1],
  );
  const product01 = titles.filter((title) => title === "Товар 01").length;
  const anchors = [...html.matchAll(/id="(product-[^"]+)"/g)].map(
    (match) => match[1],
  );
  const uniqueAnchors = new Set(anchors).size === anchors.length;
  const ok =
    cards === expected &&
    !emptyUi &&
    !divider &&
    saleHeading === 1 &&
    saleLast &&
    product01 === expectedSubs[slug] + 1 &&
    uniqueAnchors &&
    !html.includes("Nova");
  console.log(
    `${ok ? "OK" : "FAIL"} ${slug}: cards=${cards} expected=${expected} saleLast=${saleLast} product01=${product01} anchors=${anchors.length}`,
  );
  if (!ok) failed += 1;
}

const own = await fetchText("/catalog/own-production");
const ownCards = (own.match(/class="product-card"/g) || []).length;
const ownExpected = 4; /* one subcategory only — no sale section */
const ownHeadings = [
  ...own.matchAll(/category-section-heading">([^<]+)/g),
].map((match) => match[1]);
const ownOk =
  own.includes("Ліжка з натурального дерева") &&
  own.includes("own-production--natural-wood-beds") &&
  !own.includes("category-page--vacant") &&
  ownCards === ownExpected &&
  ownHeadings.length === 1 &&
  ownHeadings[0] === "Ліжка з натурального дерева" &&
  !own.includes(">Розпродаж<") &&
  !own.includes("Nova");
console.log(
  `${ownOk ? "OK" : "FAIL"} own-production demo placeholders cards=${ownCards} expected=${ownExpected} no-sale`,
);
if (!ownOk) failed += 1;

const chairs = await fetchText("/catalog/chairs");
const hasGroups =
  chairs.includes("Крісла") && chairs.includes("Стільці");
console.log(`${hasGroups ? "OK" : "FAIL"} chairs dual groups in page`);
if (!hasGroups) failed += 1;

const dressers = await fetchText("/catalog/dressers");
const dresserGroups =
  dressers.includes("Комоди") && dressers.includes("Тумби");
console.log(`${dresserGroups ? "OK" : "FAIL"} dressers dual groups in page`);
if (!dresserGroups) failed += 1;

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}

console.log("\nAll demo catalog checks passed.");
