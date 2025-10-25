"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

type BlogItem = {
  slug: string
  title: string
  excerpt?: string
  created_at?: string
}

export default function BlogCarousel() {
  const [posts, setPosts] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState(true)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch("/api/blogs", { cache: "no-store" })
        if (!res.ok) throw new Error("failed")
        const data = (await res.json()) as BlogItem[]
        // Ensure newest first even if API changes ordering
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => {
          const ad = a.created_at ? new Date(a.created_at).getTime() : 0
          const bd = b.created_at ? new Date(b.created_at).getTime() : 0
          return bd - ad
        })
        if (mounted) setPosts(sorted)
      } catch {
        if (mounted) setPosts([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    // card width + gap (approx)
    const amount = 360 // px
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-orange-200 bg-white p-6 animate-pulse h-[180px]" />
        ))}
      </div>
    )
  }

  if (!posts.length) {
    return <div className="text-gray-400">No posts yet.</div>
  }

  return (
    <div className="relative">
      {/* Track */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        >
          {posts.map((p) => (
            <article
              key={p.slug}
              className="snap-start shrink-0 rounded-xl border border-orange-200 bg-white p-6 w-[340px] h-[180px] flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-gray-500 mb-2">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-snug h-12 overflow-hidden">
                  {p.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 h-10 overflow-hidden">
                  {p.excerpt || ""}
                </p>
              </div>
              <div>
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-orange-400 hover:text-orange-300 text-sm"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none">
        <button
          onClick={() => scrollBy(-1)}
          className="pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow border border-gray-200"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M15.53 4.47a.75.75 0 0 1 0 1.06L9.06 12l6.47 6.47a.75.75 0 1 1-1.06 1.06l-7-7a.75.75 0 0 1 0-1.06l7-7a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow border border-gray-200"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M8.47 19.53a.75.75 0 0 1 0-1.06L14.94 12 8.47 5.53a.75.75 0 0 1 1.06-1.06l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
