import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Products | NH360 FASTag",
  description: "Browse all available FASTag products and services.",
}

function normalizeDrive(url?: string) {
  if (!url) return "/placeholder.svg"
  try {
    const u = new URL(url)
    if (u.host.includes("drive.google.com") || u.host.includes("drive.usercontent.google.com")) {
      const m = u.pathname.match(/\/file\/d\/([^/]+)/)
      const fid = (m && m[1]) || u.searchParams.get("id") || ""
      if (fid) return `https://lh3.googleusercontent.com/d/${fid}=s1200`
    }
    return url
  } catch {
    return url || "/placeholder.svg"
  }
}

function rupee(n?: number) {
  return `₹${Number(n ?? 0).toLocaleString("en-IN")}`
}

export default async function ProductsPage() {
  let products: any[] = []
  try {
    const [rows]: any = await db.query("SELECT * FROM products WHERE in_stock = 1 ORDER BY created_at DESC")
    products = Array.isArray(rows) ? rows : []
  } catch {
    products = []
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-orange-50 to-white py-12 border-b border-orange-100">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">All available FASTag products and related services.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center text-gray-600 py-20">
              <div className="text-xl font-semibold text-gray-900">No products found</div>
              <p className="mt-2">Please check back later.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <Card key={p.id} className="border-orange-200 bg-white overflow-hidden">
                  <CardContent className="p-0">
                    <Link href={`/product/${p.id}`}>
                      <Image
                        src={normalizeDrive(p.image_url)}
                        alt={p.name}
                        width={500}
                        height={380}
                        className="w-full h-56 object-cover"
                        unoptimized
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="p-4 space-y-3">
                      <Link href={`/product/${p.id}`}>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] hover:text-orange-600">
                          {p.name}
                        </h3>
                      </Link>
                      {p.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{p.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-gray-900">{rupee(p.price)}</div>
                        <div className="text-gray-400 line-through">{rupee(p.original_price ?? p.price)}</div>
                      </div>
                      <div className="pt-1">
                        <Link href={`/product/${p.id}`}>
                          <Button variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
