import { NextRequest, NextResponse } from "next/server"
import { uploadBufferToDrive, ensureFolder } from "@/lib/googleDrive"
import { isAdmin } from "@/lib/api-auth"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })

    const buf = Buffer.from(await file.arrayBuffer())
    const ext = (file.name.split(".").pop() || "bin").toLowerCase()
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Ensure 'Banner' folder exists and upload
    const folderName = "Banner"
    await ensureFolder(folderName)
    const { url } = await uploadBufferToDrive({
      buffer: buf,
      filename: name,
      mimeType: file.type || undefined,
      folderName,
    })
    return NextResponse.json({ url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "upload failed" }, { status: 500 })
  }
}
