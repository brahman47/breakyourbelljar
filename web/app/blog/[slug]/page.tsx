import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Navigation from "@/components/Navigation";
import { sanityFetch } from "@/sanity/config";
import { postQuery, postsQuery } from "@/sanity/queries";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: {
    asset: { url: string };
    alt?: string;
    caption?: string;
  };
  gallery?: Array<{
    asset: { url: string };
    alt?: string;
    caption?: string;
  }>;
  author?: {
    name: string;
  };
  categories?: Array<{ title: string }>;
  body: PortableTextBlock[];
}

export async function generateStaticParams() {
  const posts = await sanityFetch<Post[]>({
    query: postsQuery,
    tags: ['post'],
  });
  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

type BlogPostParams = { slug: string };

export default async function BlogPost({
  params,
}: {
  params: BlogPostParams | Promise<BlogPostParams>;
}) {
  const { slug } = await Promise.resolve(params);

  if (!slug) {
    notFound();
  }

  const post = await sanityFetch<Post>({
    query: postQuery,
    params: { slug },
    tags: ['post'],
  });

  if (!post) {
    notFound();
  }

  const portableTextComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="mb-6">{children}</p>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ children, value }) => {
        const href = (value as { href?: string })?.href ?? "#";
        return (
          <a
            href={href}
            className="text-amber-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-[10%] h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute left-[8%] top-1/2 h-96 w-96 rounded-full bg-sky-200/35 blur-[140px]" />
      </div>
      <Navigation />

      <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-12 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-center justify-between text-sm text-gray-500">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/80 px-4 py-2 transition hover:border-amber-300 hover:text-amber-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          {post.categories?.[0] && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-600">
              {post.categories[0].title}
            </span>
          )}
        </div>

        <article className="relative overflow-hidden rounded-[2.75rem] border border-gray-100 bg-white/70 p-10 shadow-[0_40px_140px_-80px_rgba(15,23,42,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-transparent to-amber-50/50" />
          <div className="relative z-10">
            <header className="mx-auto max-w-3xl pb-16 text-center">
              <h1 className="text-balance font-serif text-5xl font-light leading-tight text-gray-900 sm:text-6xl lg:text-7xl">
                {post.title}
              </h1>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                {post.author?.name && <span className="font-light">{post.author.name}</span>}
                {post.publishedAt && (
                  <span className="inline-flex items-center gap-2 font-light">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </header>

            {post.mainImage && (
              <div className="mb-14 overflow-hidden rounded-[2rem] border border-white/60 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.5)]">
                <div className="relative aspect-[3/2]">
                  <Image
                    src={post.mainImage.asset.url}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                </div>
                {post.mainImage.caption && (
                  <p className="px-6 py-4 text-center text-sm font-light text-gray-500 italic">
                    {post.mainImage.caption}
                  </p>
                )}
              </div>
            )}

            <div className="prose prose-lg mx-auto max-w-none pb-16 text-gray-700 prose-blockquote:border-amber-200 prose-blockquote:bg-amber-50/60 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:italic prose-headings:font-sans prose-headings:font-light prose-headings:text-gray-900 prose-img:rounded-2xl prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline">
              <PortableText value={post.body} components={portableTextComponents} />
            </div>

            {post.gallery && post.gallery.length > 0 && (
              <section className="space-y-10 rounded-[2rem] border border-gray-100 bg-white/70 p-10 shadow-[0_30px_120px_-80px_rgba(15,23,42,0.45)]">
                <h2 className="text-center text-3xl font-light text-gray-900">Gallery</h2>
                <div className="columns-1 gap-6 space-y-6 md:columns-2">
                  {post.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl border border-white/60"
                    >
                      <Image
                        src={image.asset.url}
                        alt={image.alt || `Gallery image ${index + 1}`}
                        width={800}
                        height={600}
                        className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                      />
                      {image.caption && (
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <p className="w-full px-5 pb-4 text-sm font-light text-white">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>

      <footer className="relative mt-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-gray-950 via-gray-900/95 to-transparent" />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center text-sm text-gray-400 sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} Break Your Bell Jar — fragments gathered with care.</p>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Stay gentle.</p>
        </div>
      </footer>
    </div>
  );
}
