import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { isAdmin } from "@/lib/api-auth"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })

    const baseDir = path.join(process.cwd(), "public", "uploads", "banners")
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true })

    const buf = Buffer.from(await file.arrayBuffer())
    const ext = (file.name.split(".").pop() || "bin").toLowerCase()
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const out = path.join(baseDir, name)
    fs.writeFileSync(out, buf)
    const url = `/uploads/banners/${name}`
    return NextResponse.json({ url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "upload failed" }, { status: 500 })
  }
}
