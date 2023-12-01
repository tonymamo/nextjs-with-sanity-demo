import type { PortableTextBlock } from "@portabletext/types"
import type { ImageAsset, Slug } from "@sanity/types"
import groq from "groq"
import { type SanityClient } from "next-sanity"

// Get the translations metadata
// And resolve the `value` reference field in each array item
export const postsQuery = groq`*[_type == "post" && language == $language && defined(slug.current)] | order(_createdAt desc){
  title,
  slug,
  language,
  _createdAt,
  excerpt,
  body,
  mainImage,
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    title,
    slug,
    language,
    excerpt,
    body,
    mainImage
  },
}`

export async function getPosts(
  client: SanityClient,
  language: string
): Promise<Post[]> {
  return await client.fetch(postsQuery, { language })
}

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  slug,
  language,
  _createdAt,
  excerpt,
  body,
  mainImage,
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    title,
    slug,
    language,
    excerpt,
    body,
    mainImage
  },
}`

export async function getPost(
  client: SanityClient,
  slug: string,
  language: string
): Promise<Post> {
  return await client.fetch(postBySlugQuery, {
    slug,
    language,
  })
}

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export interface Post {
  _type: "post"
  // _id: string
  _createdAt: string
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
  language: "en" | "fr"
  _translations?: Post[]
}
