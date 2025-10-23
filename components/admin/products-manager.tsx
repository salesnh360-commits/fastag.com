"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Product = any

export default function ProductsManager() {
  const [list, setList] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", price: "", original_price: "", image_url: "", category: "", size: "", description: "" })
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    const r = await fetch("/api/products", { cache: "no-store" })
    const j = await r.json()
    setList(Array.isArray(j) ? j : [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const normalizeDriveUrl = (url?: string) => {
    if (!url) return url
    try {
      const m1 = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//)
      if (m1 && m1[1]) return `https://drive.google.com/uc?export=view&id=${m1[1]}`
      const m2 = url.match(/drive\.(?:google|usercontent)\.com\/.*[?&]id=([^&#]+)/)
      if (m2 && m2[1]) return `https://drive.google.com/uc?export=view&id=${decodeURIComponent(m2[1])}`
      return url
    } catch { return url }
  }

  const create = async () => {
    setCreating(true)
    try {
      const r = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image_url: normalizeDriveUrl(form.image_url), rating: 0, reviews: 0, features: [], specifications: [], benefits: [], technology: [], certifications: [], suitable_for: [], care_instructions: [], why_choose: [], in_stock: 1 }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "failed")
      setForm({ name: "", price: "", original_price: "", image_url: "", category: "", size: "", description: "" })
      await load()
    } catch (e) { alert(String(e)) } finally { setCreating(false) }
  }

  const uploadImage = async (id: number, file: File) => {
    const form = new FormData()
    form.append("productId", String(id))
    form.append("type", "image")
    form.append("files", file)
    const r = await fetch("/api/upload", { method: "POST", body: form })
    const j = await r.json()
    const url = j?.urls?.[0]
    if (url) {
      await fetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, image_url: url }) })
      await load()
    }
  }

  const updateField = async (id: number, key: string, value: any) => {
    await fetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, [key]: value }) })
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-orange-900 p-4 bg-neutral-900">
        <h3 className="text-white font-semibold mb-3">Add Product</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input placeholder="Original Price" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
          <Input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <Input placeholder="Short Description" className="md:col-span-3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mt-3 flex justify-end">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" disabled={creating || !form.name || !form.price} onClick={create}>Create</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-orange-900/60">
        <Table className="text-gray-200">
          <TableHeader>
            <TableRow className="bg-black/40">
              <TableHead className="text-gray-400">ID</TableHead>
              <TableHead className="text-gray-400">Image</TableHead>
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Price</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-gray-400">Loading…</TableCell></TableRow>
            ) : list.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-gray-400">No products.</TableCell></TableRow>
            ) : (
              list.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-gray-300">{p.id}</TableCell>
                  <TableCell className="text-gray-300">
                    {p.image_url ? (
                      <img src={normalizeDriveUrl(p.image_url)} alt="img" className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(p.id, e.target.files![0])} />
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Input defaultValue={p.name} onBlur={(e) => updateField(p.id, "name", e.target.value)} />
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Input defaultValue={p.price} onBlur={(e) => updateField(p.id, "price", e.target.value)} />
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Input defaultValue={p.category} onBlur={(e) => updateField(p.id, "category", e.target.value)} />
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Button variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/30 mr-2" onClick={() => { const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*'; f.onchange = (ev: any) => ev.target.files?.[0] && uploadImage(p.id, ev.target.files[0]); f.click() }}>Upload Image</Button>
                    <Button variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30" onClick={async () => { await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id }) }); await load() }}>Delete</Button>
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
