import type { GetStaticProps, InferGetStaticPropsType } from "next"
import { useLiveQuery } from "next-sanity/preview"

import Card from "~/components/Card"
import Container from "~/components/Container"
import Layout from "~/components/Layout"
import Welcome from "~/components/Welcome"
import { readToken } from "~/lib/sanity.api"
import { getClient } from "~/lib/sanity.client"
import { getPosts, type Post, postsQuery } from "~/lib/sanity.queries"
import type { SharedPageProps } from "~/pages/_app"

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: Post[]
  }
> = async ({ draftMode = false, locale }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const language = locale ?? "en"
  const posts = await getPosts(client, language)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : "",
      posts,
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [posts] = useLiveQuery<Post[]>(props.posts, postsQuery)

  return (
    <Layout>
      <Container>
        <section>
          {posts.length ? (
            posts.map((post) => <Card key={post.title} post={post} />)
          ) : (
            <Welcome />
          )}
        </section>
      </Container>
    </Layout>
  )
}
