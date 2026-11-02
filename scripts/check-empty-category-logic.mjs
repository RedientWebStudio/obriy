async function get(path) {
  const res = await fetch(`http://localhost:3000${path}`);
  const html = await res.text();
  return { status: res.status, html };
}

const emptyTitle = "Асортимент цієї категорії поки що формується.";
const emptySub = "У цій підкатегорії поки немає товарів.";

const own = await get("/catalog/own-production");
const sofas = await get("/catalog/sofas");

const ownCards = (own.html.match(/class="product-card"/g) || []).length;
const sofasCards = (sofas.html.match(/class="product-card"/g) || []).length;

const ownOk =
  own.status === 200 &&
  own.html.includes("category-page--vacant") &&
  own.html.includes("category-empty") &&
  own.html.includes(emptyTitle) &&
  !own.html.includes("category-sticky-nav") &&
  !own.html.includes("Товар 01") &&
  ownCards === 0;

const sofasOk =
  sofas.status === 200 &&
  sofasCards >= 1 &&
  sofas.html.includes(emptySub) &&
  sofas.html.includes("category-sticky-nav") &&
  !sofas.html.includes("category-page--vacant") &&
  /* category-empty block is only for vacant pages; message may still appear in i18n payload */
  !sofas.html.includes('class="category-empty"');

console.log(
  JSON.stringify(
    {
      ownOk,
      sofasOk,
      ownCards,
      sofasCards,
      ownVacant: own.html.includes("category-page--vacant"),
      sofasVacant: sofas.html.includes("category-page--vacant"),
      sofasHasEmptySub: sofas.html.includes(emptySub),
      sofasHasEmptyBlock: sofas.html.includes('class="category-empty"'),
    },
    null,
    2,
  ),
);

process.exit(ownOk && sofasOk ? 0 : 1);
