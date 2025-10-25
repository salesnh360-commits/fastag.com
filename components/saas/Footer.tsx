"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type ApiProduct = {
  id: number
  name: string
  price?: number
  original_price?: number
  image_url?: string
  description?: string
  rating?: number
  reviews?: number
  category?: string
  size?: string
  features?: any
}

export default function SaasFooter() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" })
        if (!active) return
        if (res.ok) setProducts(await res.json())
      } catch {
        // ignore
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const { banks, classes, priceRanges } = useMemo(() => {
    const KNOWN_BANKS = [
      "HDFC",
      "ICICI",
      "SBI",
      "IDFC",
      "AXIS",
      "KOTAK",
      "PAYTM",
      "AIRTEL",
    ]

    const bankSet = new Set<string>()
    const classSet = new Set<string>()

    for (const p of products) {
      const name = (p?.name || "").toUpperCase()
      const found = KNOWN_BANKS.find((b) => name.includes(b))
      if (found) bankSet.add(found)

      // Try to pick class from name e.g. "Class 4"
      const m = name.match(/CLASS\s*(\d+)/)
      if (m && m[1]) classSet.add(m[1])

      // Or size field if it looks like a class digit
      const sizeStr = String(p?.size || "").trim()
      if (/^\d{1,2}$/.test(sizeStr)) classSet.add(sizeStr)
    }

    // Price buckets inferred from product prices
    const prices = products
      .map((p) => Number(p?.price ?? 0))
      .filter((n) => !Number.isNaN(n))
    const priceBuckets = [
      { id: "under-500", name: "Under ₹500", in: (n: number) => n < 500 },
      { id: "500-999", name: "₹500 – ₹999", in: (n: number) => n >= 500 && n < 1000 },
      { id: "1000-1999", name: "₹1,000 – ₹1,999", in: (n: number) => n >= 1000 && n < 2000 },
      { id: "2000-plus", name: "₹2,000 and above", in: (n: number) => n >= 2000 },
    ]
    const bucketsWithCounts = priceBuckets
      .map((b) => ({ ...b, count: prices.filter((n) => b.in(n)).length }))
      .filter((b) => b.count > 0)

    return {
      banks: Array.from(bankSet).sort(),
      classes: Array.from(classSet).sort((a, b) => Number(a) - Number(b)),
      priceRanges: bucketsWithCounts,
    }
  }, [products])

  // Limit the product list to a few items to keep footer compact
  const productLinks = useMemo(() => {
    return products.slice(0, 8).map((p) => ({ id: p.id, name: p.name }))
  }, [products])

  return (
    <footer className="bg-white border-t border-orange-200 text-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-6 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-orange-600" />
              <span className="text-xl font-bold text-gray-900">NH360 FASTag</span>
            </div>
            <p className="text-gray-600 text-sm">FASTag sales, recharge and support across India.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Services</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/#buy" className="hover:text-orange-700">Buy FASTag</Link></li>
              <li><Link href="/#recharge" className="hover:text-orange-700">Recharge Assistance</Link></li>
              <li><Link href="/support/kyc-update" className="hover:text-orange-700">KYC Update</Link></li>
              <li><Link href="/support/blacklist-removal" className="hover:text-orange-700">Blacklist Removal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Products</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {productLinks.length === 0 && !loading && (
                <li className="text-gray-500">No products available</li>
              )}
              {productLinks.map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.id}`} className="hover:text-orange-700 line-clamp-1">{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Browse by</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="uppercase tracking-wide text-gray-900">Bank</li>
              <li className="uppercase tracking-wide text-gray-900">Class</li>
              <li className="uppercase tracking-wide text-gray-900">Price</li>
              <li className="uppercase tracking-wide text-gray-900">Delivery Date</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-orange-700">About</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-orange-700">Privacy Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-orange-700">Refund Policy</Link></li>
              <li><Link href="/terms" className="hover:text-orange-700">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Contact</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Phone: +91-8667460935 / +91-8667460635</li>
              <li>Email: info@nh360fastag.com</li>
              <li>Email: support@nh360fastagsolutions.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-orange-200 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NH360 FASTag Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
