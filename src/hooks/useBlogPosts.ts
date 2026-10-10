import { useEffect, useState } from "react";
import {
  fetchBlogPosts,
  fetchBlogPost,
  type BlogPost,
} from "../lib/blog";

type UseBlogPostsResult = {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
};

export function useBlogPosts(query: string): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBlogPosts(query)
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load articles.";
          setError(message);
          console.warn("[blogs] Failed to load:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return { posts, loading, error };
}

type UseBlogPostResult = {
  post: BlogPost | null;
  loading: boolean;
  error: string | null;
};

export function useBlogPost(slug: string | undefined): UseBlogPostResult {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBlogPost(slug)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load article.";
          setError(message);
          console.warn("[blogs] Failed to load post:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading, error };
}