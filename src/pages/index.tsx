import Link from "next/link"
import { useLocale } from "~/hooks/useLocale"
import { useTranslate } from "~/hooks/useTranslate"

export default function Home() {
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
    </main>
  )
}
