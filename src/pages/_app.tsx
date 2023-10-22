import type { AppProps } from "next/app"
import { IntlProvider } from "react-intl"
import { lazy } from "react"

import { api } from "~/utils/api"
import { useLocale } from "~/hooks/useLocale"

import "~/styles/globals.css"
// sanity demo css ⬇️
import "~/styles/global.css"

export interface SharedPageProps {
  draftMode: boolean
  token: string
}

const PreviewProvider = lazy(() => import("~/components/PreviewProvider"))

function App({ Component, pageProps }: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps
  const { locale, messages } = useLocale()
  return (
    <>
      {draftMode ? (
        <PreviewProvider token={token}>
          <Component {...pageProps} />
        </PreviewProvider>
      ) : (
        <IntlProvider locale={locale!} messages={messages}>
          <Component {...pageProps} />
        </IntlProvider>
      )}
    </>
  )
}

export default api.withTRPC(App)
