import type { Metadata } from "next"
import Link from "next/link"
import { branches, getBranchBySlug, formatFullAddress } from "@/data/branches"
import { buildMetadata } from "@/lib/seo"
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd"

export function generateStaticParams() {
  return branches.map((b) => ({ slug: b.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const b = getBranchBySlug(params.slug)
  const title = b
    ? `${b.city} ${b.name.includes("Ganapathy") ? "– Ganapathy" : b.name.includes("KOVAI") ? "– Edayarpalayam" : ""} FASTag – Buy, Install, Recharge`
    : "FASTag Location"

  const description = b
    ? `Buy FASTag in ${b.city} with same-day activation, doorstep install and KYC support. Visit our ${b.addressLine1} branch or order online.`
    : "FASTag sales and installation in Coimbatore."

  const keywords = b
    ? [
        `fastag ${b.city.toLowerCase()}`,
        "fastag near me",
        "fastag shop coimbatore",
        "fastag distributor coimbatore",
        "fastag installation coimbatore",
        ...(b.neighborhoods || []).map((n) => `fastag ${n.toLowerCase()}`),
      ]
    : undefined

  return buildMetadata({
    title,
    description,
    keywords,
    path: `/locations/${params.slug}`,
  })
}

export default function BranchPage({ params }: { params: { slug: string } }) {
  const b = getBranchBySlug(params.slug)
  if (!b) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Location not found</h1>
        <p className="text-muted-foreground">
          This location does not exist. See <Link className="underline" href="/locations">all locations</Link>.
        </p>
      </main>
    )
  }

  const fullAddress = formatFullAddress(b)
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nh360fastag.com"
  const orderUrl = `${siteUrl}/buy?utm_source=google&utm_medium=organic&utm_campaign=gbp_order_button&utm_content=location_page`
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^\d]/g, "")
  const waMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "Hi, I would like to order a FASTag."
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}` : undefined

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-3">FASTag in {b.city} – {b.name}</h1>
      <p className="text-muted-foreground mb-6">
        Same-day activation, doorstep installation, and full KYC support. Serving {b.city} and nearby areas in Tamil Nadu.
      </p>

      <section className="grid gap-6 md:grid-cols-[2fr_3fr]">
        <div>
          <div className="rounded border p-4">
            <div className="font-medium">Address</div>
            <div className="text-sm text-muted-foreground">
              <div>{b.addressLine1}</div>
              <div>{b.city}, {b.state} {b.postalCode}</div>
            </div>
            <div className="mt-3 text-sm">Phone: <a className="underline" href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a></div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={orderUrl} className="inline-flex items-center rounded bg-primary px-4 py-2 text-primary-foreground">
                Order FASTag Online
              </a>
              {waUrl ? (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded border px-4 py-2">
                  WhatsApp Us
                </a>
              ) : null}
              <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="inline-flex items-center rounded border px-4 py-2">
                Call Now
              </a>
              {b.gbpUrl ? (
                <a href={b.gbpUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded border px-4 py-2">
                  View on Google
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <div className="aspect-video w-full overflow-hidden rounded border">
            <iframe title={`Map of ${b.name}`} src={mapSrc} width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded border p-4">
          <h2 className="text-xl font-medium mb-2">Why choose us</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Same-day activation with complete KYC assistance</li>
            <li>Doorstep installation in and around {b.city}</li>
            <li>Personal, commercial, and corporate FASTag support</li>
            <li>Replacement, recharge, and troubleshooting help</li>
          </ul>
        </div>
        <div className="rounded border p-4">
          <h2 className="text-xl font-medium mb-2">Areas we serve</h2>
          <p className="text-sm text-muted-foreground">
            {b.neighborhoods?.length ? b.neighborhoods.join(", ") : `All of ${b.city}`} and the wider Tamil Nadu region.
          </p>
        </div>
      </section>

      <LocalBusinessJsonLd
        name={b.name}
        description={`FASTag distributor and installation in ${b.city}. Same-day activation, doorstep service, and KYC support.`}
        url={`${siteUrl}/locations/${b.slug}`}
        telephone={b.phone}
        address={{
          streetAddress: b.addressLine1,
          addressLocality: b.city,
          addressRegion: b.state,
          postalCode: b.postalCode,
        }}
        sameAs={b.gbpUrl ? [b.gbpUrl] : []}
        areaServed="Tamil Nadu"
      />
    </main>
  )
}
