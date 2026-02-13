import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Post | NH360 FASTag",
}

export const dynamic = "force-dynamic"

async function fetchPost(baseUrl: string, slug: string) {
  try {
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, { cache: "no-store" })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("host") ?? "localhost:3000"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`
  const post = await fetchPost(baseUrl, params.slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-gray-200">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Link href="/blog" className="text-orange-400 hover:text-orange-300 text-sm">← Back to Blog</Link>
            <h1 className="text-2xl font-bold text-white mt-4">Not Found</h1>
            <p className="text-gray-400">This post does not exist.</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog" className="text-orange-400 hover:text-orange-300 text-sm">← Back to Blog</Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4">{post.title}</h1>
          <div className="text-xs text-gray-500 mt-2">{post.created_at ? new Date(post.created_at).toLocaleString() : "—"} {post.author ? `• ${post.author}` : ""}</div>
          {(() => {
            const getYouTubeId = (url: string) => {
              if (!url) return null
              // Handle if user pasted full iframe code
              const srcMatch = url.match(/src=["']([^"']+)["']/)
              if (srcMatch) url = srcMatch[1]

              const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
              const match = url.match(regExp)
              return (match && match[2].length === 11) ? match[2] : null
            }

            const getInstagramId = (url: string) => {
              if (!url) return null
              // standard instagram regex for p/reel/tv
              const regExp = /(?:instagram\.com\/(?:p|reel|tv)\/)([\w-]+)/
              const match = url.match(regExp)
              return match ? match[1] : null
            }

            // Check if image_url is actually a video URL (common user error)
            let videoId = getYouTubeId(post.youtube_url || "")
            let instaId = getInstagramId(post.youtube_url || "")
            let imageUrl = post.image_url

            // If main video field is empty or invalid, check image field for accidental video paste
            if (!videoId && !instaId && post.image_url) {
              const possibleYtId = getYouTubeId(post.image_url)
              const possibleInstaId = getInstagramId(post.image_url)

              if (possibleYtId) {
                videoId = possibleYtId
                imageUrl = null
              } else if (possibleInstaId) {
                instaId = possibleInstaId
                imageUrl = null
              }
            }

            return (
              <>
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt={post.title} className="mt-6 rounded-xl border border-orange-900 w-full object-cover max-h-[500px]" onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
                {videoId && (
                  <div className="mt-6 aspect-video">
                    <iframe
                      className="w-full h-full rounded-xl border border-orange-900"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {instaId && (
                  <div className="mt-6 flex justify-center">
                    <iframe
                      className="rounded-xl border border-orange-900 bg-white"
                      src={`https://www.instagram.com/p/${instaId}/embed`}
                      width="400"
                      height="480"
                      frameBorder="0"
                      scrolling="no"
                      // @ts-ignore
                      allowtransparency="true"
                    />
                  </div>
                )}
              </>
            )
          })()}
          <div className="mt-6 whitespace-pre-wrap leading-7 text-gray-200">{post.content}</div>
          {post.doc_url && (
            <div className="mt-4">
              <a className="text-orange-400 hover:text-orange-300" href={post.doc_url} target="_blank" rel="noreferrer">View attached document</a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
