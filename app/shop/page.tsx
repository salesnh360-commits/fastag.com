"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Filter, Award, Leaf, Shield, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ProductModal } from "@/components/product-modal"
import { useCart } from "@/components/cart-context"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get("category")

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  // Load products from database
  useEffect(() => {
    let active = true
    setLoading(true)
    fetch("/api/products", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!active) return
        const products = Array.isArray(data) ? data : []
        setAllProducts(products)
      })
      .catch(() => {
        if (active) setAllProducts([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Set category from URL on component mount
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [categoryFromUrl])

  // Extract unique categories from products
  const categories = [
    { id: "all", name: "All Products", count: allProducts.length },
    ...Array.from(new Set(allProducts.map((p) => p.vehicle_type || p.class_name || "Other")))
      .filter(Boolean)
      .map((cat) => ({
        id: String(cat).toLowerCase().replace(/\s+/g, "-"),
        name: String(cat),
        count: allProducts.filter((p) => (p.vehicle_type || p.class_name) === cat).length,
      })),
  ]

  const priceRanges = [
    { id: "all", name: "All Prices", min: 0, max: Number.POSITIVE_INFINITY },
    { id: "under-500", name: "Under ₹500", min: 0, max: 500 },
    { id: "500-1000", name: "₹500 - ₹1,000", min: 500, max: 1000 },
    { id: "1000-2000", name: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
    { id: "above-2000", name: "Above ₹2,000", min: 2000, max: Number.POSITIVE_INFINITY },
  ]

  const certifications = [
    { name: "Secure Payment", icon: <Shield className="h-5 w-5" /> },
    { name: "Fast Delivery", icon: <Award className="h-5 w-5" /> },
    { name: "Quality Assured", icon: <Leaf className="h-5 w-5" /> },
  ]

  // Filter products based on selected category and price range
  const filteredProducts = allProducts.filter((product) => {
    const productCategory = (product.vehicle_type || product.class_name || "Other").toLowerCase().replace(/\s+/g, "-")
    const categoryMatch = selectedCategory === "all" || productCategory === selectedCategory
    const selectedPriceRange = priceRanges.find((range) => range.id === priceRange)
    const productPrice = Number(product.price) || 0
    const priceMatch = selectedPriceRange
      ? productPrice >= selectedPriceRange.min && productPrice <= selectedPriceRange.max
      : true
    return categoryMatch && priceMatch && product.in_stock
  })

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  const normalizeDrive = (url?: string) => {
    if (!url) return "/placeholder.svg"
    try {
      // Handle direct Google Drive links
      const u = new URL(url)
      if (u.host.includes("drive.google.com") || u.host.includes("drive.usercontent.google.com")) {
        // Extract file ID from various Google Drive URL formats
        const fileIdMatch = u.pathname.match(/\/file\/d\/([^/]+)/) ||
          u.pathname.match(/\/d\/([^/]+)/) ||
          u.searchParams.get("id")
        const fid = Array.isArray(fileIdMatch) ? fileIdMatch[1] : fileIdMatch
        if (fid) {
          // Use direct Google Drive thumbnail/preview URL
          return `https://drive.google.com/thumbnail?id=${fid}&sz=w1000`
        }
      }
      return url
    } catch {
      return url || "/placeholder.svg"
    }
  }

  const addToCart = (product: any) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.original_price || product.price,
        image: product.image_url,
        size: product.vehicle_type || product.class_name,
      },
    })
    dispatch({ type: "OPEN_CART" })
  }

  const openProductModal = (product: any) => {
    const productWithDetails = {
      ...product,
      description: product.description || `${product.name} - Premium FASTag product`,
      features: [
        product.class_name || "Standard Class",
        product.vehicle_type || "Universal",
        "Fast Activation",
        "Secure Payment",
      ],
      specifications: {
        material: "Premium quality FASTag",
        class: product.class_name || "Standard",
        vehicle: product.vehicle_type || "All vehicles",
        validity: "As per NHAI guidelines",
      },
      rating: 4.5,
      reviews: 100,
      warranty: "1 Year",
    }
    setSelectedProduct(productWithDetails)
    setIsProductModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Shop Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Shop</h1>
            <p className="text-xl text-gray-600">
              Browse our complete range of FASTag products and services
            </p>

            {/* Certifications */}
            <div className="flex justify-center items-center space-x-8 mt-8">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2 text-orange-600">
                  {cert.icon}
                  <span className="text-sm font-medium">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Info */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Instant Activation</h3>
              <p className="text-gray-600">Get your FASTag activated quickly and easily</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">All Vehicle Types</h3>
              <p className="text-gray-600">FASTag available for all vehicle categories</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-gray-600">Safe and secure online payment options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Filters */}
      <section className="py-8 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={category.id === selectedCategory ? "default" : "outline"}
                  className={
                    category.id === selectedCategory
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "border-orange-600 text-orange-600 hover:bg-orange-50"
                  }
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              className="border-orange-600 text-orange-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Price Range</h4>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range) => (
                      <Button
                        key={range.id}
                        variant={range.id === priceRange ? "default" : "outline"}
                        size="sm"
                        className={
                          range.id === priceRange
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "border-orange-600 text-orange-600 hover:bg-orange-50"
                        }
                        onClick={() => setPriceRange(range.id)}
                      >
                        {range.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? (
                "Loading products..."
              ) : (
                <>
                  Showing {filteredProducts.length} of {allProducts.length} products
                  {selectedCategory !== "all" && ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
                  {priceRange !== "all" && ` • ${priceRanges.find((p) => p.id === priceRange)?.name}`}
                </>
              )}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading products...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-0">
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                        <Image
                          src={normalizeDrive(product.image_url)}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                          referrerPolicy="no-referrer"
                        />
                        <Badge className="absolute top-3 left-3 bg-orange-600 text-white text-xs">
                          {product.class_name || "FASTag"}
                        </Badge>
                        {product.in_stock && (
                          <Badge className="absolute top-3 right-3 bg-green-600 text-white text-xs">
                            In Stock
                          </Badge>
                        )}
                      </div>
                    </Link>
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <Link href={`/product/${product.id}`} className="block">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        {product.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 min-h-[2rem]">{product.description}</p>
                        )}
                        <p className="text-xs text-orange-600 font-medium">
                          {product.vehicle_type || product.class_name}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {product.class_name && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {product.class_name}
                          </Badge>
                        )}
                        {product.vehicle_type && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {product.vehicle_type}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < 4 ? "fill-orange-400 text-orange-400" : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">(100+)</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </span>
                        )}
                      </div>

                      <div className="pt-2">
                        <div className="flex space-x-2">
                          <Button
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-10 text-sm font-medium"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              addToCart(product)
                            }}
                          >
                            Add to Cart
                          </Button>
                          <Link href={`/product/${product.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-3 border-orange-600 text-orange-600 hover:bg-orange-50"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4 border-orange-600 text-orange-600"
                onClick={() => {
                  setSelectedCategory("all")
                  setPriceRange("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />

      {/* Product Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Products?</h2>
            <p className="text-gray-600">Premium quality FASTag services</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Leaf className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Instant Activation</h3>
              <p className="text-sm text-gray-600">Quick and easy FASTag activation</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Secure</h3>
              <p className="text-sm text-gray-600">Safe and secure transactions</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Certified</h3>
              <p className="text-sm text-gray-600">NHAI approved FASTag</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">24/7 Support</h3>
              <p className="text-sm text-gray-600">Round the clock customer service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
