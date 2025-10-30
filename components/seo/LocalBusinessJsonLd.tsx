"use client"

import Script from "next/script"

type Props = {
  name: string
  description?: string
  url: string
  telephone?: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry?: string
  }
  sameAs?: string[]
  areaServed?: string
  services?: string[]
}

export default function LocalBusinessJsonLd({
  name,
  description,
  url,
  telephone,
  address,
  sameAs = [],
  areaServed = "Tamil Nadu",
  services = [
    "FASTag Distributor",
    "FASTag Shop",
    "FASTag Installation",
    "FASTag Recharge",
    "FASTag Replacement",
  ],
}: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    telephone,
    areaServed,
    sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry || "IN",
    },
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
      availability: "https://schema.org/InStock",
      areaServed,
    })),
  }

  return (
    <Script id={`jsonld-localbusiness-${name}`} type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  )
}
