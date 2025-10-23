import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/api-auth"

export const runtime = "nodejs"

async function ensureTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS menus (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(64) UNIQUE NOT NULL,
      name VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  await db.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      menu_id INT NOT NULL,
      label VARCHAR(255) NOT NULL,
      href VARCHAR(1024) NOT NULL,
      target VARCHAR(32) NULL,
      sort_order INT DEFAULT 0,
      parent_id INT NULL,
      active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_menu_items_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

export async function GET(req: NextRequest) {
  await ensureTables()
  const { searchParams } = new URL(req.url)
  const slug = (searchParams.get("slug") || "").trim()
  if (!slug) {
    const [rows]: any = await db.query("SELECT id, slug, name FROM menus ORDER BY slug ASC")
    return NextResponse.json(rows)
  }
  const [menus]: any = await db.query("SELECT id, slug, name FROM menus WHERE slug=?", [slug])
  const menu = menus[0]
  if (!menu) {
    return NextResponse.json({ menu: { slug, name: null }, items: [] })
  }
  const [items]: any = await db.query(
    "SELECT id, label, href, target, sort_order, parent_id, active FROM menu_items WHERE menu_id=? ORDER BY sort_order ASC, id ASC",
    [menu.id]
  )
  return NextResponse.json({ menu, items })
}

// Upsert menu and replace items (simple bulk save)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await ensureTables()
  const body = await req.json()
  const slug = String(body?.slug || "").trim().toLowerCase() || "main"
  const name = (body?.name ? String(body.name) : null) as string | null
  const items = Array.isArray(body?.items) ? (body.items as any[]) : []

  const [existing]: any = await db.query("SELECT id FROM menus WHERE slug=?", [slug])
  let menuId: number
  if (existing.length) {
    menuId = existing[0].id
    if (name !== null) await db.query("UPDATE menus SET name=? WHERE id=?", [name, menuId])
  } else {
    const [res]: any = await db.query("INSERT INTO menus (slug, name) VALUES (?, ?)", [slug, name])
    menuId = res.insertId
  }

  // Replace with nested insert to support children
  await db.query("DELETE FROM menu_items WHERE menu_id=?", [menuId])
  let orderCounter = 0
  async function insertItem(it: any, parentId: number | null) {
    const label = String(it?.label || "").trim()
    const href = String(it?.href || "").trim() || "/"
    const target = it?.target ? String(it.target) : null
    const sort = Number(it?.sort_order ?? orderCounter++)
    const active = it?.active ? 1 : 0
    const [res]: any = await db.query(
      "INSERT INTO menu_items (menu_id, label, href, target, sort_order, parent_id, active) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [menuId, label, href, target, sort, parentId, active]
    )
    const newId = res.insertId
    if (Array.isArray(it?.children)) {
      for (let i = 0; i < it.children.length; i++) {
        const child = { ...it.children[i], sort_order: i }
        await insertItem(child, newId)
      }
    }
  }
  for (let i = 0; i < items.length; i++) {
    const it = { ...items[i], sort_order: i }
    await insertItem(it, null)
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await ensureTables()
  const body = await req.json()
  const slug = String(body?.slug || "").trim().toLowerCase()
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })
  await db.query("DELETE FROM menus WHERE slug=?", [slug])
  return NextResponse.json({ success: true })
}
