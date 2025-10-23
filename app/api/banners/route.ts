import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/api-auth"

export const runtime = "nodejs"

async function ensure() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NULL,
      subtitle VARCHAR(512) NULL,
      image_url VARCHAR(1024) NOT NULL,
      link VARCHAR(1024) NULL,
      sort_order INT DEFAULT 0,
      active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

export async function GET() {
  await ensure()
  const [rows] = await db.query("SELECT * FROM banners ORDER BY active DESC, sort_order ASC, id DESC")
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await ensure()
  const body = await req.json()
  const { title, subtitle, image_url, link, sort_order = 0, active = 1 } = body || {}
  if (!image_url) return NextResponse.json({ error: "image_url required" }, { status: 400 })
  const [res]: any = await db.query(
    "INSERT INTO banners (title, subtitle, image_url, link, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)",
    [title || null, subtitle || null, image_url, link || null, sort_order, active ? 1 : 0]
  )
  return NextResponse.json({ success: true, id: res.insertId })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await ensure()
  const body = await req.json()
  const { id, title, subtitle, image_url, link, sort_order, active } = body || {}
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const fields: string[] = []
  const values: any[] = []
  if (typeof title !== "undefined") { fields.push("title=?"); values.push(title || null) }
  if (typeof subtitle !== "undefined") { fields.push("subtitle=?"); values.push(subtitle || null) }
  if (typeof image_url !== "undefined") { fields.push("image_url=?"); values.push(image_url) }
  if (typeof link !== "undefined") { fields.push("link=?"); values.push(link || null) }
  if (typeof sort_order !== "undefined") { fields.push("sort_order=?"); values.push(Number(sort_order) || 0) }
  if (typeof active !== "undefined") { fields.push("active=?"); values.push(active ? 1 : 0) }
  if (!fields.length) return NextResponse.json({ success: true })
  await db.query(`UPDATE banners SET ${fields.join(", ")} WHERE id=?`, [...values, id])
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await ensure()
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  await db.query("DELETE FROM banners WHERE id=?", [id])
  return NextResponse.json({ success: true })
}
