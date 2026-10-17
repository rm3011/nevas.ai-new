import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { formatPublishedDate, ALL_BLOG_POSTS_QUERY } from "../lib/blog";
import { useBlogPosts } from "../hooks/useBlogPosts";

export default function Blogs() {
  const { posts, loading, error } = useBlogPosts(ALL_BLOG_POSTS_QUERY);

  return (
    <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400 transition-colors hover:text-cyber-cyan"
        >
          <ArrowLeft className="h-3 w-3" /> Back to home
        </Link>

        {/* Heading */}
        <div className="mb-14 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center space-x-2 rounded-full glass-panel border border-cyber-cyan/30 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyber-cyan"
          >
            <span>[ the journal ]</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
          >
            All <span className="neon-text-gradient">Articles</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-base leading-relaxed text-gray-400"
          >
            Insights on AI, automation, and the future of fashion and textile
            manufacturing.
          </motion.p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p role="alert" className="text-sm text-gray-400">
            {error}
          </p>
        )}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="font-mono text-sm text-gray-500">
              // No posts published yet. Check back soon.
            </p>
          </div>
        )}

        {/* Posts */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: Math.min(index * 0.05, 0.4),
                }}
                className="group glass-panel overflow-hidden rounded-2xl border border-cyber-cyan/15 transition-colors hover:border-cyber-cyan/40"
              >
                <Link to={`/blogs/${post.slug.current}`} className="block">
                  <div className="relative aspect-16/10 overflow-hidden">
                    {post.imageUrl ? (
                      <img
                        src={`${post.imageUrl}?w=600&h=380&fit=crop&auto=format`}
                        alt={post.title}
                        className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-cyber-card text-gray-600">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-cyber-bg/80 to-transparent" />
                  </div>
                </Link>

                <div className="p-6">
                  {formatPublishedDate(post.publishedAt) && (
                    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyber-cyan">
                      <Calendar className="h-3 w-3" />
                      {formatPublishedDate(post.publishedAt)}
                    </div>
                  )}

                  <h2 className="mb-2 font-display text-lg font-bold text-white transition-colors group-hover:text-cyber-cyan">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
                      {post.excerpt}
                    </p>
                  )}

                  <Link
                    to={`/blogs/${post.slug.current}`}
                    className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-cyber-cyan transition-transform hover:gap-2"
                  >
                    Read more <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}