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
  const [uploading, setUploading] = useState(false)
  const [rowEdits, setRowEdits] = useState<Record<number, Partial<Product>>>({})

  // FASTag class and vehicle mappings
  const CLASS_OPTIONS = ["Class 4", "Class 5", "Class 6", "Class 7", "Class 12"]
  const VEHICLE_BY_CLASS: Record<string, string[]> = {
    "Class 4": ["Car/Jeep/Van"],
    "Class 5": ["LCV"],
    "Class 6": ["Bus (2-axle)", "Truck (2-axle)"],
    "Class 7": ["Bus (3-axle)", "Truck (3-axle)"],
    "Class 12": ["Truck (Multi-axle)", "Heavy Vehicle"],
  }
  const vehiclesFor = (cls?: string) => VEHICLE_BY_CLASS[cls || ""] || []

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

  const uploadNewImage = async (file: File) => {
    if (!form.name.trim()) {
      alert("Please enter product Name first");
      return;
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("type", "image")
      fd.append("productName", form.name.trim())
      fd.append("files", file)
      const r = await fetch("/api/upload", { method: "POST", body: fd })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "Upload failed")
      const url = j?.urls?.[0]
      if (url) setForm({ ...form, image_url: url })
    } catch (e) {
      alert(String(e))
    } finally {
      setUploading(false)
    }
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

  const setEdit = (id: number, key: string, value: any) => {
    setRowEdits((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [key]: value } }))
  }

  const saveRow = async (p: any) => {
    const patch = rowEdits[p.id] || {}
    const entries = Object.entries(patch)
    if (entries.length === 0) return
    for (const [k, v] of entries) {
      await fetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, [k]: v }) })
    }
    setRowEdits((prev) => { const n = { ...prev }; delete n[p.id]; return n })
    await load()
  }

  const resetRow = (id: number) => {
    setRowEdits((prev) => { const n = { ...prev }; delete n[id]; return n })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-orange-900 p-4 bg-neutral-900">
        <h3 className="text-white font-semibold mb-3">Add Product</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input placeholder="Original Price" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} />
          <select
            className="h-10 rounded-md border border-orange-900 bg-neutral-900 px-3 text-gray-200"
            value={form.category}
            onChange={(e) => {
              const cls = e.target.value
              const v = vehiclesFor(cls)[0] || ""
              setForm({ ...form, category: cls, size: v })
            }}
          >
            <option value="">Select Class</option>
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="h-10 rounded-md border border-orange-900 bg-neutral-900 px-3 text-gray-200"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
          >
            <option value="">Select Vehicle</option>
            {vehiclesFor(form.category).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Input className="flex-1" placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <Button type="button" variant="outline" disabled={uploading || !form.name.trim()} onClick={() => { const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*'; f.onchange = (ev: any) => ev.target.files?.[0] && uploadNewImage(ev.target.files[0]); f.click(); }}>
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
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
              <TableHead className="text-gray-400 w-12">ID</TableHead>
              <TableHead className="text-gray-400 w-20">Image</TableHead>
              <TableHead className="text-gray-400 w-56">Name</TableHead>
              <TableHead className="text-gray-400 w-32">Price</TableHead>
              <TableHead className="text-gray-400 w-40">Class</TableHead>
              <TableHead className="text-gray-400 w-40">Vehicle</TableHead>
              <TableHead className="text-gray-400 w-24 text-center">Active</TableHead>
              <TableHead className="text-gray-400 w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-gray-400">Loading…</TableCell></TableRow>
            ) : list.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-gray-400">No products.</TableCell></TableRow>
            ) : (
              list.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-gray-300 align-middle">{p.id}</TableCell>
                  <TableCell className="text-gray-300 align-middle">
                    {p.image_url ? (
                      <img src={normalizeDriveUrl(p.image_url)} alt="img" className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(p.id, e.target.files![0])} />
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300 align-middle">
                    <Input className="h-9 w-64" defaultValue={p.name} onBlur={(e) => updateField(p.id, 'name', e.target.value)} />
                  </TableCell>
                  <TableCell className="text-gray-300 align-middle">
                    <Input className="h-9 w-36" defaultValue={p.price} onBlur={(e) => updateField(p.id, 'price', e.target.value)} />
                  </TableCell>
                  <TableCell className="text-gray-300 align-middle">
                    <select
                      className="h-9 rounded-md border border-orange-900 bg-neutral-900 px-2 text-gray-200 w-40"
                      defaultValue={p.category || ''}
                      onChange={(e) => {
                        const cls = e.target.value
                        const v = vehiclesFor(cls)[0] || ''
                        updateField(p.id, 'category', cls)
                        updateField(p.id, 'size', v)
                      }}
                    >
                      <option value="">Select Class</option>
                      {CLASS_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="text-gray-300 align-middle">
                    <select
                      className="h-9 rounded-md border border-orange-900 bg-neutral-900 px-2 text-gray-200 w-40"
                      defaultValue={p.size || ''}
                      onChange={(e) => updateField(p.id, 'size', e.target.value)}
                    >
                      <option value="">Select Vehicle</option>
                      {vehiclesFor(p.category).map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="text-gray-300 text-center align-middle">
                    <select
                      defaultValue={String(Number(p.in_stock) === 1 ? 1 : 0)}
                      onChange={(e) => updateField(p.id, 'in_stock', e.target.value === '1' ? 1 : 0)}
                      className="bg-neutral-800 border border-orange-900 rounded px-2 py-1"
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-gray-300 align-middle text-right">
                    <Button size="sm" variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30" onClick={async () => { await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id }) }); await load() }}>Delete</Button>
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
