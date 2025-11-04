import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/config";
import { postQuery, postsQuery } from "@/sanity/queries";
import { PortableText } from "@portabletext/react";
import Navigation from "@/components/Navigation";

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
  body: any;
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

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<Post>({
    query: postQuery,
    params: { slug },
    tags: ['post'],
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  const portableTextComponents = {
    block: {
      normal: ({ children }: any) => <p className="mb-6">{children}</p>,
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }: any) => <em className="italic">{children}</em>,
      link: ({ children, value }: any) => (
        <a href={value.href} className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Title and Meta */}
        <header className="py-16 text-center max-w-3xl mx-auto">
          {post.categories?.[0] && (
            <span className="text-xs uppercase tracking-wider text-amber-600 font-medium mb-6 block">
              {post.categories[0].title}
            </span>
          )}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            {post.author && <span className="font-light">{post.author.name}</span>}
            {post.publishedAt && (
              <>
                <span>•</span>
                <time className="font-light">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
          </div>
        </header>

        {/* Main Image */}
        {post.mainImage && (
          <div className="mb-16">
            <div className="aspect-[3/2] relative overflow-hidden rounded-3xl">
              <Image
                src={post.mainImage.asset.url}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {post.mainImage.caption && (
              <p className="text-sm text-gray-500 mt-4 text-center font-light italic">
                {post.mainImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-lg max-w-none mb-20 prose-headings:font-sans prose-headings:font-light prose-headings:text-gray-900 prose-p:font-sans prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>

        {/* Image Gallery */}
        {post.gallery && post.gallery.length > 0 && (
          <div className="py-16 border-t border-gray-100">
            <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">
              Gallery
            </h2>
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {post.gallery.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl break-inside-avoid"
                >
                  <Image
                    src={image.asset.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                  />
                  {image.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white text-sm font-light">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 text-center">
          <p className="text-sm text-gray-500 font-light">
            © {new Date().getFullYear()} Break Your Bell Jar. A space to breathe and create.
          </p>
        </div>
      </footer>
    </div>
  );
}
