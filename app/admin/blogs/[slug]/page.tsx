"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Post = {
  slug: string
  title: string
  excerpt?: string
  content: string
  author?: string
  image_url?: string | null
  doc_url?: string | null
  youtube_url?: string | null
}

export default function EditBlogPostPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params.slug

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`, { cache: "no-store" })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load")
        if (mounted) setPost(data)
      } catch (e: any) {
        if (mounted) setError(e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [slug])

  const update = async () => {
    if (!post) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          excerpt: post.excerpt ?? "",
          content: post.content,
          author: post.author ?? "",
          image_url: post.image_url ?? null,
          doc_url: post.doc_url ?? null,
          youtube_url: post.youtube_url ?? null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to update")
      router.push("/admin/blogs")
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-200">
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-gray-400">Loading…</div>
          </div>
        </section>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-gray-200">
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-red-400 text-sm mb-4">{error || "Post not found"}</div>
            <Link href="/admin/blogs" className="text-orange-400 hover:text-orange-300 text-sm">← Back to list</Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Edit Blog Post</h1>
            <Link href="/admin/blogs" className="text-orange-400 hover:text-orange-300 text-sm">Back to list</Link>
          </div>
          <Card className="border-orange-900 bg-neutral-900">
            <CardContent className="p-6 space-y-4">
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <Input
                placeholder="Title"
                value={post.title}
                onChange={(e) => setPost({ ...(post as Post), title: e.target.value })}
              />
              <Input
                placeholder="Excerpt (optional)"
                value={post.excerpt ?? ""}
                onChange={(e) => setPost({ ...(post as Post), excerpt: e.target.value })}
              />
              <Input
                placeholder="Author (optional)"
                value={post.author ?? ""}
                onChange={(e) => setPost({ ...(post as Post), author: e.target.value })}
              />
              <Input
                placeholder="Image URL (optional)"
                value={post.image_url ?? ""}
                onChange={(e) => setPost({ ...(post as Post), image_url: e.target.value })}
              />
              <Input
                placeholder="Document URL (optional)"
                value={post.doc_url ?? ""}
                onChange={(e) => setPost({ ...(post as Post), doc_url: e.target.value })}
              />
              <Input
                placeholder="YouTube URL (optional)"
                value={post.youtube_url ?? ""}
                onChange={(e) => setPost({ ...(post as Post), youtube_url: e.target.value })}
              />
              {(() => {
                const getYouTubeId = (url: string) => {
                  if (!url) return null
                  const srcMatch = url.match(/src=["']([^"']+)["']/)
                  if (srcMatch) url = srcMatch[1]
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
                  const match = url.match(regExp)
                  return (match && match[2].length === 11) ? match[2] : null
                }

                const getInstagramId = (url: string) => {
                  if (!url) return null
                  const regExp = /(?:instagram\.com\/(?:p|reel|tv)\/)([\w-]+)/
                  const match = url.match(regExp)
                  return match ? match[1] : null
                }

                const vidId = getYouTubeId(post.youtube_url || "") || getYouTubeId(post.image_url || "")
                const instaId = getInstagramId(post.youtube_url || "") || getInstagramId(post.image_url || "")

                return (
                  <div className="mt-2">
                    {vidId ? (
                      <div className="aspect-video w-64">
                        <iframe
                          className="w-full h-full rounded border border-orange-900"
                          src={`https://www.youtube.com/embed/${vidId}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : instaId ? (
                      <div className="flex justify-start">
                        <iframe
                          className="rounded-xl border border-orange-900 bg-white"
                          src={`https://www.instagram.com/p/${instaId}/embed`}
                          width="320"
                          height="400"
                          frameBorder="0"
                          scrolling="no"
                          // @ts-ignore
                          allowtransparency="true"
                        />
                      </div>
                    ) : (post.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.image_url} alt="preview" className="h-32 w-auto rounded border border-orange-900" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    ))}
                  </div>
                )
              })()}
              <textarea
                placeholder="Content"
                value={post.content}
                onChange={(e) => setPost({ ...(post as Post), content: e.target.value })}
                className="min-h-[240px] w-full rounded-md border border-orange-900 bg-neutral-950 p-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-700"
              />
              <div className="flex justify-end gap-3">
                <Button variant="outline" asChild>
                  <Link href={`/blog/${post.slug}`}>Preview</Link>
                </Button>
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={update}
                  disabled={saving || !post.title || !post.content}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

