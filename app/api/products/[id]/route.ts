import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params
    const id = Number.parseInt(idStr)
    if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 })
    const [rows]: any = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id])
    if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 })
  }
}
