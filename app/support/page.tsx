import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Get Support | NH360 FASTag",
}

export default function SupportPage() {
  const categories = [
    { t: "KYC Update", d: "Update KYC or change vehicle/owner details", href: "/support/kyc-update" },
    { t: "Blacklist Removal", d: "Resolve blacklist due to KYC or low balance", href: "/support/blacklist-removal" },
    { t: "Tag Replacement", d: "Replace damaged or lost FASTag", href: "/support/tag-replacement" },
    { t: "Dispute Help", d: "Toll double-charge or debit disputes", href: "/support/dispute" },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link href="/" className="text-orange-700 hover:text-orange-600 text-sm">← Back to Home</Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Get Support</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c) => (
              <Card key={c.t} className="border-orange-200 bg-white">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">{c.t}</h3>
                  <p className="text-gray-600 text-sm">{c.d}</p>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white w-full">
                    <Link href={c.href}>Start</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
