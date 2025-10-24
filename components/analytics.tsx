"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

type Props = {
  gaId?: string
}

export default function Analytics({ gaId }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!gaId) return
    if (typeof window === "undefined" || !(window as any).gtag) return

    const pagePath = `${pathname || "/"}${searchParams?.toString() ? `?${searchParams}` : ""}`
    ;(window as any).gtag("config", gaId, {
      page_path: pagePath,
    })
  }, [gaId, pathname, searchParams])

  if (!gaId) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
