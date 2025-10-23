import { NextRequest, NextResponse } from 'next/server';
import { uploadBufferToDrive, ensureFolder } from '@/lib/googleDrive';
import { db } from '@/lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const productId = formData.get('productId') as string;
  const type = formData.get('type') as 'image' | 'video';

  if (!productId || !type) {
    return NextResponse.json({ error: 'Missing productId or type' }, { status: 400 });
  }

  const files = formData.getAll('files') as File[];
  if (!files.length) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }

  // Determine product name for folder
  let folderName = `Product-${productId}`;
  try {
    const [rows] = await db.query("SELECT name FROM products WHERE id = ? LIMIT 1", [productId]);
    const arr = rows as Array<{ name?: string }>
    if (arr?.[0]?.name) {
      // Sanitize folder name (avoid slashes and quotes)
      folderName = String(arr[0].name).replace(/[\\/:*?"<>|]/g, '-').trim() || folderName
    }
  } catch {}

  // Ensure product folder exists and upload to Drive
  await ensureFolder(folderName)

  const urls: string[] = [];
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { url } = await uploadBufferToDrive({
      buffer,
      filename,
      mimeType: (file as any).type || undefined,
      folderName,
    })
    urls.push(url);
  }

  return NextResponse.json({ urls });
} 
