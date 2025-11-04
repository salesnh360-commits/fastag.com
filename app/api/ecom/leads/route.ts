import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "nodejs"

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ecom_leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NULL,
      phone VARCHAR(64) NULL,
      email VARCHAR(255) NULL,
      message TEXT NULL,
      source VARCHAR(64) NULL,
      utm_source VARCHAR(128) NULL,
      utm_medium VARCHAR(128) NULL,
      utm_campaign VARCHAR(128) NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  // Add missing columns defensively if the table existed before
  const alters = [
    "ALTER TABLE ecom_leads ADD COLUMN name VARCHAR(255) NULL",
    "ALTER TABLE ecom_leads ADD COLUMN phone VARCHAR(64) NULL",
    "ALTER TABLE ecom_leads ADD COLUMN email VARCHAR(255) NULL",
    "ALTER TABLE ecom_leads ADD COLUMN message TEXT NULL",
    "ALTER TABLE ecom_leads ADD COLUMN source VARCHAR(64) NULL",
    "ALTER TABLE ecom_leads ADD COLUMN utm_source VARCHAR(128) NULL",
    "ALTER TABLE ecom_leads ADD COLUMN utm_medium VARCHAR(128) NULL",
    "ALTER TABLE ecom_leads ADD COLUMN utm_campaign VARCHAR(128) NULL",
    "ALTER TABLE ecom_leads ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
  ]
  for (const sql of alters) { try { await db.query(sql) } catch {} }
}

export async function GET() {
  try {
    await ensureTable()
    const [rows] = await db.query("SELECT * FROM ecom_leads ORDER BY created_at DESC, id DESC LIMIT 500")
    return NextResponse.json(rows)
  } catch (e) {
    console.error("ecom/leads GET error", e)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

function parseCreatedAt(v: any): string | null {
  if (!v) return null
  try {
    const d = new Date(String(v))
    if (isNaN(d.getTime())) return null
    const pad = (n: number) => String(n).padStart(2, "0")
    const yyyy = d.getFullYear()
    const mm = pad(d.getMonth() + 1)
    const dd = pad(d.getDate())
    const hh = pad(d.getHours())
    const mi = pad(d.getMinutes())
    const ss = pad(d.getSeconds())
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
  } catch { return null }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      phone,
      email,
      message,
      source,
      utm_source,
      utm_medium,
      utm_campaign,
      created_at,
    } = body || {}

    await ensureTable()

    const createdAt = parseCreatedAt(created_at)

    const [result] = await db.query(
      `INSERT INTO ecom_leads (name, phone, email, message, source, utm_source, utm_medium, utm_campaign, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ${createdAt ? "?" : "CURRENT_TIMESTAMP"})`,
      [name ?? null, phone ?? null, email ?? null, message ?? null, source ?? null, utm_source ?? null, utm_medium ?? null, utm_campaign ?? null].concat(createdAt ? [createdAt] : [])
    )
    // @ts-ignore
    const id = result.insertId as number
    return NextResponse.json({ success: true, id })
  } catch (e: any) {
    console.error("ecom/leads POST error", e)
    return NextResponse.json({ error: e?.message || "Failed to save lead" }, { status: 500 })
  }
}

