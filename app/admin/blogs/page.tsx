import Link from "next/link"
import { Button } from "@/components/ui/button"
import { headers } from "next/headers"
import AdminBlogsList from "@/components/admin/blogs-list"

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

export default async function AdminBlogsPage() {
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("host") ?? "localhost:3000"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`
  const posts = await fetchPosts(baseUrl)
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <section className="py-10">
        <div className="container mx-auto px-4 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Manage Blog Posts</h1>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
              <Link href="/admin/blogs/new">New Post</Link>
            </Button>
          </div>
          {posts.length === 0 ? (
            <div className="text-gray-400">No posts yet.</div>
          ) : (
            <AdminBlogsList posts={posts as any} />
          )}
        </div>
      </section>
    </div>
  )
}
