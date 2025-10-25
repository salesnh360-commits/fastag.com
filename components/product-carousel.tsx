"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useCart } from "./cart-context"
import { FastagLeadModal } from "./fastag-lead-modal"
import { ProductModal } from "./product-modal"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: string
  originalPrice: string
  image: string
  description: string
  rating: number
  reviews: number
  category: string
  features?: string[]
}

interface ProductCarouselProps {
  products: Product[]
  title: string
  subtitle?: string
  disableLinks?: boolean
  leadMode?: boolean
  dark?: boolean
  showDots?: boolean
}

export function ProductCarousel({ products, title, subtitle, disableLinks = false, leadMode = false, dark = false, showDots = false }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const { dispatch } = useCart()
  const [leadOpen, setLeadOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 768) {
        setItemsPerView(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, products.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [maxIndex])

  const formatPrice = (price: string) => {
    return Number.parseInt(price.replace(/[₹,]/g, ""))
  }

  const addToCart = (product: Product) => {
    if (leadMode) {
      setSelectedProduct(product)
      setLeadOpen(true)
      return
    }
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        originalPrice: formatPrice(product.originalPrice),
        image: product.image,
      },
    })
    dispatch({ type: "OPEN_CART" })
  }

  // Normalize common external URLs (especially Google Drive share links)
  const normalizeImageUrl = (url?: string) => {
    if (!url) return "/placeholder.svg"
    try {
      const cleaned = url.trim()
      const u = new URL(cleaned)
      const host = u.host
      const path = u.pathname
      // Formats we convert:
      // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing -> uc?export=view&id=FILE_ID
      // - https://drive.google.com/open?id=FILE_ID -> uc?export=view&id=FILE_ID
      if (host.includes("drive.google.com") || host.includes("drive.usercontent.google.com")) {
        let id = ""
        const m = path.match(/\/file\/d\/([^/]+)/)
        if (m && m[1]) id = m[1]
        if (!id) id = u.searchParams.get("id") || ""
        if (id) {
          // Prefer googleusercontent (more reliable as an image origin)
          return `https://lh3.googleusercontent.com/d/${id}=s1200`
        }
      }
      // lh3.googleusercontent direct link is fine; keep as-is
      return url
    } catch {
      return url
    }
  }

  const openProductModal = (product: Product) => {
    const productWithDetails = {
      ...product,
      price: formatPrice(product.price),
      originalPrice: formatPrice(product.originalPrice),
      specifications: {
        material: "Premium materials with quality construction",
        thickness: "Optimal thickness for comfort",
        firmness: "Medium-firm support",
        care: "Easy maintenance and care",
      },
    }
    setSelectedProduct(productWithDetails)
    setIsProductModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className={`text-3xl lg:text-4xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>{title}</h2>
        {subtitle && <p className={`text-xl ${dark ? "text-gray-400" : "text-gray-600"}`}>{subtitle}</p>}
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
                <Card className="group hover:shadow-xl transition-all duration-300 border border-orange-200 bg-white text-gray-900 h-full">
                  <CardContent className="p-0 h-full flex flex-col">
                    {disableLinks ? (
                      <div
                        className="relative overflow-hidden rounded-t-lg cursor-pointer"
                        onClick={() => openProductModal(product)}
                      >
                        <Image
                          src={normalizeImageUrl(product.image)}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                          referrerPolicy="no-referrer"
                        />
                        <Badge className="absolute top-4 left-4 bg-orange-600 text-white">Popular</Badge>
                      </div>
                    ) : (
                      <Link href={`/product/${product.id}`}>
                        <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                          <Image
                            src={normalizeImageUrl(product.image)}
                            alt={product.name}
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                            referrerPolicy="no-referrer"
                          />
                          <Badge className="absolute top-4 left-4 bg-orange-600 text-white">Bestseller</Badge>
                        </div>
                      </Link>
                    )}

                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <div className="space-y-2 flex-1">
                        {disableLinks ? (
                          <h3
                            className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] cursor-pointer hover:text-orange-600 transition-colors"
                            onClick={() => openProductModal(product)}
                          >
                            {product.name}
                          </h3>
                        ) : (
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] cursor-pointer hover:text-orange-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                        )}
                        <p className="text-sm text-gray-600 min-h-[2.5rem] line-clamp-2">{product.description}</p>
                      </div>

                      {product.features && (
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-orange-50 text-orange-700">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating) ? "fill-orange-400 text-orange-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>

                      <div className="flex items-center space-x-2 min-h-[2rem]">
                        <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                        <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                      </div>

                      <div className="pt-2">
                        <div className="flex space-x-2">
                          <Button
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-medium"
                            onClick={() => addToCart(product)}
                          >
                            {leadMode ? "Enquire" : "Add to Cart"}
                          </Button>
                          {disableLinks ? (
                          <Button
                            variant="outline"
                            className="px-3 border-orange-600 text-orange-600 hover:bg-orange-50"
                            onClick={() => openProductModal(product)}
                          >
                            Buy Now
                          </Button>
                        ) : (
                          <Link href={`/product/${product.id}`}>
                            <Button
                              variant="outline"
                              className="px-3 border-orange-600 text-orange-600 hover:bg-orange-50"
                            >
                              Buy Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg border-orange-200 hover:bg-orange-50"
          onClick={prevSlide}
          disabled={products.length <= itemsPerView}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg border-orange-200 hover:bg-orange-50"
          onClick={nextSlide}
          disabled={products.length <= itemsPerView}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Dots Indicator */}
        {showDots && products.length > itemsPerView && (
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-orange-600"
                    : dark
                    ? "bg-white/30 hover:bg-white/40"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selectedProduct} isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} />
      <FastagLeadModal open={leadOpen} onClose={() => setLeadOpen(false)} product={selectedProduct} />
    </div>
  )
}
