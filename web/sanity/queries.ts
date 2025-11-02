import { defineQuery } from 'next-sanity'

export const postsQuery = defineQuery(`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  featured,
  mainImage {
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  author->{
    name,
    image
  },
  categories[]->{
    title
  },
  "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "..."
}`)

export const featuredPostQuery = defineQuery(`*[_type == "post" && featured == true] | order(publishedAt desc)[0] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage {
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  author->{
    name,
    image
  },
  categories[]->{
    title
  },
  "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "..."
}`)

export const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage {
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  gallery[] {
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  author->{
    name,
    image
  },
  categories[]->{
    title
  },
  body
}`)
