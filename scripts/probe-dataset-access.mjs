import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "qu60lpod";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-08-19";

const anon = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const authed = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function probe(client, label) {
  try {
    const count = await client.fetch(`count(*[_type == "category"])`);
    return { label, ok: true, count };
  } catch (error) {
    return {
      label,
      ok: false,
      statusCode: error.statusCode ?? null,
      message: error.message,
    };
  }
}

const result = {
  projectId,
  dataset,
  anonymous: await probe(anon, "anonymous"),
  authenticated: await probe(authed, "authenticated"),
};

console.log(JSON.stringify(result, null, 2));
