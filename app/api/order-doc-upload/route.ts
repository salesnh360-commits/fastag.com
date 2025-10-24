import { NextRequest, NextResponse } from "next/server"
import { ensureFolder, uploadBufferToDrive } from "@/lib/googleDrive"

export const runtime = "nodejs"

const ALLOWED_TYPES = new Set([
  "rc_front",
  "rc_back",
  "aadhar_front",
  "aadhar_back",
  "pan",
])

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

    // Create/ensure nested folders: Ecom website order details/<orderId>/KYC
    const rootId = await ensureFolder("Ecom website order details")
    const orderFolderId = await ensureFolder(orderId, rootId)
    const kycFolderId = await ensureFolder("KYC", orderFolderId)
    const typeToFolder: Record<string, string> = {
      rc_front: "RC Front",
      rc_back: "RC Back",
      aadhar_front: "Aadhaar Front",
      aadhar_back: "Aadhaar Back",
      pan: "PAN",
    }
    const subFolderName = typeToFolder[docType]
    const subFolderId = await ensureFolder(subFolderName, kycFolderId)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = (file.name.split(".").pop() || "bin").toLowerCase()
    const filename = `${Date.now()}-${docType}.${ext}`

    const { url } = await uploadBufferToDrive({
      buffer,
      filename,
      mimeType: (file as any).type || undefined,
      folderName: subFolderName,
      parentId: kycFolderId,
    })

    return NextResponse.json({ url, docType })
  } catch (e: any) {
    console.error("order-doc-upload error", e)
    return NextResponse.json({ error: e.message || "upload failed" }, { status: 500 })
  }
}
