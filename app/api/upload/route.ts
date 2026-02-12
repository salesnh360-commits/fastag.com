import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { db } from '@/lib/db'

export const config = { api: { bodyParser: false } }
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const productId = (formData.get('productId') as string | null) || null
  const productName = (formData.get('productName') as string | null) || null
  const type = formData.get('type') as 'image' | 'video' | null

  if ((!productId && !productName) && !type) {
    return NextResponse.json({ error: 'Missing productId/productName or type' }, { status: 400 })
  }

  const files = formData.getAll('files') as File[]
  if (!files.length) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
  }

  // Resolve and sanitize folder name
  let folderName = `Product-${productId || productName || 'Unnamed'}`
  if (productName && productName.trim()) {
    folderName = productName.trim()
  } else if (productId) {
    try {
      const [rows] = await db.query('SELECT name FROM products WHERE id = ? LIMIT 1', [productId])
      const arr = rows as Array<{ name?: string }>
      if (arr?.[0]?.name) folderName = String(arr[0].name)
    } catch { }
  }
  folderName = String(folderName).replace(/[\\/:*?"<>|]/g, '-').trim() || 'Product'

  const urls: string[] = []

  try {
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      // Upload to Cloudinary
      const result = await uploadToCloudinary({
        buffer,
        filename,
        folder: `products/${folderName}`,
      })

      // Use secure URL (HTTPS)
      urls.push(result.secureUrl)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
