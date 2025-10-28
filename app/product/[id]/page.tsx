import ProductPageClient from "@/components/product-page-client"

// Avoid static path generation issues in dev/Windows by forcing dynamic
export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idNum = Number.parseInt(id)
  return <ProductPageClient id={idNum} />
}
