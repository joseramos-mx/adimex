import { groq } from "next-sanity"

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    author,
    mainImage {
      asset->{ _id, url },
      alt
    }
  }
`

export const latestPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc)[0..2] {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    author,
    mainImage {
      asset->{ _id, url },
      alt
    }
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    mainImage {
      asset->{ _id, url },
      alt
    },
    body
  }
`
