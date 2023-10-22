import { type AppType } from "next/app"
import { IntlProvider } from "react-intl"

import { api } from "~/utils/api"
import { useLocale } from "~/hooks/useLocale"

import "~/styles/globals.css"

const App: AppType = ({ Component, pageProps }) => {
  const { locale, messages } = useLocale()
  return (
    <IntlProvider locale={locale!} messages={messages}>
      <Component {...pageProps} />
    </IntlProvider>
  )
}

export default api.withTRPC(App)
