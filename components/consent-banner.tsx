"use client"

import { useEffect, useState } from "react"

type Consent = {
  analytics: boolean
  ts: number
}

const STORAGE_KEY = "cookie_consent_v1"

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        setVisible(true)
        return
      }
      const parsed = JSON.parse(raw) as Consent
      if (parsed && typeof parsed.analytics === "boolean") {
        setVisible(false)
      } else {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const setConsent = (granted: boolean) => {
    try {
      const val: Consent = { analytics: granted, ts: Date.now() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {}

    try {
      // Update Google Consent Mode
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("consent", "update", {
          analytics_storage: granted ? "granted" : "denied",
        })
      }
    } catch {}

    // Notify listeners (e.g., Analytics component) to re-configure as needed
    try {
      window.dispatchEvent(new Event("consent:updated"))
    } catch {}

    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-sm text-gray-700">
          We use cookies to analyze traffic and improve your experience. Analytics
          cookies are used only if you consent. See our {" "}
          <a className="underline" href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>.
        </p>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => setConsent(false)}
          >
            Decline
          </button>
          <button
            className="px-3 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700"
            onClick={() => setConsent(true)}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

