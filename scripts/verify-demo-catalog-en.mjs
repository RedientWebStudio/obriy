/** EN locale smoke check. Requires `npm run dev`. */
const paths = [
  "/en/catalog/beds",
  "/en/catalog/chairs",
  "/en/catalog/dressers",
  "/en/catalog/own-production",
];

let failed = 0;
for (const path of paths) {
  const res = await fetch(`http://localhost:3000${path}`);
  const html = await res.text();
  const cards = (html.match(/class="product-card"/g) || []).length;
  const emptyUi = html.includes('class="category-empty"');
  const ok = res.ok && (path.includes("own-production") ? emptyUi : cards > 0 && !emptyUi);
  console.log(`${ok ? "OK" : "FAIL"} ${path}: status=${res.status} cards=${cards}`);
  if (!ok) failed += 1;
}

const chairs = await (await fetch("http://localhost:3000/en/catalog/chairs")).text();
const groups =
  chairs.includes("Armchairs") && chairs.includes("Chairs");
console.log(`${groups ? "OK" : "FAIL"} EN chairs dual groups`);
if (!groups) failed += 1;

if (failed) process.exit(1);
console.log("EN checks passed.");
