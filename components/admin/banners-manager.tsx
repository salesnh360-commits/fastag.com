"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Banner = any

export default function BannersManager() {
  const [list, setList] = useState<Banner[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", subtitle: "", link: "", image_url: "" })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const r = await fetch("/api/banners", { cache: "no-store" })
    const j = await r.json()
    setList(Array.isArray(j) ? j : [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const create = async () => {
    setSaving(true)
    try {
      const r = await fetch("/api/banners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "failed")
      setForm({ title: "", subtitle: "", link: "", image_url: "" })
      await load()
    } catch (e) { alert(String(e)) } finally { setSaving(false) }
  }

  // Normalize Google Drive links to direct-view URLs
  const normalizeDriveUrl = (url?: string) => {
    if (!url) return url
    try {
      const m1 = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//)
      if (m1 && m1[1]) return `https://lh3.googleusercontent.com/d/${m1[1]}=s800`
      const m2 = url.match(/drive\.(?:google|usercontent)\.com\/.*[?&]id=([^&#]+)/)
      if (m2 && m2[1]) return `https://lh3.googleusercontent.com/d/${decodeURIComponent(m2[1])}=s800`
      return url
    } catch { return url }
  }

  const upload = async (file: File) => {
    const fd = new FormData()
    fd.append("file", file)
    const r = await fetch("/api/banner-upload", { method: "POST", body: fd })
    const j = await r.json()
    if (j?.url) setForm((f) => ({ ...f, image_url: normalizeDriveUrl(j.url) || j.url }))
  }

  const updateField = async (id: number, key: string, value: any) => {
    await fetch("/api/banners", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [key]: value }) })
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-orange-900 p-4 bg-neutral-900">
        <h3 className="text-white font-semibold mb-3">Add Banner</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <Input placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
          <div className="flex gap-2">
            <Input placeholder="Image URL" className="flex-1" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" disabled={saving || !form.image_url} onClick={create}>Create</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-orange-900/60">
        <Table className="text-gray-200">
          <TableHeader>
            <TableRow className="bg-black/40">
              <TableHead className="text-gray-400">ID</TableHead>
              <TableHead className="text-gray-400">Preview</TableHead>
              <TableHead className="text-gray-400">Title</TableHead>
              <TableHead className="text-gray-400">Order</TableHead>
              <TableHead className="text-gray-400">Active</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-gray-400">Loading…</TableCell></TableRow>
            ) : list.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-gray-400">No banners.</TableCell></TableRow>
            ) : (
              list.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="text-gray-300">{b.id}</TableCell>
                  <TableCell className="text-gray-300"><img src={normalizeDriveUrl(b.image_url)} alt="banner" className="h-12 w-auto rounded" /></TableCell>
                  <TableCell className="text-gray-300"><Input defaultValue={b.title || ""} onBlur={(e) => updateField(b.id, "title", e.target.value)} /></TableCell>
                  <TableCell className="text-gray-300"><Input defaultValue={b.sort_order ?? 0} onBlur={(e) => updateField(b.id, "sort_order", Number(e.target.value)||0)} /></TableCell>
                  <TableCell className="text-gray-300">
                    <select defaultValue={String(b.active ? 1 : 0)} onChange={(e) => updateField(b.id, "active", e.target.value === "1")}
                      className="bg-neutral-800 border border-orange-900 rounded px-2 py-1">
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Button variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30" onClick={async () => { await fetch('/api/banners', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: b.id })}); await load() }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
