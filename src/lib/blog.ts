import { sanityClient } from "./sanity";

export type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  imageUrl?: string | null;
  publishedAt?: string;
  body?: BlogBodyBlock[];
};

export type BlogBodyBlock = {
  _key?: string;
  _type: string;
  style?: string;
  listItem?: "bullet" | "number";
  children?: {
    _key?: string;
    _type: string;
    text?: string;
    marks?: string[];
  }[];
  markDefs?: {
    _key: string;
    _type: string;
    href?: string;
  }[];
  imageUrl?: string | null;
  alt?: string;
  caption?: string;
  
  // 👇 Added these two fields for the YouTube embed
  url?: string;
  title?: string;
};

export const RECENT_BLOG_POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...6]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "imageUrl": cover.asset->url
}`;

export const ALL_BLOG_POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "imageUrl": cover.asset->url
}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[
  _type == "post"
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "imageUrl": cover.asset->url,
  body[]{
    ...,
    _type == "image" => {
      _type,
      alt,
      caption,
      "imageUrl": asset->url
    },
    _type == "youtube" => {
      _type,
      title,
      url
    }
  }
}`;

const pendingPostLists = new Map<string, Promise<BlogPost[]>>();
const pendingPostDetails = new Map<string, Promise<BlogPost | null>>();

export function fetchBlogPosts(query: string): Promise<BlogPost[]> {
  const pending = pendingPostLists.get(query);
  if (pending) return pending;

  const request = sanityClient
    .fetch<BlogPost[]>(query)
    .finally(() => pendingPostLists.delete(query));
  pendingPostLists.set(query, request);
  return request;
}

export function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const pending = pendingPostDetails.get(slug);
  if (pending) return pending;

  const request = sanityClient
    .fetch<BlogPost | null>(BLOG_POST_BY_SLUG_QUERY, { slug })
    .finally(() => pendingPostDetails.delete(slug));
  pendingPostDetails.set(slug, request);
  return request;
}

export function formatPublishedDate(value: string | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}