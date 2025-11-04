import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/config";
import Navigation from "@/components/Navigation";

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

const opinionsQuery = `*[_type == "post" && "opinions" in categories[]->slug.current] | order(publishedAt desc) {
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

const categoryQuery = `*[_type == "category" && slug.current == "opinions"][0] {
  title,
  description
}`;

export default async function OpinionsPage() {
  const posts: Post[] = await client.fetch(opinionsQuery);
  const category: Category = await client.fetch(categoryQuery);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
          <h1 className="text-6xl sm:text-7xl font-light text-gray-900 mb-4">
            {category?.title || "Opinions"}
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
              No opinions yet
            </h2>
            <p className="text-gray-600 mb-8">
              Create your first opinion piece in the Studio and assign it the "Opinions" category
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
