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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
    transition: { duration: 0.5 },
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
        <div className="absolute -top-32 right-[-10%] h-80 w-80 rounded-full bg-[#f1e3d4]/50 blur-3xl" />
        <div className="absolute -bottom-40 left-[-8%] h-96 w-96 rounded-full bg-[#dde8f1]/45 blur-3xl" />
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
            className="inline-flex items-center gap-2 rounded-full bg-[#f6f1eb]/80 px-5 py-2 text-sm font-serif italic tracking-[0.18em] text-slate-500"
          >
            <Feather className="h-4 w-4 text-[#d8a46c]" />
            Gentle rebellion
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="font-serif text-5xl font-light tracking-tight text-slate-600 sm:text-6xl lg:text-7xl"
          >
            Break Your
            <span className="block text-[#d8a46c]">Bell Jar</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg leading-relaxed text-slate-500 sm:text-xl"
          >
            A sanctuary for thoughtful reflections, unfiltered opinions, and the stories that shape me.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/reflections"
              className="inline-flex items-center gap-2 rounded-full border border-[#e6d4bf] bg-[#f1e3d4] px-6 py-3 text-sm font-light tracking-wide text-[#6f5d4d] transition hover:bg-[#ead7c0]"
            >
              Explore Reflections
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/opinions"
              className="inline-flex items-center gap-2 rounded-full border border-[#eadfd0] px-6 py-3 text-sm font-light tracking-wide text-slate-500 transition hover:border-[#d8a46c] hover:text-[#c18a4e]"
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
                className="group relative grid gap-10 overflow-hidden rounded-[3rem] border border-[#eadfd0] bg-[#fffaf5]/95 p-12 shadow-[0_56px_150px_-80px_rgba(110,93,77,0.45)] transition-transform duration-500 backdrop-blur hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-transparent to-[#f3e5d6]/65 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative grid gap-10 lg:grid-cols-2">
                  {featuredPost.mainImage && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[2.4rem]">
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

                  <div className="relative flex flex-col justify-center gap-8">
                    <div className="absolute inset-0 rounded-[2.6rem] bg-white/30 blur-[90px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex flex-col justify-center gap-8">
                    <div className="flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.32em] text-[#ad9f8f]">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f1e3d4] px-3 py-1 font-serif text-[#b8854d]">Featured</span>
                      {featuredPost.categories?.[0]?.title && (
                        <span className="flex items-center gap-3">
                          <span className="h-px w-6 bg-[#e2d6c8]" />
                          {featuredPost.categories[0].title}
                        </span>
                      )}
                    </div>
                    <h2 className="text-balance font-serif text-4xl font-light tracking-[0.02em] leading-[1.28] text-[#6c5a4c] transition-colors group-hover:text-[#c18a4e] sm:text-5xl">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="text-lg font-sans leading-[1.75] text-[#9a8f84]">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#9a8c7d]">
                      {featuredPost.author?.name && <span className="inline-flex items-center gap-2 font-light text-[#85776a]">{featuredPost.author.name}</span>}
                      {featuredPost.publishedAt && (
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-[#c18a4e]" />
                          {formatDate(featuredPost.publishedAt, true)}
                        </span>
                      )}
                    </div>
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
                  className="group relative overflow-hidden rounded-[2.5rem] border border-[#eadfd0] bg-[#fefbf7]/90 p-6 shadow-[0_44px_120px_-90px_rgba(110,93,77,0.4)] transition-transform duration-500 backdrop-blur hover:-translate-y-1"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-[#f3e5d6]/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {post.mainImage && (
                    <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#f7f1ea]">
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
                    <div className="relative flex h-full flex-col gap-4">
                      <div className="absolute inset-0 rounded-[2rem] bg-white/20 blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative flex h-full flex-col gap-4">
                    {post.categories?.[0]?.title && (
                      <span className="text-[0.7rem] uppercase tracking-[0.3em] text-[#b3a493]">
                        {post.categories[0].title}
                      </span>
                    )}
                    <h3 className="font-serif text-2xl font-light leading-snug text-[#57483c] transition-colors group-hover:text-[#c18a4e]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="relative z-10 line-clamp-3 text-sm font-sans leading-relaxed text-[#8a7d72]">
                        {post.excerpt}
                      </p>
                    )}
                        <div className="mt-auto flex items-center justify-between text-sm text-[#9a8c7d]">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-[#c18a4e]" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-[#c18a4e] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
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
              className="mx-auto max-w-xl rounded-3xl border border-dashed border-[#eadfd0] bg-[#fefbf7]/80 p-14 text-center shadow-xl backdrop-blur"
            >
              <PenSquare className="mx-auto mb-6 h-12 w-12 text-[#c18a4e]" />
              <h3 className="mb-4 text-2xl font-light text-slate-600">Your canvas is clear</h3>
              <p className="mb-8 text-base text-slate-500">
                Start your first story in the Studio to bring this space to life.
              </p>
              <a
                href="http://localhost:3333"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-[#e6d4bf] bg-[#f1e3d4] px-6 py-3 text-sm font-medium text-[#6f5d4d] transition hover:bg-[#ead7c0]"
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
