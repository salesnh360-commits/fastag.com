import Link from "next/link"
import { branches } from "@/data/branches"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Locations",
  path: "/locations",
  description:
    "Find NH360 FASTag branches in Coimbatore including Ganapathy and Edayarpalayam. Same-day FASTag activation, installation, and KYC support across Tamil Nadu.",
  keywords: [
    "fastag coimbatore",
    "fastag ganapathy",
    "fastag edayarpalayam",
    "fastag shop coimbatore",
    "fastag distributor coimbatore",
  ],
})

export default function LocationsPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Our FASTag Locations in Coimbatore</h1>
      <p className="text-muted-foreground mb-8">
        Visit a nearby branch or order online for doorstep service. We serve all of Tamil Nadu.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {branches.map((b) => (
          <li key={b.slug} className="rounded-lg border p-4">
            <h2 className="text-xl font-medium mb-2">
              <Link className="hover:underline" href={`/locations/${b.slug}`}>
                {b.name}
              </Link>
            </h2>
            <div className="text-sm text-muted-foreground">
              <div>{b.addressLine1}</div>
              <div>
                {b.city}, {b.state} {b.postalCode}
              </div>
              <div>Phone: {b.phone}</div>
            </div>
            <div className="mt-3 flex gap-3">
              <Link
                href={`/locations/${b.slug}`}
                className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-muted"
              >
                View Details
              </Link>
              {b.gbpUrl ? (
                <a
                  href={b.gbpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-muted"
                >
                  Google Listing
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
