import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "nodejs"

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ecom_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      external_order_id VARCHAR(64) NULL,
      customer_name VARCHAR(255) NULL,
      phone VARCHAR(64) NULL,
      email VARCHAR(255) NULL,
      items_summary TEXT NULL,
      amount DECIMAL(12,2) NULL,
      currency VARCHAR(8) NULL,
      payment_status VARCHAR(32) NULL,
      payment_provider VARCHAR(64) NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      KEY idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  const alters = [
    "ALTER TABLE ecom_orders ADD COLUMN external_order_id VARCHAR(64) NULL",
    "ALTER TABLE ecom_orders ADD COLUMN customer_name VARCHAR(255) NULL",
    "ALTER TABLE ecom_orders ADD COLUMN phone VARCHAR(64) NULL",
    "ALTER TABLE ecom_orders ADD COLUMN email VARCHAR(255) NULL",
    "ALTER TABLE ecom_orders ADD COLUMN items_summary TEXT NULL",
    "ALTER TABLE ecom_orders ADD COLUMN amount DECIMAL(12,2) NULL",
    "ALTER TABLE ecom_orders ADD COLUMN currency VARCHAR(8) NULL",
    "ALTER TABLE ecom_orders ADD COLUMN payment_status VARCHAR(32) NULL",
    "ALTER TABLE ecom_orders ADD COLUMN payment_provider VARCHAR(64) NULL",
    "ALTER TABLE ecom_orders ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE ecom_orders ADD KEY idx_created_at (created_at)",
  ]
  for (const sql of alters) { try { await db.query(sql) } catch {} }
}

export async function GET() {
  try {
    await ensureTable()
    const [rows] = await db.query("SELECT * FROM ecom_orders ORDER BY created_at DESC, id DESC LIMIT 500")
    return NextResponse.json(rows)
  } catch (e) {
    console.error("ecom/orders GET error", e)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
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
      external_order_id,
      customer_name,
      phone,
      email,
      items_summary,
      amount,
      currency,
      payment_status,
      payment_provider,
      created_at,
    } = body || {}

    await ensureTable()
    const createdAt = parseCreatedAt(created_at)

    const [result] = await db.query(
      `INSERT INTO ecom_orders (external_order_id, customer_name, phone, email, items_summary, amount, currency, payment_status, payment_provider, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ${createdAt ? "?" : "CURRENT_TIMESTAMP"})`,
      [
        external_order_id ?? null,
        customer_name ?? null,
        phone ?? null,
        email ?? null,
        items_summary ?? null,
        typeof amount === 'number' ? amount : (amount ? Number(amount) : null),
        currency ?? null,
        payment_status ?? null,
        payment_provider ?? null,
      ].concat(createdAt ? [createdAt] : [])
    )
    // @ts-ignore
    const id = result.insertId as number
    return NextResponse.json({ success: true, id })
  } catch (e: any) {
    console.error("ecom/orders POST error", e)
    return NextResponse.json({ error: e?.message || "Failed to save order" }, { status: 500 })
  }
}

