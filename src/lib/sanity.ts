import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "7yw7nuh8",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});