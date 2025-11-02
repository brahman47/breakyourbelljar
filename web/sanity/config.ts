import { createClient, type QueryParams } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = '7sp6215z'
export const dataset = 'production'
export const apiVersion = '2024-11-02'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to true for better performance with Next.js caching
})

// Sanity-recommended fetch helper with proper caching
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}) {
  return client.fetch<QueryResponse>(query, params, {
    cache: 'force-cache',
    next: {
      tags,
    },
  })
}

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
