"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Shop = {
  id: number
  name: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  contact_name?: string
  phone?: string
  email?: string
  status?: string
  lat?: number
  lng?: number
  gbp_url?: string
}

export default function ShopsManager() {
  const [list, setList] = useState<Shop[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Partial<Shop>>({ name: "", city: "", phone: "" })
  const [rowEdits, setRowEdits] = useState<Record<number, Partial<Shop>>>({})

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/shops", { cache: "no-store" })
      const j = await r.json()
      setList(Array.isArray(j) ? j : [])
    } catch {
      setList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.name || !form.name.trim()) {
      alert("Please enter shop name")
      return
    }
    setCreating(true)
    try {
      const r = await fetch("/api/shops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "Failed to create shop")
      setForm({ name: "", city: "", phone: "" })
      await load()
    } catch (e) {
      alert(String(e))
    } finally {
      setCreating(false)
    }
  }

  const updateField = async (id: number, patch: Partial<Shop>) => {
    const r = await fetch("/api/shops", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) })
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      alert(j?.error || "Failed to update shop")
    }
  }

  const saveRow = async (s: Shop) => {
    const patch = rowEdits[s.id]
    if (!patch) return
    await updateField(s.id, patch)
    setRowEdits((prev) => { const p = { ...prev }; delete p[s.id]; return p })
    await load()
  }

  const remove = async (id: number) => {
    if (!confirm("Delete this shop?")) return
    const r = await fetch("/api/shops", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    const j = await r.json()
    if (!r.ok) {
      alert(j?.error || "Failed to delete shop")
    } else {
      await load()
    }
  }

  // Import from Google Maps / text query
  const [mapsInput, setMapsInput] = useState("")
  const [resolving, setResolving] = useState(false)
  const resolveFromGoogle = async () => {
    if (!mapsInput.trim()) return
    setResolving(true)
    try {
      const r = await fetch("/api/places/resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: mapsInput }) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "No result")
      setForm((prev) => ({
        ...prev,
        name: j.name || prev.name,
        address: j.address || prev.address,
        city: j.city || prev.city,
        state: j.state || prev.state,
        pincode: j.pincode || prev.pincode,
        lat: typeof j.lat === 'number' ? j.lat : prev.lat,
        lng: typeof j.lng === 'number' ? j.lng : prev.lng,
        gbp_url: j.gbp_url || prev.gbp_url,
      }))
    } catch (e) {
      alert(String(e))
    } finally {
      setResolving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <Input placeholder="Paste Google Maps link or type place name" value={mapsInput} onChange={(e) => setMapsInput(e.target.value)} />
        <Button onClick={resolveFromGoogle} disabled={resolving} className="bg-orange-600 hover:bg-orange-700 text-white">{resolving ? "Fetching..." : "Fetch from Google"}</Button>
      </div>
      <div className="grid md:grid-cols-4 gap-3 items-end">
        <Input placeholder="Shop name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="City" value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Button onClick={create} disabled={creating} className="bg-orange-600 hover:bg-orange-700 text-white">{creating ? "Adding..." : "Add Shop"}</Button>
        <div className="md:col-span-4 grid md:grid-cols-3 gap-3">
          <Input placeholder="Address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input placeholder="State" value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          <Input placeholder="Pincode" value={form.pincode || ""} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
          <Input placeholder="Contact name" value={form.contact_name || ""} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
          <Input placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Status (active/inactive)" value={form.status || ""} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <Input placeholder="Google listing URL (optional)" value={form.gbp_url || ""} onChange={(e) => setForm({ ...form, gbp_url: e.target.value })} />
          <Input placeholder="Latitude" value={form.lat !== undefined ? String(form.lat) : ""} onChange={(e) => setForm({ ...form, lat: e.target.value ? Number(e.target.value) : undefined })} />
          <Input placeholder="Longitude" value={form.lng !== undefined ? String(form.lng) : ""} onChange={(e) => setForm({ ...form, lng: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-orange-900/60">
        <Table className="text-gray-200">
          <TableHeader>
            <TableRow className="bg-black/40">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">City</TableHead>
              <TableHead className="text-gray-400">Phone</TableHead>
              <TableHead className="text-gray-400">Address</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Map</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell className="text-gray-400" colSpan={7}>Loading...</TableCell></TableRow>
            ) : list.length === 0 ? (
              <TableRow><TableCell className="text-gray-400" colSpan={7}>No shops found.</TableCell></TableRow>
            ) : (
              list.map((s) => {
                const edits = rowEdits[s.id] || {}
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Input value={(edits.name ?? s.name) || ""} onChange={(e) => setRowEdits((p) => ({ ...p, [s.id]: { ...(p[s.id] || {}), name: e.target.value } }))} />
                    </TableCell>
                    <TableCell>
                      <Input value={(edits.city ?? s.city) || ""} onChange={(e) => setRowEdits((p) => ({ ...p, [s.id]: { ...(p[s.id] || {}), city: e.target.value } }))} />
                    </TableCell>
                    <TableCell>
                      <Input value={(edits.phone ?? s.phone) || ""} onChange={(e) => setRowEdits((p) => ({ ...p, [s.id]: { ...(p[s.id] || {}), phone: e.target.value } }))} />
                    </TableCell>
                    <TableCell>
                      <Input value={(edits.address ?? s.address) || ""} onChange={(e) => setRowEdits((p) => ({ ...p, [s.id]: { ...(p[s.id] || {}), address: e.target.value } }))} />
                    </TableCell>
                    <TableCell>
                      <Input value={(edits.status ?? s.status) || ""} onChange={(e) => setRowEdits((p) => ({ ...p, [s.id]: { ...(p[s.id] || {}), status: e.target.value } }))} />
                    </TableCell>
                    <TableCell>
                      {s.gbp_url ? (
                        <a className="underline" href={s.gbp_url} target="_blank" rel="noopener noreferrer">View</a>
                      ) : (typeof (s as any).lat === 'number' && typeof (s as any).lng === 'number') ? (
                        <a className="underline" href={`https://www.google.com/maps/search/?api=1&query=${(s as any).lat},${(s as any).lng}`} target="_blank" rel="noopener noreferrer">Open</a>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" className="border-orange-700 text-orange-400" onClick={() => saveRow(s)}>Save</Button>
                      <Button variant="destructive" onClick={() => remove(s.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
