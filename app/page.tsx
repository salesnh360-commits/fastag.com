import type { Metadata } from "next"
import Link from "next/link"
import { HeroCarousel } from "@/components/hero-carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { ProductCarousel } from "@/components/product-carousel"
import BlogCarousel from "@/components/blog-carousel"
import { db } from "@/lib/db"
import { FileText, Ban, RefreshCcw, HelpCircle } from "lucide-react"
import InfographicSteps from "@/components/saas/InfographicSteps"
import HexSteps from "@/components/saas/HexSteps"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "NH360 FASTag | FASTag Sales & Support",
  description:
    "Buy FASTag, recharge across issuers, update KYC, resolve blacklist and manage fleets with NH360 FASTag.",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <HeroCarousel />

      {/* Trust & Issuers */}
      <section className="py-12 border-y border-orange-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[{ k: "FASTags Issued", v: "5,000+" }, { k: "Recharge Assisted", v: "10,000+" }, { k: "Fleets Served", v: "900+" }].map((s) => (
              <CardSpotlight key={s.k}>
                <div className="text-3xl font-extrabold text-gray-900">{s.v}</div>
                <div className="text-sm text-gray-600">{s.k}</div>
              </CardSpotlight>
            ))}
          </div>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-3 text-center">Supported Issuers</div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["HDFC Bank", "ICICI Bank", "IDFC FIRST", "SBI", "Axis Bank", "Kotak", "Paytm", "Airtel Payments Bank"].map((n) => (
                <span key={n} className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-orange-200 text-orange-700 bg-orange-50">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Infographic Steps */}
      <InfographicSteps />

      {/* How It Works - Hex Style */}
      <HexSteps />

      {/* Buy FASTag */}
      <section id="buy" className="py-16 border-t border-orange-900/50">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Buy FASTag</h2>
            <p className="text-gray-600">Same-day activation with doorstep KYC assistance for all vehicle classes.</p>
            <ul className="space-y-2 text-sm">
              {[
                "New tag issuance for cars, LCVs, trucks and buses",
                "Assisted KYC and document guidance",
                "Support for all major issuers",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> {t}
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
                <Link href="/buy">Get Started</Link>
              </Button>
            </div>
          </div>
          <Card className="border-orange-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="text-sm text-gray-600">Why NH360 FASTag?</div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {["PAN-India assistance", "24×7 expert support", "Bulk / fleet issuance", "Dispute help"].map((x) => (
                  <div key={x} className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-gray-700">{x}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recharge FASTag */}
      <section id="recharge" className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Recharge FASTag</h2>
            <p className="text-gray-600">Top up any bank's FASTag. Get help with failed recharges and reversals.</p>
            <ul className="space-y-2 text-sm">
              {["Recharge across all issuers", "Assistance for payment failures / reversals", "Instant help on disputes"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> {t}
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <Button asChild variant="outline" className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50">
                <Link href="/recharge">Recharge Now</Link>
              </Button>
            </div>
          </div>
          <Card className="border-orange-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="text-sm text-gray-600">Common issues we fix</div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {["Wallet not reflecting", "UPI/PG failure", "Reversal delays", "Bank app errors"].map((x) => (
                  <div key={x} className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-gray-700">{x}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative py-16 border-t border-orange-900/50">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_60%_at_50%_40%,#fff7ed,transparent_60%)]" />
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: "KYC Update", d: "Update KYC or change vehicle/owner details", href: "/support/kyc-update", color: "from-sky-500 to-sky-600", Icon: FileText },
              { t: "Blacklist Removal", d: "Resolve blacklist due to KYC or low balance", href: "/support/blacklist-removal", color: "from-rose-500 to-rose-600", Icon: Ban },
              { t: "Tag Replacement", d: "Replace damaged or lost FASTag", href: "/support/tag-replacement", color: "from-amber-500 to-orange-600", Icon: RefreshCcw },
              { t: "Dispute Help", d: "Toll double-charge or debit disputes", href: "/support/dispute", color: "from-indigo-600 to-indigo-700", Icon: HelpCircle },
            ].map(({ t, d, href, color, Icon }) => (
              <Card key={t} className="border-orange-200 bg-white/90 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className={`h-10 w-10 rounded-md bg-gradient-to-r ${color} text-white flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t}</h3>
                  <p className="text-gray-600 text-sm">{d}</p>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white w-full">
                    <Link href={href}>Start</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-16 border-t border-orange-900/50">
        <div className="container mx-auto px-4">
          {/* Server-side DB backed carousel */}
          {/* Pulls latest products via db and renders ProductCarousel */}
          {/* If DB fails or is empty, this quietly renders nothing */}
          {/* Available products are also linked in the footer */}
          {/* to help discoverability via filters. */}
          {/* eslint-disable-next-line react/jsx-no-undef */}
          {}
          {/**/}
          {DBProductsCarousel()}
        </div>
      </section>
{/* Blog teasers */}
      <section id="blog" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">From the blog</h2>
            <Link href="/blog" className="text-orange-400 hover:text-orange-300 text-sm">View all</Link>
          </div>
          <BlogCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 border-t border-orange-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">FAQ</h2>
          <Accordion type="single" collapsible className="bg-orange-50 rounded-xl border border-orange-200">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4 text-left text-gray-900">How fast can I get a FASTag?</AccordionTrigger>
              <AccordionContent className="px-4 text-gray-700">Most tags are activated the same day once KYC is complete.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4 text-left text-gray-900">Do you support all issuers?</AccordionTrigger>
              <AccordionContent className="px-4 text-gray-700">Yes, we assist across major banks including HDFC, ICICI, SBI, Axis, IDFC FIRST, Kotak, Paytm and more.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4 text-left text-gray-900">Can you help with blacklist or disputes?</AccordionTrigger>
              <AccordionContent className="px-4 text-gray-700">We help resolve blacklist due to KYC/low balance and assist with toll double-charge or debit disputes.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Ready to get your FASTag?</h2>
              <p className="text-orange-100">Quick onboarding with 24×7 expert support.</p>
            </div>
            <Link href="/buy" className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-orange-700 font-semibold hover:bg-orange-50">Get Started</Link>
          </div>
        </div>
      </section>

    </main>
  )
}

// Server component that fetches products from API and renders carousel
async function DBProductsCarousel() {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY created_at DESC LIMIT 24")
    const products = Array.isArray(rows)
      ? (rows as any[]).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: `₹${p.price ?? 0}`,
          originalPrice: `₹${p.original_price ?? p.price ?? 0}`,
          image: p.image_url || "/placeholder.svg",
          description: p.description || "FASTag issuance with KYC and activation support",
          rating: Number(p.rating ?? 4.7),
          reviews: Number(p.reviews ?? 0),
          category: p.category || "fastag",
          features: Array.isArray(p.features) ? p.features : ["Same-day activation", "PAN-India"],
        }))
      : []

  return (
      <ProductCarousel
        title="FASTag Products"
        subtitle="Live catalogue"
        showDots={false}
        products={products as any}
      />
    )
  } catch {
    return null
  }
}

