import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { formatPublishedDate, RECENT_BLOG_POSTS_QUERY } from "../lib/blog";
import { useBlogPosts } from "../hooks/useBlogPosts";

export default function BlogSection() {
  const { posts, loading, error } = useBlogPosts(RECENT_BLOG_POSTS_QUERY);

  return (
    <section
      id="blogs"
      aria-labelledby="latest-blogs-heading"
      className="relative isolate w-full overflow-hidden bg-cyber-bg py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 -z-10 h-100 w-100 rounded-full bg-cyber-cyan/15 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-105 w-105 rounded-full bg-cyber-purple/15 blur-[200px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center space-x-2 rounded-full glass-panel border border-cyber-cyan/30 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyber-cyan"
          >
            <span>[ insights & ideas ]</span>
          </motion.p>

          <motion.h2
            id="latest-blogs-heading"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Latest From Our{" "}
            <span className="neon-text-gradient">Blog</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-400"
          >
            Deep dives into AI for fashion, automation, and the future of
            manufacturing.
          </motion.p>
        </div>

        {/* Loading */}
        {loading && (
          <div
            aria-label="Loading articles"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
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
          <p className="text-sm text-gray-400">
            No articles have been published yet.
          </p>
        )}

        {/* Posts */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: index * 0.08,
                }}
                className="group glass-panel overflow-hidden rounded-2xl border border-cyber-cyan/15 transition-colors hover:border-cyber-purple/40"
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
                    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyber-purple">
                      <Calendar className="h-3 w-3" />
                      {formatPublishedDate(post.publishedAt)}
                    </div>
                  )}

                  <h3 className="mb-2 font-display text-lg font-bold text-white transition-colors group-hover:text-cyber-purple">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
                      {post.excerpt}
                    </p>
                  )}

                  <Link
                    to={`/blogs/${post.slug.current}`}
                    className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-cyber-purple transition-transform hover:gap-2"
                  >
                    Read more <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* CTA */}
        {!error && posts.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/blogs"
              className="hud-book-btn hud-book-btn--purple group inline-flex items-center gap-2"
            >
              <span>View All Articles</span>
              <ArrowRight className="h-4 w-4 text-cyber-purple transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}