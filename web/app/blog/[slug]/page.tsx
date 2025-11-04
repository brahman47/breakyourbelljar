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
      normal: ({ children }) => <p className="article-paragraph">{children}</p>,
      h2: ({ children }) => (
        <h2 className="article-heading-2">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="article-heading-3">{children}</h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="article-blockquote">{children}</blockquote>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="article-strong">{children}</strong>,
      em: ({ children }) => <em className="article-em">{children}</em>,
      code: ({ children }) => <code className="article-inline-code">{children}</code>,
      link: ({ children, value }) => {
        const href = (value as { href?: string })?.href ?? "#";
        return (
          <a
            href={href}
            className="article-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }) => <ul className="article-list">{children}</ul>,
      number: ({ children }) => <ol className="article-list article-list--numbered">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="article-list-item">{children}</li>,
      number: ({ children }) => <li className="article-list-item">{children}</li>,
    },
    types: {
      rule: () => <hr className="article-divider" />,
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-[10%] h-72 w-72 rounded-full bg-[#f1e3d4]/60 blur-3xl" />
        <div className="absolute left-[8%] top-1/2 h-96 w-96 rounded-full bg-[#dde8f1]/50 blur-[140px]" />
      </div>
      <Navigation />

      <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-12 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-center justify-between text-sm text-slate-400">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#e6d4bf] bg-[#f1e3d4] px-4 py-2 transition hover:bg-[#ead7c0] hover:text-[#c18a4e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          {post.categories?.[0] && (
            <span className="rounded-full border border-transparent bg-[#f1e3d4] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#b8854d]">
              {post.categories[0].title}
            </span>
          )}
        </div>

        <article className="relative overflow-hidden rounded-[2.75rem] border border-[#eadfd0] bg-[#fefbf7]/90 p-10 shadow-[0_52px_150px_-80px_rgba(110,93,77,0.45)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-transparent to-[#f3e5d6]/60" />
          <div className="relative z-10">
            <header className="mx-auto max-w-3xl pb-16 text-center">
              <h1 className="text-balance font-serif text-5xl font-light leading-tight text-slate-600 sm:text-6xl lg:text-7xl">
                {post.title}
              </h1>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
                {post.author?.name && <span className="font-light text-slate-500">{post.author.name}</span>}
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
              <div className="mb-14 overflow-hidden rounded-[2rem] border border-[#eadfd0] bg-white/60 shadow-[0_44px_140px_-90px_rgba(110,93,77,0.4)]">
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
                  <p className="px-6 py-4 text-center text-sm font-light text-slate-400 italic">
                    {post.mainImage.caption}
                  </p>
                )}
              </div>
            )}

            <div className="article-prose pb-16">
              <PortableText value={post.body} components={portableTextComponents} />
            </div>

            {post.gallery && post.gallery.length > 0 && (
              <section className="space-y-10 rounded-[2rem] border border-[#eadfd0] bg-[#fefbf7]/85 p-10 shadow-[0_40px_130px_-90px_rgba(110,93,77,0.4)]">
                <h2 className="text-center text-3xl font-light text-slate-600">Gallery</h2>
                <div className="columns-1 gap-6 space-y-6 md:columns-2">
                  {post.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl border border-[#eadfd0]"
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
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#f1e3d4] via-[#f8f3ec] to-transparent" />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center text-sm text-slate-500 sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} Break Your Bell Jar — fragments gathered with care.</p>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#c18a4e]/70 to-transparent" />
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Stay gentle.</p>
        </div>
      </footer>
    </div>
  );
}
