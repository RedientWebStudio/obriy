/**
 * Content API cycle that mirrors Studio desk mutations for a product:
 * create → upload images → gallery add/remove → publish → reopen → cleanup.
 *
 * Run: node --env-file=.env.local scripts/studio-product-cycle-check.mjs
 */
import { createClient } from "@sanity/client";
import { createClient as createNextSanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-08-19";
const token = process.env.SANITY_API_WRITE_TOKEN;

const PRODUCT_ID = "product.obriy-studio-audit-temp";
const DRAFT_ID = `drafts.${PRODUCT_ID}`;

const write = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

const read = createNextSanityClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

async function cleanup(assetIds = []) {
  for (const id of [PRODUCT_ID, DRAFT_ID]) {
    try {
      await write.delete(id);
    } catch {
      /* ignore */
    }
  }
  for (const id of assetIds) {
    try {
      await write.delete(id);
    } catch {
      /* ignore */
    }
  }
}

async function publishDraft() {
  const draft = await write.getDocument(DRAFT_ID);
  if (!draft) throw new Error("missing draft for publish");
  const published = { ...draft, _id: PRODUCT_ID };
  delete published._rev;
  await write.createOrReplace(published);
  try {
    await write.delete(DRAFT_ID);
  } catch {
    /* draft may already be gone */
  }
}

const result = { steps: {} };

try {
  if (!token) {
    console.log(
      JSON.stringify({ ok: false, blocked: true, reason: "no write token" }),
    );
    process.exit(2);
  }

  await cleanup();

  const category = await write.fetch(
    `*[_type == "category" && defined(slug.current)][0]{_id, "slug": slug.current}`,
  );
  if (!category?._id) throw new Error("no category in dataset");
  result.steps.category = category.slug;

  const asset1 = await write.assets.upload("image", tinyPng, {
    filename: "audit-a.png",
  });
  const asset2 = await write.assets.upload("image", tinyPng, {
    filename: "audit-b.png",
  });
  result.steps.upload = { a: asset1._id, b: asset2._id };

  await write.createOrReplace({
    _id: DRAFT_ID,
    _type: "product",
    title: { uk: "TEMP Studio Audit UK", en: "TEMP Studio Audit EN" },
    slug: { _type: "slug", current: "temp-studio-audit-product" },
    category: { _type: "reference", _ref: category._id },
    gallery: [
      {
        _type: "image",
        _key: "img1",
        asset: { _type: "reference", _ref: asset1._id },
        alt: { uk: "a", en: "a" },
      },
      {
        _type: "image",
        _key: "img2",
        asset: { _type: "reference", _ref: asset2._id },
        alt: { uk: "b", en: "b" },
      },
    ],
    variants: [
      {
        _type: "productVariant",
        _key: "v1",
        label: { uk: "стандарт", en: "standard" },
        price: 1,
      },
    ],
    published: true,
  });
  result.steps.createDraft = true;

  await write
    .patch(DRAFT_ID)
    .set({
      gallery: [
        {
          _type: "image",
          _key: "img1",
          asset: { _type: "reference", _ref: asset1._id },
          alt: { uk: "a", en: "a" },
        },
      ],
    })
    .commit();
  result.steps.galleryRemove = true;

  await write
    .patch(DRAFT_ID)
    .set({
      gallery: [
        {
          _type: "image",
          _key: "img1",
          asset: { _type: "reference", _ref: asset1._id },
          alt: { uk: "a", en: "a" },
        },
        {
          _type: "image",
          _key: "img3",
          asset: { _type: "reference", _ref: asset2._id },
          alt: { uk: "c", en: "c" },
        },
      ],
    })
    .commit();
  result.steps.galleryAdd = true;

  await publishDraft();
  result.steps.publish = true;

  const publishedDoc = await write.getDocument(PRODUCT_ID);
  const publishedViaApp = await read.fetch(
    `*[_id == $id][0]{_id, title, "galleryLen": count(gallery)}`,
    { id: PRODUCT_ID },
  );
  result.steps.reopenPublished = {
    found: Boolean(publishedDoc),
    galleryLen: publishedDoc?.gallery?.length ?? 0,
    appReadFound: Boolean(publishedViaApp),
    appGalleryLen: publishedViaApp?.galleryLen ?? 0,
  };

  await cleanup([asset1._id, asset2._id]);
  result.steps.cleanup = true;
  result.ok =
    result.steps.reopenPublished.found &&
    result.steps.reopenPublished.galleryLen === 2;

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
} catch (error) {
  try {
    await cleanup();
  } catch {
    /* ignore */
  }
  console.error(
    JSON.stringify({ ok: false, error: String(error), stack: error.stack }),
  );
  process.exit(1);
}
