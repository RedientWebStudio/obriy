/**
 * Temporary Sanity cycle check for OBRIY stage 11.
 * Run: node --env-file=.env.local scripts/sanity-cycle-check.mjs
 */
import { createClient } from "@sanity/client";
import { createClient as createNextSanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "qu60lpod";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-08-19";
const token = process.env.SANITY_API_WRITE_TOKEN;

const TEST_ID = "category.obriy-stage11-temp-check";

// Mirror production app read path: public dataset, published perspective, CDN, no token
const readClient = createNextSanityClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

const result = {
  projectId,
  dataset,
  apiVersion,
  hasWriteToken: Boolean(token),
  steps: {},
};

async function cleanup() {
  try {
    await writeClient.delete(TEST_ID);
  } catch {
    /* ignore */
  }
  try {
    await writeClient.delete(`drafts.${TEST_ID}`);
  } catch {
    /* ignore */
  }
}

try {
  if (!token) {
    result.steps.write = "blocked: no SANITY_API_WRITE_TOKEN";
    result.ok = false;
    result.blocked = true;
    console.log(JSON.stringify(result, null, 2));
    process.exit(2);
  }

  result.steps.readBefore = {
    ok: true,
    found: Boolean(
      await readClient.fetch(`*[_id == $id][0]._id`, { id: TEST_ID }),
    ),
  };

  await writeClient.createOrReplace({
    _id: TEST_ID,
    _type: "category",
    title: {
      uk: "TEMP Stage11 Check UK",
      en: "TEMP Stage11 Check EN",
    },
    slug: { _type: "slug", current: "temp-stage11-check" },
    order: 9999,
    published: true,
  });
  result.steps.createPublish = "ok";

  // Authenticated read (same dataset)
  const viaWrite = await writeClient.fetch(
    `*[_id == $id][0]{ _id, _type, published, title, "slug": slug.current }`,
    { id: TEST_ID },
  );
  result.steps.fetchViaWriteClient = {
    ok: Boolean(viaWrite?._id),
    document: viaWrite,
  };

  // App client (next-sanity, no token, no CDN)
  const viaNext = await readClient.fetch(
    `*[_type == "category" && _id == $id][0]{
      _id,
      title,
      "slug": slug.current,
      published
    }`,
    { id: TEST_ID },
  );
  result.steps.fetchViaNextClient = {
    ok:
      viaNext?._id === TEST_ID &&
      viaNext?.slug === "temp-stage11-check" &&
      viaNext?.title?.uk === "TEMP Stage11 Check UK" &&
      viaNext?.published === true,
    document: viaNext,
  };

  // Published filter used by app queries
  const viaPublished = await readClient.fetch(
    `*[_type == "category" && _id == $id && published == true][0]{ _id, published }`,
    { id: TEST_ID },
  );
  result.steps.fetchPublishedFilter = {
    ok: viaPublished?._id === TEST_ID,
    document: viaPublished,
  };

  await writeClient.delete(TEST_ID);
  result.steps.delete = "ok";

  const remaining = await writeClient.fetch(`*[_id == $id][0]._id`, {
    id: TEST_ID,
  });
  result.steps.verifyDeleted = { ok: remaining == null, remainingId: remaining };

  result.ok =
    result.steps.fetchViaWriteClient.ok &&
    result.steps.fetchViaNextClient.ok &&
    result.steps.fetchPublishedFilter.ok &&
    result.steps.verifyDeleted.ok;
} catch (error) {
  result.ok = false;
  result.error = error.message;
  await cleanup();
}

console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 1);
