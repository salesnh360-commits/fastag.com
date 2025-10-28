import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "nodejs"

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // Try to ensure newer columns exist; ignore if they already exist
    try { await db.query("ALTER TABLE blogs ADD COLUMN image_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE blogs ADD COLUMN doc_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE blogs ADD COLUMN youtube_url VARCHAR(512) NULL") } catch {}
    try { await db.query("ALTER TABLE blogs ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP") } catch {}
    try { await db.query("ALTER TABLE blogs ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") } catch {}

    try {
      const [rows] = await db.query(
        "SELECT slug, title, excerpt, content, author, image_url, doc_url, youtube_url, created_at, updated_at FROM blogs WHERE slug = ? LIMIT 1",
        [slug]
      )
      const list = rows as any[]
      if (!list || list.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json(list[0])
    } catch {
      // Fallback to a minimal selection if legacy schema doesn't have all columns
      const [rows] = await db.query(
        "SELECT slug, title, excerpt, content, author, NULL AS image_url, NULL AS doc_url, NULL AS youtube_url, NULL AS created_at, NULL AS updated_at FROM blogs WHERE slug = ? LIMIT 1",
        [slug]
      )
      const list = rows as any[]
      if (!list || list.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json(list[0])
    }
  } catch (e: any) {
    console.error("blog get error", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const [result] = await db.query("DELETE FROM blogs WHERE slug = ?", [slug])
    // @ts-ignore
    const affected = result?.affectedRows ?? 0
    if (affected === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("blog delete error", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: currentSlug } = await params
    const body = await req.json()
    const { title, excerpt, content, author, image_url, doc_url, youtube_url } = body || {}

    // Ensure table exists and has columns (best-effort)
    try { await db.query("ALTER TABLE blogs ADD COLUMN image_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE blogs ADD COLUMN doc_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE blogs ADD COLUMN youtube_url VARCHAR(512) NULL") } catch {}
    try { await db.query("ALTER TABLE blogs ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP") } catch {}
    try { await db.query("ALTER TABLE blogs ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") } catch {}

    const fields: string[] = []
    const values: any[] = []
    if (typeof title === "string") { fields.push("title = ?"); values.push(title) }
    if (typeof excerpt === "string") { fields.push("excerpt = ?"); values.push(excerpt) }
    if (typeof content === "string") { fields.push("content = ?"); values.push(content) }
    if (typeof author === "string") { fields.push("author = ?"); values.push(author) }
    if (typeof image_url !== "undefined") { fields.push("image_url = ?"); values.push(image_url || null) }
    if (typeof doc_url !== "undefined") { fields.push("doc_url = ?"); values.push(doc_url || null) }
    if (typeof youtube_url !== "undefined") { fields.push("youtube_url = ?"); values.push(youtube_url || null) }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const sql = `UPDATE blogs SET ${fields.join(", ")} WHERE slug = ? LIMIT 1`
    values.push(currentSlug)
    const [result] = await db.query(sql, values)
    // @ts-ignore
    const affected = result?.affectedRows ?? 0
    if (affected === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, slug: currentSlug })
  } catch (e: any) {
    console.error("blog update error", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
