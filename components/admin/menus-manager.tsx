"use client"
import { Fragment, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type MenuItem = { label: string; href: string; sort_order?: number; target?: string | null; active?: boolean; children?: MenuItem[] }

export default function MenusManager() {
  const [slug, setSlug] = useState("main")
  const [menuName, setMenuName] = useState("")
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newItem, setNewItem] = useState<MenuItem>({ label: "", href: "" })

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  }, [items])

  const load = async (s = slug) => {
    setLoading(true)
    try {
      const r = await fetch(`/api/menus?slug=${encodeURIComponent(s)}`, { cache: "no-store" })
      const j = await r.json()
      setMenuName(j?.menu?.name || "")
      const flat: any[] = Array.isArray(j?.items) ? j.items : []
      // Build tree from id/parent_id
      const byId: Record<number, any> = {}
      flat.forEach((x) => (byId[x.id] = { label: x.label, href: x.href, target: x.target, sort_order: x.sort_order, active: !!x.active, children: [] as MenuItem[] }))
      const roots: MenuItem[] = []
      flat.forEach((x) => {
        const node = byId[x.id]
        if (x.parent_id) {
          byId[x.parent_id]?.children?.push(node)
        } else {
          roots.push(node)
        }
      })
      // Ensure child order
      const sortTree = (arr: MenuItem[]) => {
        arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        arr.forEach((n) => n.children && sortTree(n.children))
      }
      sortTree(roots)
      setItems(roots)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const addItem = () => {
    if (!newItem.label || !newItem.href) return
    const next: MenuItem = { ...newItem, sort_order: (items[items.length - 1]?.sort_order ?? items.length) + 1, active: true }
    setItems([...items, next])
    setNewItem({ label: "", href: "" })
  }

  const remove = (idx: number) => {
    const next = [...items]
    next.splice(idx, 1)
    setItems(next)
  }

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...sorted]
    const ni = idx + dir
    if (ni < 0 || ni >= next.length) return
    const tmp = next[idx]
    next[idx] = next[ni]
    next[ni] = tmp
    // reassign order
    setItems(next.map((x, i) => ({ ...x, sort_order: i })))
  }

  const addSub = (parentIdx: number, child: MenuItem) => {
    const next = [...items]
    const parent = next[parentIdx]
    if (!parent.children) parent.children = []
    parent.children.push({ ...child, active: true, sort_order: parent.children.length })
    setItems(next)
  }

  const removeSub = (parentIdx: number, childIdx: number) => {
    const next = [...items]
    next[parentIdx].children = (next[parentIdx].children || []).filter((_, i) => i !== childIdx)
    setItems(next)
  }

  // Reorder a submenu (2nd level)
  const moveSub = (parentIdx: number, childIdx: number, dir: -1 | 1) => {
    const next = [...items]
    const list = next[parentIdx].children || []
    const ni = childIdx + dir
    if (ni < 0 || ni >= list.length) return
    const tmp = list[childIdx]
    list[childIdx] = list[ni]
    list[ni] = tmp
    next[parentIdx].children = list.map((x, i) => ({ ...x, sort_order: i }))
    setItems(next)
  }

  // Add submenu under a submenu (3rd level)
  const addSubUnderSub = (parentIdx: number, childIdx: number, item: MenuItem) => {
    const next = [...items]
    const parent = next[parentIdx]
    if (!parent.children) parent.children = []
    const sub = parent.children[childIdx]
    if (!sub.children) sub.children = []
    sub.children.push({ ...item, active: true, sort_order: sub.children.length })
    setItems(next)
  }

  const removeSubUnderSub = (parentIdx: number, childIdx: number, grandIdx: number) => {
    const next = [...items]
    const parent = next[parentIdx]
    const sub = (parent.children || [])[childIdx]
    if (!sub) return
    sub.children = (sub.children || []).filter((_, i) => i !== grandIdx)
    setItems(next)
  }
  // Reorder third-level items within their parent
  const moveSubUnderSub = (parentIdx: number, childIdx: number, grandIdx: number, dir: -1 | 1) => {
    const next = [...items]
    const parent = next[parentIdx]
    const sub = (parent.children || [])[childIdx]
    if (!sub) return
    const list = sub.children || []
    const ni = grandIdx + dir
    if (ni < 0 || ni >= list.length) return
    const tmp = list[grandIdx]
    list[grandIdx] = list[ni]
    list[ni] = tmp
    sub.children = list.map((x, i) => ({ ...x, sort_order: i }))
    setItems(next)
  }

  const save = async () => {
    setSaving(true)
    try {
      // If user filled the new item fields but didn't click Add, include it
      const pending = newItem.label && newItem.href ? [{ ...newItem, active: true }] : []
      const all = [...sorted, ...pending]
      const payload = { slug, name: menuName, items: all.map((x, i) => ({ ...x, sort_order: i })) }
      const r = await fetch("/api/menus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || "failed")
      if (pending.length) setNewItem({ label: "", href: "" })
      await load(slug)
    } catch (e) { alert(String(e)) } finally { setSaving(false) }
  }

  const handleNewItemKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem()
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-orange-900 p-4 bg-neutral-900">
        <h3 className="text-white font-semibold mb-3">Menu Settings</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-300 min-w-16">Slug</span>
            <Input value={slug} onChange={(e) => setSlug(e.target.value.trim())} onBlur={() => load(slug)} />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <span className="text-gray-300 min-w-16">Name</span>
            <Input value={menuName} onChange={(e) => setMenuName(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-orange-900 p-4 bg-neutral-900">
        <h3 className="text-white font-semibold mb-3">Add Item</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <Input placeholder="Label" value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} onKeyDown={handleNewItemKey} />
          <Input placeholder="Href (e.g., /, /#buy)" value={newItem.href} onChange={(e) => setNewItem({ ...newItem, href: e.target.value })} onKeyDown={handleNewItemKey} />
          <div className="flex gap-2">
            <Input placeholder="Target (_blank)" value={newItem.target || ""} onChange={(e) => setNewItem({ ...newItem, target: e.target.value || null })} onKeyDown={handleNewItemKey} />
            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={addItem}>Add</Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-orange-900/60">
        <Table className="text-gray-200">
          <TableHeader>
            <TableRow className="bg-black/40">
              <TableHead className="text-gray-400">#</TableHead>
              <TableHead className="text-gray-400">Label</TableHead>
              <TableHead className="text-gray-400">Href</TableHead>
              <TableHead className="text-gray-400">Target</TableHead>
              <TableHead className="text-gray-400">Active</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-gray-400">Loading…</TableCell></TableRow>
            ) : sorted.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-gray-400">No items.</TableCell></TableRow>
            ) : (
              sorted.map((it, idx) => (
                <Fragment key={`item-${idx}`}>
                  <TableRow key={`row-${idx}`}>
                    <TableCell className="text-gray-300">{idx + 1}</TableCell>
                    <TableCell className="text-gray-300">
                      <Input defaultValue={it.label} onBlur={(e) => setItems(prev => prev.map((p, i) => i === idx ? { ...p, label: e.target.value } : p))} />
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <Input defaultValue={it.href} onBlur={(e) => setItems(prev => prev.map((p, i) => i === idx ? { ...p, href: e.target.value } : p))} />
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <Input defaultValue={it.target || ""} onBlur={(e) => setItems(prev => prev.map((p, i) => i === idx ? { ...p, target: e.target.value || null } : p))} />
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <select defaultValue={String(it.active ? 1 : 0)} onChange={(e) => setItems(prev => prev.map((p, i) => i === idx ? { ...p, active: e.target.value === "1" } : p))}
                        className="bg-neutral-800 border border-orange-900 rounded px-2 py-1">
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-gray-300 flex gap-2">
                      <Button variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/30" onClick={() => move(idx, -1)}>Up</Button>
                      <Button variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/30" onClick={() => move(idx, 1)}>Down</Button>
                      <Button variant="outline" className="border-green-700 text-green-400 hover:bg-green-900/30" onClick={() => {
                        const label = prompt("Sub-item label?")?.trim() || ""
                        if (!label) return
                        const href = prompt("Sub-item href? (e.g., /path or /#section)")?.trim() || ""
                        if (!href) return
                        addSub(idx, { label, href })
                      }}>Add Sub</Button>
                      <Button variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30" onClick={() => remove(idx)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                  {(it.children || []).map((ch, cidx) => (
                    <Fragment key={`item-${idx}-child-${cidx}`}>
                      <TableRow key={`row-${idx}-child-${cidx}`}>
                        <TableCell className="text-gray-500 pl-8">{`${idx + 1}.${cidx + 1}`}</TableCell>
                        <TableCell className="text-gray-300">
                          <Input defaultValue={ch.label} onBlur={(e) => setItems(prev => prev.map((p, i) => i === idx ? { ...p, children: (p.children || []).map((cc, ci) => ci === cidx ? { ...cc, label: e.target.value } : cc) } : p))} />
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <Input defaultValue={ch.href} onBlur={(e) => setItems(prev => prev.map((p, i) => i === idx ? { ...p, children: (p.children || []).map((cc, ci) => ci === cidx ? { ...cc, href: e.target.value } : cc) } : p))} />
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <Input defaultValue={ch.target || ""} onBlur={(e) => setItems(prev => prev.map((p, i) => i === idx ? { ...p, children: (p.children || []).map((cc, ci) => ci === cidx ? { ...cc, target: e.target.value || null } : cc) } : p))} />
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <select defaultValue={String(ch.active ? 1 : 0)} onChange={(e) => setItems(prev => prev.map((p, i) => i === idx ? { ...p, children: (p.children || []).map((cc, ci) => ci === cidx ? { ...cc, active: e.target.value === "1" } : cc) } : p))}
                            className="bg-neutral-800 border border-orange-900 rounded px-2 py-1">
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-gray-300 flex gap-2">
                          <Button variant="outline" className="border-green-700 text-green-400 hover:bg-green-900/30" onClick={() => {
                            const label = prompt("Submenu label?")?.trim() || ""
                            if (!label) return
                            const href = prompt("Submenu href? (e.g., /path or /#section)")?.trim() || ""
                            if (!href) return
                            addSubUnderSub(idx, cidx, { label, href })
                          }}>Add Sub</Button>
                          <Button variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/30" onClick={() => moveSub(idx, cidx, -1)}>Up</Button>
                          <Button variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/30" onClick={() => moveSub(idx, cidx, 1)}>Down</Button>
                          <Button variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30" onClick={() => removeSub(idx, cidx)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                      {(ch.children || []).map((g, gidx) => (
                        <TableRow key={`row-${idx}-child-${cidx}-grand-${gidx}`}>
                          <TableCell className="text-gray-500 pl-16">{`${idx + 1}.${cidx + 1}.${gidx + 1}`}</TableCell>
                          <TableCell className="text-gray-300">
                            <Input defaultValue={g.label} onBlur={(e) => setItems(prev => prev.map((p, i) => i === idx ? {
                              ...p,
                              children: (p.children || []).map((cc, ci) => ci === cidx ? {
                                ...cc,
                                children: (cc.children || []).map((gg, gi) => gi === gidx ? { ...gg, label: e.target.value } : gg)
                              } : cc)
                            } : p))} />
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <Input defaultValue={g.href} onBlur={(e) => setItems(prev => prev.map((p, i) => i === idx ? {
                              ...p,
                              children: (p.children || []).map((cc, ci) => ci === cidx ? {
                                ...cc,
                                children: (cc.children || []).map((gg, gi) => gi === gidx ? { ...gg, href: e.target.value } : gg)
                              } : cc)
                            } : p))} />
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <Input defaultValue={g.target || ""} onBlur={(e) => setItems(prev => prev.map((p, i) => i === idx ? {
                              ...p,
                              children: (p.children || []).map((cc, ci) => ci === cidx ? {
                                ...cc,
                                children: (cc.children || []).map((gg, gi) => gi === gidx ? { ...gg, target: e.target.value || null } : gg)
                              } : cc)
                            } : p))} />
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <select defaultValue={String(g.active ? 1 : 0)} onChange={(e) => setItems(prev => prev.map((p, i) => i === idx ? {
                              ...p,
                              children: (p.children || []).map((cc, ci) => ci === cidx ? {
                                ...cc,
                                children: (cc.children || []).map((gg, gi) => gi === gidx ? { ...gg, active: e.target.value === "1" } : gg)
                              } : cc)
                            } : p))} className="bg-neutral-800 border border-orange-900 rounded px-2 py-1">
                              <option value="1">Yes</option>
                              <option value="0">No</option>
                            </select>
                          </TableCell>
                          <TableCell className="text-gray-300 flex gap-2">
                            <Button variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/30" onClick={() => moveSubUnderSub(idx, cidx, gidx, -1)}>Up</Button>
                            <Button variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/30" onClick={() => moveSubUnderSub(idx, cidx, gidx, 1)}>Down</Button>
                            <Button variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30" onClick={() => removeSubUnderSub(idx, cidx, gidx)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button className="bg-orange-600 hover:bg-orange-700 text-white" disabled={saving} onClick={save}>Save Menu</Button>
      </div>
    </div>
  )
}
