async function get(path) {
  const res = await fetch(`http://localhost:3000${path}`);
  return { status: res.status, html: await res.text() };
}

const own = await get("/catalog/own-production");
const sofas = await get("/catalog/sofas");

const ownOk =
  own.status === 200 &&
  !own.html.includes('id="sale"') &&
  !own.html.includes('href="#sale"') &&
  !own.html.includes('category-section-heading">Розпродаж');

const sofasOk = sofas.status === 200;

console.log(
  JSON.stringify(
    {
      ownOk,
      sofasOk,
      ownVacant: own.html.includes("category-page--vacant"),
      ownHasSaleAnchor: own.html.includes('href="#sale"'),
      sofasHasSaleAnchor: sofas.html.includes('href="#sale"'),
    },
    null,
    2,
  ),
);

process.exit(ownOk && sofasOk ? 0 : 1);
