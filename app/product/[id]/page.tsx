"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-context"

type DbProduct = {
  id: number
  name: string
  price?: number
  original_price?: number
  image_url?: string
  description?: string
  rating?: number
  reviews?: number
  category?: string
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const { dispatch } = useCart()
  const [p, setP] = useState<DbProduct | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" })
        if (!active) return
        if (res.ok) setP(await res.json())
      } finally { if (active) setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [id])

  const normalizeDrive = (url?: string) => {
    if (!url) return "/placeholder.svg"
    try {
      const u = new URL(url)
      if (u.host.includes("drive.google.com") || u.host.includes("drive.usercontent.google.com")) {
        const m = u.pathname.match(/\/file\/d\/([^/]+)/)
        const fid = (m && m[1]) || u.searchParams.get("id") || ""
        if (fid) return "https://lh3.googleusercontent.com/d/" + fid + "=s1600"
      }
      return url
    } catch { return url }
  }

  const rupee = (n?: number) => `₹${Number(n ?? 0).toLocaleString("en-IN")}`

  const addToCart = () => {
    if (!p) return
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: p.id,
        name: p.name,
        price: Number(p.price ?? 0),
        originalPrice: Number(p.original_price ?? p.price ?? 0),
        image: normalizeDrive(p.image_url),
      },
    })
    dispatch({ type: "OPEN_CART" })
  }

  if (loading) {
    return <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">Loading…</div>
  }
  if (!p) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold">Product not found</div>
          <Link href="/" className="text-orange-400">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-xl overflow-hidden border border-orange-900">
            <Image
              src={normalizeDrive(p.image_url)}
              alt={p.name}
              width={900}
              height={700}
              className="w-full h-[420px] object-cover"
              unoptimized
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{p.name}</h1>
            {p.description && <p className="text-gray-400">{p.description}</p>}
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-white">{rupee(p.price)}</div>
              <div className="text-xl text-white/50 line-through">{rupee(p.original_price ?? p.price)}</div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={addToCart}>Add to Cart</Button>
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50"
                onClick={addToCart}>Buy Now</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
