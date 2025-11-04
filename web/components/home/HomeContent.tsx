'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Feather, PenSquare } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  author?: {
    name: string;
  };
  categories?: Array<{ title: string }>;
  excerpt?: string;
}

interface HomeContentProps {
  featuredPost: Post | null;
  posts: Post[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function formatDate(dateString?: string, withYear = false) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: withYear ? 'long' : 'short',
      day: 'numeric',
      ...(withYear ? { year: 'numeric' as const } : {}),
    });
  } catch {
    return '';
  }
}

export function HomeContent({ featuredPost, posts }: HomeContentProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-10%] h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute -bottom-40 left-[-8%] h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute inset-x-0 top-1/3 h-96 bg-gradient-to-b from-white/30 via-white/60 to-white" />
      </div>

      <section className="pt-20 pb-24 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 sm:px-8"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50/70 px-4 py-1 text-sm uppercase tracking-[0.3em] text-amber-700/80"
          >
            <Feather className="h-4 w-4" />
            Gentle rebellion
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="font-serif text-5xl font-light tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
          >
            Break Your
            <span className="block text-amber-600">Bell Jar</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg leading-relaxed text-gray-600 sm:text-xl"
          >
            A sanctuary for thoughtful reflections, unfiltered opinions, and the stories that shape us.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/reflections"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-light tracking-wide text-white transition hover:bg-gray-800"
            >
              Explore Reflections
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/opinions"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-light tracking-wide text-gray-700 transition hover:border-amber-300 hover:text-amber-600"
            >
              Visit Opinions
              <PenSquare className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 pb-24">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-24">
          {featuredPost && (
            <motion.article variants={cardVariants}>
              <Link
                href={`/blog/${featuredPost.slug.current}`}
                className="group relative grid gap-10 overflow-hidden rounded-[2.75rem] border border-gray-100 bg-white/70 p-10 shadow-[0_40px_120px_-60px_rgba(17,24,39,0.35)] backdrop-blur"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50/90 via-transparent to-white/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative grid gap-10 lg:grid-cols-2">
                  {featuredPost.mainImage && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                      <Image
                        src={featuredPost.mainImage.asset.url}
                        alt={featuredPost.mainImage.alt || featuredPost.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-col justify-center gap-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-gray-500">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700/80">Featured</span>
                      {featuredPost.categories?.[0]?.title && (
                        <span className="text-gray-400">• {featuredPost.categories[0].title}</span>
                      )}
                    </div>
                    <h2 className="text-balance font-serif text-4xl font-light text-gray-900 transition-colors group-hover:text-amber-600 sm:text-5xl">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="text-lg leading-relaxed text-gray-600">{featuredPost.excerpt}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {featuredPost.author?.name && <span>{featuredPost.author.name}</span>}
                      {featuredPost.publishedAt && (
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(featuredPost.publishedAt, true)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          )}

          {posts.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {posts.map((post, index) => (
                <motion.article
                  key={post._id}
                  variants={cardVariants}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/60 p-5 shadow-[0_40px_120px_-80px_rgba(17,24,39,0.4)] backdrop-blur"
                >
                  {post.mainImage && (
                    <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
                      <Image
                        src={post.mainImage.asset.url}
                        alt={post.mainImage.alt || post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60" />
                    </div>
                  )}
                  <div className="flex h-full flex-col gap-4">
                    {post.categories?.[0]?.title && (
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">
                        {post.categories[0].title}
                      </span>
                    )}
                    <h3 className="text-xl font-light text-gray-900 transition-colors group-hover:text-amber-600">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug.current}`} className="absolute inset-0">
                    <span className="sr-only">Read {post.title}</span>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}

          {posts.length === 0 && !featuredPost && (
            <motion.div
              variants={cardVariants}
              className="mx-auto max-w-xl rounded-3xl border border-dashed border-gray-200 bg-white/70 p-14 text-center shadow-xl backdrop-blur"
            >
              <PenSquare className="mx-auto mb-6 h-12 w-12 text-amber-500" />
              <h3 className="mb-4 text-2xl font-light text-gray-900">Your canvas is clear</h3>
              <p className="mb-8 text-base text-gray-600">
                Start your first story in the Studio to bring this space to life.
              </p>
              <a
                href="http://localhost:3333"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
                rel="noreferrer"
              >
                Open Studio
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  );
}

export default HomeContent;
