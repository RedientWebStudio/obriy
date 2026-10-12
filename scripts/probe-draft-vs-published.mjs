import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "qu60lpod";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-08-19";

const anonPublished = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

const anonRaw = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const write = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "probe-public-access-tmp";
const draftId = `drafts.${id}`;

try {
  await write.createOrReplace({
    _id: draftId,
    _type: "category",
    title: { uk: "DRAFT_ONLY", en: "DRAFT_ONLY" },
    slug: { _type: "slug", current: "probe-draft-only" },
    published: false,
    order: 9999,
  });

  const anonDraft = await anonRaw.fetch(`*[_id == $id][0]{_id, title}`, {
    id: draftId,
  });
  const anonByPublishedId = await anonPublished.fetch(
    `*[_id == $id][0]{_id, title}`,
    { id },
  );

  console.log(
    JSON.stringify(
      {
        aclMode: "public",
        anonCanReadDraftDoc: Boolean(anonDraft),
        anonSeesUnpublishedAsPublishedId: Boolean(anonByPublishedId),
      },
      null,
      2,
    ),
  );
} finally {
  try {
    await write.delete(draftId);
  } catch {
    // ignore cleanup errors
  }
  try {
    await write.delete(id);
  } catch {
    // ignore cleanup errors
  }
}
