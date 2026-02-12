import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"

export const runtime = "nodejs"

const ALLOWED_TYPES = new Set([
  "rc_front",
  "rc_back",
  "aadhar_front",
  "aadhar_back",
  "pan",
])

const DOC_TYPE_LABELS: Record<string, string> = {
  rc_front: "RC-Front",
  rc_back: "RC-Back",
  aadhar_front: "Aadhaar-Front",
  aadhar_back: "Aadhaar-Back",
  pan: "PAN",
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    const orderId = (form.get("orderId") as string | null)?.trim()
    const docType = (form.get("docType") as string | null)?.trim().toLowerCase()

    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })
    if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 })
    if (!docType || !ALLOWED_TYPES.has(docType)) {
      return NextResponse.json({ error: "invalid docType" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = (file.name.split(".").pop() || "bin").toLowerCase()
    const filename = `${Date.now()}-${docType}.${ext}`

    // Upload to Cloudinary with organized folder structure
    // Structure: orders/{orderId}/kyc/{docType}/filename
    const docLabel = DOC_TYPE_LABELS[docType]
    const result = await uploadToCloudinary({
      buffer,
      filename,
      folder: `orders/${orderId}/kyc/${docLabel}`,
    })

    return NextResponse.json({ url: result.secureUrl, docType })
  } catch (e: any) {
    console.error("order-doc-upload error", e)
    return NextResponse.json({ error: e.message || "upload failed" }, { status: 500 })
  }
}
