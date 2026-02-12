import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
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

    // Upload to Cloudinary in 'banners' folder
    const result = await uploadToCloudinary({
      buffer: buf,
      filename: name,
      folder: "banners",
    })

    return NextResponse.json({ url: result.secureUrl })
  } catch (e: any) {
    console.error("Banner upload error:", e)
    return NextResponse.json({ error: e?.message || "upload failed" }, { status: 500 })
  }
}
