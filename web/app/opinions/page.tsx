import { client } from "@/sanity/config";
import Navigation from "@/components/Navigation";
import CategoryPageContent from "@/components/category/CategoryPageContent";

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
    <div className="min-h-screen bg-transparent">
      <Navigation />
      <CategoryPageContent
        category={category ?? { title: "Opinions" }}
        posts={posts}
        accent="sky"
        emptyTitle="No opinions yet"
        emptyBody='Create your first opinion piece in the Studio and assign it the "Opinions" category.'
      />
    </div>
  );
}
