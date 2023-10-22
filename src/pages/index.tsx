import Link from "next/link"
import { useLocale } from "~/hooks/useLocale"
import { useTranslate } from "~/hooks/useTranslate"
import type { GetStaticProps, InferGetStaticPropsType } from "next"
import { useLiveQuery } from "next-sanity/preview"

import Card from "~/components/Card"
import Container from "~/components/Container"
import Welcome from "~/components/Welcome"
import { readToken } from "~/lib/sanity.api"
import { getClient } from "~/lib/sanity.client"
import { getPosts, type Post, postsQuery } from "~/lib/sanity.queries"
import type { SharedPageProps } from "~/pages/_app"

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: Post[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const posts = await getPosts(client)

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
  const { switchLocale } = useLocale()
  const { t } = useTranslate()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 font-sans">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl">
          <Link href="/">{t("app.title")}</Link>
        </h1>
        <div>
          <span
            onClick={() => void switchLocale("en")}
            className="cursor-pointer"
          >
            {t("app.locale_switcher.en")}
          </span>{" "}
          /{" "}
          <span
            onClick={() => void switchLocale("fr")}
            className="cursor-pointer"
          >
            {t("app.locale_switcher.fr")}
          </span>
        </div>
      </div>
      {t("app.main.description")}

      <Container>
        <section>
          {posts.length ? (
            posts.map((post) => <Card key={post._id} post={post} />)
          ) : (
            <Welcome />
          )}
        </section>
      </Container>
    </main>
  )
}
