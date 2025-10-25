import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Blog | NH360 FASTag",
}

export const dynamic = "force-dynamic"

async function fetchPosts(baseUrl: string) {
  try {
    const res = await fetch(`${baseUrl}/api/blogs`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("host") ?? "localhost:3000"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`
  const posts = await fetchPosts(baseUrl)

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link href="/" className="text-orange-400 hover:text-orange-300 text-sm">← Back to Home</Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Blog</h1>
          {posts.length === 0 ? (
            <div className="text-gray-400">No posts yet.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((p: any) => (
                <article key={p.slug} className="rounded-xl border border-orange-900 bg-neutral-900 p-6">
                  <div className="text-xs text-gray-500 mb-2">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</div>
                  <h2 className="text-xl font-semibold text-white mb-2">{p.title}</h2>
                  <p className="text-gray-400 text-sm mb-4">{p.excerpt || ""}</p>
                  <Link href={`/blog/${p.slug}`} className="text-orange-400 hover:text-orange-300 text-sm">Read more →</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
