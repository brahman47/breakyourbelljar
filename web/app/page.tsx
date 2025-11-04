import { sanityFetch } from "@/sanity/config";
import { postsQuery, featuredPostQuery } from "@/sanity/queries";
import Navigation from "@/components/Navigation";
import HomeContent from "@/components/home/HomeContent";

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
  const posts = await sanityFetch<Post[]>({
    query: postsQuery,
    tags: ['post'],
  });
  const featuredPost = await sanityFetch<Post | null>({
    query: featuredPostQuery,
    tags: ['post'],
  });
  
  // Filter out featured post from regular posts if it exists
  const regularPosts = featuredPost 
    ? posts.filter(post => post._id !== featuredPost._id)
    : posts;

  return (
    <div className="min-h-screen bg-transparent">
      <Navigation />
      <HomeContent featuredPost={featuredPost} posts={regularPosts} />
      <footer className="relative mt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-gray-950 via-gray-900/95 to-transparent" />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center sm:px-8 lg:px-12">
          <p className="text-base text-gray-300">
            © {new Date().getFullYear()} Break Your Bell Jar — phrases stitched together for curious minds.
          </p>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />
          <p className="text-sm text-gray-400">
            Crafted with intention. Refined with presence.
          </p>
        </div>
      </footer>
    </div>
  );
}
