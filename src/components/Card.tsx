import Image from "next/image"
import Link from "next/link"
import { useLocale } from "~/hooks/useLocale"

import { urlForImage } from "~/lib/sanity.image"
import { type Post } from "~/lib/sanity.queries"
import { formatDate } from "~/utils"

export default function Card({ post }: { post: Post }) {
  const { locale } = useLocale()
  return (
    <div className="card">
      {post.mainImage ? (
        <Image
          className="card__cover"
          src={urlForImage(post.mainImage)!.width(500).height(300).url()}
          height={300}
          width={500}
          alt=""
        />
      ) : (
        <div className="card__cover--none" />
      )}
      <div className="card__container">
        <h3 className="card__title">
          <Link
            className="card__link"
            href={`/post/${post.slug.current}`}
            locale={locale}
          >
            {post.title}
          </Link>
        </h3>
        <p className="card__excerpt">{post.excerpt}</p>
        <p className="card__date">{formatDate(post._createdAt)}</p>
      </div>
    </div>
  )
}
