import type React from "react"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-context"
import SiteChrome from "@/components/site-chrome"
import Analytics from "@/components/analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://nh360fastag.com"
  ),
  title: {
    default: "NH360 FASTag | FASTag Sales & Support Across India",
    template: "%s | NH360 FASTag",
  },
  description:
    "NH360fastag.com offers FASTag sales, recharge, and support services across India. Get your FASTag quickly, enjoy seamless toll payments, and access expert customer support for all your FASTag needs.",
  keywords:
    "FASTag, toll payment, FASTag recharge, FASTag sales, FASTag support, highway toll, India, NH360fastag",
  authors: [{ name: "NH360fastag.com Team" }],
  creator: "NH360fastag.com",
  publisher: "NH360fastag.com",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NH360fastag.com - FASTag Sales & Services",
    description:
      "Buy FASTag, recharge online, and get support for FASTag services across India. NH360fastag.com makes toll payments easy and hassle-free.",
    url: "https://nh360fastag.com",
    siteName: "NH360fastag.com",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "NH360fastag FASTag Services",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NH360fastag.com - FASTag Sales & Services",
    description:
      "Buy FASTag, recharge, and get support across India with NH360fastag.com.",
    images: ["/images/fastag-banner.jpg"],
  },
}


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF7A00",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="stylesheet" href="/saasland/index.css" />
        {/* theme-color is managed via exported viewport */}
        {process.env.NEXT_PUBLIC_SITE_URL ? (
          <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
        ) : null}
      </head>
      <body className={inter.className}>
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
        {/* Google Analytics */}
        <Suspense fallback={null}>
          <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        </Suspense>
      </body>
    </html>
  )
}
