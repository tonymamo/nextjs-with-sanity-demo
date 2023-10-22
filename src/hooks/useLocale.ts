import { useRouter } from "next/router"
import { useCallback, useMemo } from "react"
import en from "@/../lang/en.json"
import fr from "@/../lang/fr.json"
import {
  flattenMessages,
  type INestedMessages,
} from "@/../lang/flattenMessages"

export type Locale = "en" | "fr"

const messages: Record<string, INestedMessages> = {
  en,
  fr,
}
export const useLocale = () => {
  const router = useRouter()

  const flattenedMessages = useMemo(
    () => flattenMessages(messages[router.locale!]),
    [router]
  )

  const switchLocale = useCallback(
    (locale: Locale) => {
      if (locale === router.locale) {
        return
      }
      const path = router.asPath
      return router.push(path, path, { locale })
    },
    [router]
  )
  return { locale: router.locale, switchLocale, messages: flattenedMessages }
}
