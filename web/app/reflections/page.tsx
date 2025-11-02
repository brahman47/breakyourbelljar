import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/config";

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

interface Category {
  title: string;
  description?: string;
}

const reflectionsQuery = `*[_type == "post" && "reflections" in categories[]->slug.current] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  },
  author->{
    name
  },
  "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "..."
}`;

const categoryQuery = `*[_type == "category" && slug.current == "reflections"][0] {
  title,
  description
}`;

export default async function ReflectionsPage() {
  const posts: Post[] = await client.fetch(reflectionsQuery);
  const category: Category = await client.fetch(categoryQuery);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-light text-gray-900">
              Break Your <span className="font-serif italic">Bell Jar</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/reflections" className="text-amber-600 font-light border-b-2 border-amber-600">
                Reflections
              </Link>
              <Link href="/opinions" className="text-gray-600 hover:text-amber-600 transition-colors font-light">
                Opinions
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
          <h1 className="text-6xl sm:text-7xl font-light text-gray-900 mb-4">
            {category?.title || "Reflections"}
          </h1>
          {category?.description && (
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>
      </header>

      {/* Posts Grid */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-light text-gray-700 mb-4">
              No reflections yet
            </h2>
            <p className="text-gray-600 mb-8">
              Create your first reflection in the Studio and assign it the "Reflections" category
            </p>
            <a
              href="http://localhost:3333"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-light"
              target="_blank"
            >
              Open Studio
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group"
              >
                <article className="space-y-4">
                  {post.mainImage && (
                    <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-gray-100">
                      <Image
                        src={post.mainImage.asset.url}
                        alt={post.mainImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-light text-gray-900 leading-snug group-hover:text-amber-600 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2 font-light">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {post.publishedAt && (
                        <time className="font-light">
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
