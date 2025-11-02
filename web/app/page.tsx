import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/config";
import { postsQuery, featuredPostQuery } from "@/sanity/queries";

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

export default async function Home() {
  const posts: Post[] = await client.fetch(postsQuery);
  const featuredPost: Post | null = await client.fetch(featuredPostQuery);
  
  // Filter out featured post from regular posts if it exists
  const regularPosts = featuredPost 
    ? posts.filter(post => post._id !== featuredPost._id)
    : posts;

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
              <Link href="/reflections" className="text-gray-600 hover:text-amber-600 transition-colors font-light">
                Reflections
              </Link>
              <Link href="/opinions" className="text-gray-600 hover:text-amber-600 transition-colors font-light">
                Opinions
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-20">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-30 -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10" />
          
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 mb-6">
              Break Your
              <span className="block font-serif italic text-amber-600">Bell Jar</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed">
              A space for stories, reflections, and moments of clarity
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-32 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-amber-100 rounded-full mx-auto mb-8 flex items-center justify-center">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Your canvas awaits
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start creating your first story in the Studio
            </p>
            <a
              href="http://localhost:3333"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-light text-lg"
              target="_blank"
            >
              Open Studio
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        ) : (
          <div className="space-y-24">
            {/* Featured post */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug.current}`} className="group block">
                <article className="grid lg:grid-cols-2 gap-12 items-center">
                  {featuredPost.mainImage && (
                    <div className="aspect-[4/3] relative overflow-hidden rounded-3xl">
                      <Image
                        src={featuredPost.mainImage.asset.url}
                        alt={featuredPost.mainImage.alt || featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority
                      />
                    </div>
                  )}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-wider text-amber-600 font-medium">Featured</span>
                      {featuredPost.categories?.[0] && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs uppercase tracking-wider text-gray-500">
                            {featuredPost.categories[0].title}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-light text-gray-900 leading-tight group-hover:text-amber-600 transition-colors">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {featuredPost.author && <span className="font-light">{featuredPost.author.name}</span>}
                      {featuredPost.publishedAt && (
                        <>
                          <span>•</span>
                          <time className="font-light">
                            {new Date(featuredPost.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </time>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Other posts */}
            {regularPosts.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {regularPosts.map((post) => (
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
                        {post.categories?.[0] && (
                          <span className="text-xs uppercase tracking-wider text-gray-500">
                            {post.categories[0].title}
                          </span>
                        )}
                        <h3 className="text-2xl font-light text-gray-900 leading-snug group-hover:text-amber-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {post.publishedAt && (
                            <time className="font-light">
                              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
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
          </div>
        )}
      </main>

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
