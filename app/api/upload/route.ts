import { NextRequest, NextResponse } from 'next/server'
import { uploadBufferToDrive, ensureFolder } from '@/lib/googleDrive'
import { db } from '@/lib/db'

export const config = { api: { bodyParser: false } }
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const productId = (formData.get('productId') as string | null) || null
  const productName = (formData.get('productName') as string | null) || null
  const type = formData.get('type') as 'image' | 'video' | null

  if ((!productId && !productName) || !type) {
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
    } catch {}
  }
  folderName = String(folderName).replace(/[\\/:*?"<>|]/g, '-').trim() || 'Product'

  // Ensure nested folders: Ecomerece / Products / <Product Name>
  const ecomRootId = await ensureFolder('Ecomerece')
  const productsFolderId = await ensureFolder('Products', ecomRootId)
  await ensureFolder(folderName, productsFolderId)

  const urls: string[] = []
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { url } = await uploadBufferToDrive({
      buffer,
      filename,
      mimeType: (file as any).type || undefined,
      folderName,
      parentId: productsFolderId,
    })
    urls.push(url)
  }

  return NextResponse.json({ urls })
}

