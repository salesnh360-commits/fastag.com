import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const kind = (formData.get("kind") as string) || "image" // image | doc

    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = (file.name.split(".").pop() || "bin").toLowerCase()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Upload to Cloudinary in blogs folder
    const folder = kind === "doc" ? "blogs/docs" : "blogs/images"
    const result = await uploadToCloudinary({
      buffer,
      filename,
      folder,
    })

    return NextResponse.json({ url: result.secureUrl })
  } catch (e: any) {
    console.error("blog upload error", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
