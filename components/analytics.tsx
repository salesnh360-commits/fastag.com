"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

type Props = {
  gaId?: string
}

/**
 * Google Analytics + Consent Mode v2 wiring.
 * - Defaults all storages to denied until the user consents via the banner.
 * - Syncs stored consent from localStorage on load and on updates.
 */
export default function Analytics({ gaId }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Re-issue config on route changes or explicit consent updates
  useEffect(() => {
    if (!gaId) return
    if (typeof window === "undefined" || !(window as any).gtag) return

    const pagePath = `${pathname || "/"}${searchParams?.toString() ? `?${searchParams}` : ""}`
    ;(window as any).gtag("config", gaId, {
      page_path: pagePath,
      anonymize_ip: true,
    })
  }, [gaId, pathname, searchParams])

  // Listen for consent updates to re-configure GA once consent flips to granted
  useEffect(() => {
    if (!gaId) return
    const handler = () => {
      try {
        if (typeof window === "undefined" || !(window as any).gtag) return
        const pagePath = `${pathname || "/"}${searchParams?.toString() ? `?${searchParams}` : ""}`
        ;(window as any).gtag("config", gaId, {
          page_path: pagePath,
          anonymize_ip: true,
        })
      } catch {}
    }
    window.addEventListener("consent:updated", handler)
    return () => window.removeEventListener("consent:updated", handler)
  }, [gaId, pathname, searchParams])

  if (!gaId) return null
  return (
    <>
      {/* Define dataLayer/gtag and set default denied BEFORE any analytics loads */}
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          // Consent Mode v2 defaults (deny until user accepts)
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
        `}
      </Script>

      {/* Load GA */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {/* Initialize GA (anonymize IP). Do not override consent defaults here. */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>

      {/* Sync stored consent at startup (if user has already chosen) */}
      <Script id="ga-consent-sync" strategy="afterInteractive">
        {`
          try {
            var raw = localStorage.getItem('cookie_consent_v1');
            if (raw) {
              var parsed = {};
              try { parsed = JSON.parse(raw) || {}; } catch {}
              var analyticsGranted = !!parsed.analytics;
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('consent', 'update', { analytics_storage: analyticsGranted ? 'granted' : 'denied' });
              }
            }
          } catch (e) {}
        `}
      </Script>
    </>
  )
}
