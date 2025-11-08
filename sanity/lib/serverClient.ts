import { createClient } from "next-sanity";

export const serverClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || "2023-05-03",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false, // always false for server
  perspective: "published",
});
