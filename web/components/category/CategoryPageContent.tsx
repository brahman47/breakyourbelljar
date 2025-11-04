'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, PenSquare } from 'lucide-react';
import { cn } from '@/lib/cn';

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
  excerpt?: string;
}

interface CategoryCopy {
  title?: string;
  description?: string;
}

type AccentKey = 'amber' | 'sky';

interface CategoryPageContentProps {
  category: CategoryCopy;
  posts: Post[];
  studioUrl?: string;
  accent?: AccentKey;
  emptyTitle?: string;
  emptyBody?: string;
}

const accents: Record<AccentKey, {
  heroGradient: string;
  orb: string;
  badge: string;
  hoverText: string;
}> = {
  amber: {
    heroGradient: 'from-amber-50 via-white to-white',
    orb: 'bg-amber-200/45',
    badge: 'bg-amber-100 text-amber-700/80',
    hoverText: 'group-hover:text-amber-600',
  },
  sky: {
    heroGradient: 'from-sky-50 via-white to-white',
    orb: 'bg-sky-200/35',
    badge: 'bg-sky-100 text-sky-700/80',
    hoverText: 'group-hover:text-sky-600',
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const listContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function formatDate(dateString?: string) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export function CategoryPageContent({
  category,
  posts,
  studioUrl = 'http://localhost:3333',
  accent = 'amber',
  emptyTitle = 'No entries yet',
  emptyBody = 'Create your first piece in the Studio and assign it to this collection.',
}: CategoryPageContentProps) {
  const accentStyles = accents[accent];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className={`absolute -top-24 left-[5%] h-72 w-72 rounded-full ${accentStyles.orb} blur-3xl`} />
        <div className="absolute inset-x-0 top-1/3 h-96 bg-gradient-to-b from-white/20 via-white/60 to-white" />
      </div>

      <header className={`relative overflow-hidden bg-gradient-to-br ${accentStyles.heroGradient}`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={listContainer}
          className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 lg:px-12"
        >
          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl font-light text-gray-900 sm:text-6xl"
          >
            {category?.title ?? 'Category'}
          </motion.h1>
          {category?.description && (
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl"
            >
              {category.description}
            </motion.p>
          )}
        </motion.div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        {posts.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto max-w-lg rounded-3xl border border-dashed border-gray-200 bg-white/70 p-14 text-center shadow-xl backdrop-blur"
          >
            <PenSquare className="mx-auto mb-6 h-12 w-12 text-amber-500" />
            <h2 className="mb-4 text-2xl font-light text-gray-900">{emptyTitle}</h2>
            <p className="mb-8 text-base text-gray-600">{emptyBody}</p>
            <a
              href={studioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Open Studio
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={listContainer}
            className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post, index) => (
              <motion.article
                key={post._id}
                variants={item}
                transition={{ delay: index * 0.04 }}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/60 p-5 shadow-[0_40px_120px_-80px_rgba(17,24,39,0.45)] backdrop-blur"
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
                  <span className={cn('inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em]', accentStyles.badge)}>
                    {category?.title ?? 'Collection'}
                  </span>
                  <h3 className={cn('text-xl font-light text-gray-900 transition-colors', accentStyles.hoverText)}>
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
      </main>

      <footer className="relative mt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-gray-950 via-gray-900/95 to-transparent" />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center sm:px-8 lg:px-12">
          <p className="text-base text-gray-300">
            © {new Date().getFullYear()} Break Your Bell Jar — {category?.title ?? 'Stories'} curated with care.
          </p>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />
          <p className="text-sm text-gray-400">Write gently. Read deeply.</p>
        </div>
      </footer>
    </div>
  );
}

export default CategoryPageContent;
