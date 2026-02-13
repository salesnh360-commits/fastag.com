"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewBlogForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [docUrl, setDocUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const upload = async (file: File, kind: "image" | "doc") => {
    setUploading(true)
    setMsg(null)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("kind", kind)
      const res = await fetch("/api/blog-upload", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Upload failed")
      if (kind === "image") setImageUrl(data.url)
      else setDocUrl(data.url)
      setMsg("Uploaded successfully")
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setUploading(false)
    }
  }

  const submit = async () => {
    setSaving(true)
    setMsg(null)
    try {
      const excerpt = description.slice(0, 180)
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content: description,
          image_url: imageUrl || undefined,
          doc_url: docUrl || undefined,
          youtube_url: youtubeUrl || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to create blog")
      setMsg("Blog created successfully")
      setTitle("")
      setDescription("")
      setImageUrl("")
      setDocUrl("")
      setYoutubeUrl("")
      router.refresh()
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-orange-900 bg-neutral-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Add Blog</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {msg && <div className="text-sm text-gray-300">{msg}</div>}
        <Input placeholder="Blog Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          placeholder="Blog Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[160px] w-full rounded-md border border-orange-900 bg-neutral-950 p-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-700"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Blog Image</div>
            <Input placeholder="or paste image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "image")} />
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
                const regExp = /(?:instagram\.com\/(?:p|reel|tv)\/)([\w-]+)/
                const match = url.match(regExp)
                return match ? match[1] : null
              }

              const vidId = getYouTubeId(imageUrl) || getYouTubeId(youtubeUrl)
              const instaId = getInstagramId(imageUrl) || getInstagramId(youtubeUrl)

              return vidId ? (
                <div className="mt-2 aspect-video w-48">
                  <iframe
                    className="w-full h-full rounded border border-orange-900"
                    src={`https://www.youtube.com/embed/${vidId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : instaId ? (
                <div className="mt-2">
                  <iframe
                    className="rounded-xl border border-orange-900 bg-white"
                    src={`https://www.instagram.com/p/${instaId}/embed`}
                    width="240"
                    height="300"
                    frameBorder="0"
                    scrolling="no"
                    // @ts-ignore
                    allowtransparency="true"
                  />
                </div>
              ) : (
                imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="preview" className="mt-2 h-24 w-auto rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                )
              )
            })()}
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Document (PDF/Doc)</div>
            <Input placeholder="or paste document URL" value={docUrl} onChange={(e) => setDocUrl(e.target.value)} />
            <Input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "doc")} />
            {docUrl && <a className="text-orange-400 text-xs" href={docUrl} target="_blank" rel="noreferrer">View document</a>}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-gray-400">YouTube URL</div>
          <Input placeholder="https://www.youtube.com/watch?v=... (or paste embed code)" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
        </div>

        <div className="flex justify-end">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={submit} disabled={saving || uploading || !title || !description}>
            {saving ? "Saving..." : "Publish"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
