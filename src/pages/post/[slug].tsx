import { PortableText } from "@portabletext/react"
import type { GetStaticProps, InferGetStaticPropsType } from "next"
import Image from "next/image"
import { useLiveQuery } from "next-sanity/preview"

import Container from "~/components/Container"
import { readToken } from "~/lib/sanity.api"
import { getClient } from "~/lib/sanity.client"
import { urlForImage } from "~/lib/sanity.image"
import {
  getPost,
  type Post,
  postBySlugQuery,
  postSlugsQuery,
} from "~/lib/sanity.queries"
import type { SharedPageProps } from "~/pages/_app"
import { formatDate } from "~/utils"
import Layout from "~/components/Layout"

type Query = Record<string, string>

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    post: Post
  },
  Query
> = async ({ draftMode = false, params = {}, locale }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const language = locale ?? "en"
  const post = await getPost(client, params.slug!, language)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : "",
      post,
    },
  }
}

export default function ProjectSlugRoute(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [post] = useLiveQuery(props.post, postBySlugQuery, {
    slug: props.post.slug.current,
  })

  const translationUrls =
    post._translations?.map((t) => `/${t.language}/post/${t.slug.current}`) ??
    []

  return (
    <Layout translationUrls={translationUrls}>
      <Container>
        <section className="post">
          {post.mainImage ? (
            <Image
              className="post__cover"
              src={urlForImage(post.mainImage)!.url()}
              height={231}
              width={367}
              alt=""
              priority
            />
          ) : (
            <div className="post__cover--none" />
          )}
          <div className="post__container">
            <h1 className="post__title">{post.title}</h1>
            <p className="post__excerpt">{post.excerpt}</p>
            <p className="post__date">{formatDate(post._createdAt)}</p>
            <div className="post__content">
              <PortableText value={post.body} />
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  )
}

export const getStaticPaths = async () => {
  const client = getClient()
  const slugs: Array<{ slug: string }> = await client.fetch(postSlugsQuery)

  return {
    paths: slugs?.map(({ slug }) => `/post/${slug}`) || [],
    fallback: "blocking",
  }
}
