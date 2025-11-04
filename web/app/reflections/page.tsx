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
    <div className="min-h-screen bg-transparent">
      <Navigation />
      <CategoryPageContent
        category={category ?? { title: "Reflections" }}
        posts={posts}
        accent="amber"
        emptyTitle="No reflections yet"
        emptyBody='Create your first reflection in the Studio and assign it the "Reflections" category.'
      />
    </div>
  );
}
