import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { formatPublishedDate } from "../lib/blog";
import { useBlogPost } from "../hooks/useBlogPosts";
import PortableText from "../components/PortableText";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug);

  return (
    <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blogs"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400 transition-colors hover:text-cyber-cyan"
        >
          <ArrowLeft className="h-3 w-3" /> All articles
        </Link>

        {loading && (
          <div className="space-y-6">
            <div className="h-10 w-3/4 animate-pulse rounded bg-white/5" />
            <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
            <div className="h-4 w-full animate-pulse rounded bg-white/5" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-white/5" />
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-gray-400">
            {error}
          </p>
        )}

        {!loading && !error && !post && (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="font-mono text-sm text-gray-500">
              [ Article not found. ]
            </p>
          </div>
        )}

        {post && (
          <article>
            {/* Header */}
            <header className="mb-10">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full glass-panel border border-cyber-cyan/30 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyber-cyan"
              >
                <span>[ article ]</span>
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.15]"
              >
                {post.title}
              </motion.h1>

              {formatPublishedDate(post.publishedAt) && (
                <div className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyber-cyan">
                  <Calendar className="h-3 w-3" />
                  {formatPublishedDate(post.publishedAt)}
                </div>
              )}
            </header>

            {/* Hero image */}
            {post.imageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-10 overflow-hidden rounded-2xl border border-cyber-cyan/15"
              >
                <img
                  src={`${post.imageUrl}?w=1200&auto=format`}
                  alt={post.title}
                  className="h-auto w-full object-cover"
                />
              </motion.div>
            )}

            {/* Body */}
            {post.excerpt && (
              <p className="mb-10 border-l-2 border-cyber-cyan/40 pl-6 text-lg italic leading-relaxed text-gray-300">
                {post.excerpt}
              </p>
            )}

            {post.body && post.body.length > 0 && (
              <PortableText blocks={post.body} />
            )}
          </article>
        )}
      </div>
    </main>
  );
}