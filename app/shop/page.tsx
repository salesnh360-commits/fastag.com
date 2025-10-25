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
  const { dispatch } = useCart()

  // Set category from URL on component mount
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [categoryFromUrl])

  const categories = [
    { id: "all", name: "All Products", count: 21 },
    { id: "mattresses", name: "Mattresses", count: 8 },
    { id: "pillows", name: "Pillows", count: 5 },
    { id: "toppers", name: "Toppers", count: 3 },
    { id: "protectors", name: "Protectors", count: 1 },
    { id: "accessories", name: "Accessories", count: 4 },
  ]

  const priceRanges = [
    { id: "all", name: "All Prices", min: 0, max: Number.POSITIVE_INFINITY },
    { id: "under-2000", name: "Under ₹2,000", min: 0, max: 2000 },
    { id: "2000-10000", name: "₹2,000 - ₹10,000", min: 2000, max: 10000 },
    { id: "10000-30000", name: "₹10,000 - ₹30,000", min: 10000, max: 30000 },
    { id: "above-30000", name: "Above ₹30,000", min: 30000, max: Number.POSITIVE_INFINITY },
  ]

  const allProducts = [
    // Natural Latex Mattresses
    {
      id: 1,
      name: "Natural Latex Mattress 78x72x6",
      price: 46000,
      originalPrice: 55000,
      image: "/images/memory-foam-mattress.jpg",
      description: "7-zone comfort latex imported from Thailand with 15-year warranty",
      rating: 4.9,
      reviews: 1247,
      category: "mattresses",
      size: "78x72x6 inches",
      features: ["100% Natural Latex", "7-Zone Support", "Anti-Allergic", "Breathable"],
      warranty: "15 Years",
    },
    {
      id: 2,
      name: "Natural Latex Mattress 78x60x6",
      price: 46000,
      originalPrice: 55000,
      image: "/images/memory-foam-mattress.jpg",
      description: "Premium 6-inch natural latex mattress with superior comfort",
      rating: 4.8,
      reviews: 892,
      category: "mattresses",
      size: "78x60x6 inches",
      features: ["100% Natural Latex", "7-Zone Support", "Anti-Dust Mite"],
      warranty: "15 Years",
    },
    {
      id: 3,
      name: "Natural Latex Mattress 78x48x6",
      price: 43500,
      originalPrice: 52000,
      image: "/images/memory-foam-mattress.jpg",
      description: "Single size natural latex mattress perfect for individual use",
      rating: 4.7,
      reviews: 634,
      category: "mattresses",
      size: "78x48x6 inches",
      features: ["100% Natural Latex", "Eco-Friendly", "Anti-Allergic"],
      warranty: "15 Years",
    },
    {
      id: 4,
      name: "Spring Mattress Premium",
      price: 28500,
      originalPrice: 35000,
      image: "/images/mattress-topper.jpg",
      description: "High-quality spring mattress with comfort layers",
      rating: 4.6,
      reviews: 456,
      category: "mattresses",
      size: "78x72x8 inches",
      features: ["Pocket Springs", "Edge Support", "Breathable"],
      warranty: "10 Years",
    },

    // Pillows
    {
      id: 5,
      name: "Cervical Latex Shredded Pillow",
      price: 1950,
      originalPrice: 2500,
      image: "/images/cervical-pillow.jpg",
      description: "Ergonomic cervical support with shredded latex filling",
      rating: 4.8,
      reviews: 723,
      category: "pillows",
      size: "27.5x15x5 inches",
      features: ["Cervical Support", "Shredded Latex", "Breathable Cover"],
      warranty: "5 Years",
    },
    {
      id: 6,
      name: "Natural Latex Standard Pillows",
      price: 1850,
      originalPrice: 2300,
      image: "/images/luxury-pillows.jpg",
      description: "100% natural latex pillows for optimal head and neck support",
      rating: 4.7,
      reviews: 892,
      category: "pillows",
      size: "25x16.5x3.5 inches",
      features: ["100% Natural Latex", "Anti-Allergic", "Breathable"],
      warranty: "5 Years",
    },
    {
      id: 7,
      name: "Charcoal Pillows",
      price: 1950,
      originalPrice: 2400,
      image: "/images/charcoal-pillow.jpg",
      description: "Activated charcoal infused pillows for odor control",
      rating: 4.6,
      reviews: 543,
      category: "pillows",
      size: "27.5x15x5 inches",
      features: ["Charcoal Infused", "Odor Control", "Anti-Bacterial"],
      warranty: "3 Years",
    },
    {
      id: 8,
      name: "Microfiber Pillows",
      price: 1299,
      originalPrice: 1699,
      image: "/images/luxury-pillows.jpg",
      description: "Soft and comfortable microfiber pillows for everyday use",
      rating: 4.5,
      reviews: 367,
      category: "pillows",
      size: "24x16 inches",
      features: ["Microfiber Fill", "Machine Washable", "Hypoallergenic"],
      warranty: "2 Years",
    },
    {
      id: 9,
      name: "Neck Pillows",
      price: 899,
      originalPrice: 1299,
      image: "/images/luxury-pillows.jpg",
      description: "Travel-friendly neck support pillows",
      rating: 4.4,
      reviews: 234,
      category: "pillows",
      size: "12x10 inches",
      features: ["Travel Size", "Memory Foam", "Portable"],
      warranty: "1 Year",
    },

    // Toppers
    {
      id: 10,
      name: "Natural Latex Topper 78x72x2",
      price: 19500,
      originalPrice: 24000,
      image: "/images/mattress-topper.jpg",
      description: "2-inch natural latex topper for enhanced comfort",
      rating: 4.7,
      reviews: 456,
      category: "toppers",
      size: "78x72x2 inches",
      features: ["100% Natural Latex", "Pressure Relief", "Breathable"],
      warranty: "10 Years",
    },
    {
      id: 11,
      name: "Natural Latex Topper 78x60x2",
      price: 17000,
      originalPrice: 21000,
      image: "/images/mattress-topper.jpg",
      description: "Queen size natural latex topper for existing mattresses",
      rating: 4.6,
      reviews: 334,
      category: "toppers",
      size: "78x60x2 inches",
      features: ["Natural Latex", "Easy Installation", "Comfort Enhancement"],
      warranty: "10 Years",
    },
    {
      id: 12,
      name: "Natural Latex Topper 78x60x1",
      price: 10300,
      originalPrice: 13000,
      image: "/images/mattress-topper.jpg",
      description: "1-inch natural latex topper for subtle comfort upgrade",
      rating: 4.5,
      reviews: 267,
      category: "toppers",
      size: "78x60x1 inches",
      features: ["Thin Profile", "Natural Latex", "Easy Care"],
      warranty: "8 Years",
    },

    // Protectors
    {
      id: 13,
      name: "Waterproof Mattress Protector",
      price: 2499,
      originalPrice: 3299,
      image: "/images/mattress-protector.jpg",
      description: "100% waterproof protection with breathable fabric",
      rating: 4.9,
      reviews: 1156,
      category: "protectors",
      size: "Multiple Sizes",
      features: ["100% Waterproof", "Breathable", "Machine Washable"],
      warranty: "3 Years",
    },

    // Specialty Beds
    {
      id: 14,
      name: "Hostel Bed Foldable 72x36x2",
      price: 8999,
      originalPrice: 11999,
      image: "/images/hostel-bed.jpg",
      description: "Compact foldable bed perfect for hostels and small spaces",
      rating: 4.4,
      reviews: 189,
      category: "mattresses",
      size: "72x36x2 inches",
      features: ["Foldable Design", "Space Saving", "Portable"],
      warranty: "5 Years",
    },
    {
      id: 15,
      name: "Hostel Bed 72x36x3",
      price: 12999,
      originalPrice: 16999,
      image: "/images/hostel-bed.jpg",
      description: "Standard hostel bed with enhanced thickness",
      rating: 4.5,
      reviews: 234,
      category: "mattresses",
      size: "72x36x3 inches",
      features: ["Durable Construction", "Comfort Foam", "Easy Maintenance"],
      warranty: "5 Years",
    },
    {
      id: 16,
      name: "Baby Bed",
      price: 6999,
      originalPrice: 9499,
      image: "/images/baby-bed.jpg",
      description: "Safe and comfortable bed designed specifically for babies",
      rating: 4.8,
      reviews: 345,
      category: "mattresses",
      size: "48x24x4 inches",
      features: ["Baby Safe Materials", "Hypoallergenic", "Soft Support"],
      warranty: "3 Years",
    },
    {
      id: 17,
      name: "Sofa Cum Bed",
      price: 24999,
      originalPrice: 32999,
      image: "/images/sofa-cum-bed.jpg",
      description: "Versatile furniture that converts from sofa to bed",
      rating: 4.6,
      reviews: 178,
      category: "mattresses",
      size: "72x48 inches",
      features: ["Dual Function", "Space Saving", "Modern Design"],
      warranty: "7 Years",
    },

    // Accessories
    {
      id: 18,
      name: "Pillow Bags",
      price: 299,
      originalPrice: 499,
      image: "/images/luxury-pillows.jpg",
      description: "Protective storage bags for pillows",
      rating: 4.3,
      reviews: 123,
      category: "accessories",
      size: "Various Sizes",
      features: ["Dust Protection", "Storage Solution", "Durable Material"],
      warranty: "1 Year",
    },
    {
      id: 19,
      name: "Water Bottle Bag",
      price: 199,
      originalPrice: 349,
      image: "/images/luxury-pillows.jpg",
      description: "Insulated bag for water bottles",
      rating: 4.2,
      reviews: 89,
      category: "accessories",
      size: "Standard",
      features: ["Insulated", "Portable", "Easy Carry"],
      warranty: "6 Months",
    },
    {
      id: 20,
      name: "Jewelry Bag",
      price: 399,
      originalPrice: 599,
      image: "/images/luxury-pillows.jpg",
      description: "Elegant storage solution for jewelry",
      rating: 4.4,
      reviews: 156,
      category: "accessories",
      size: "Compact",
      features: ["Organized Storage", "Soft Interior", "Travel Friendly"],
      warranty: "1 Year",
    },
    {
      id: 21,
      name: "Hotel Linens",
      price: 1999,
      originalPrice: 2799,
      image: "/images/hotel-linens.jpg",
      description: "Premium quality hotel-grade bed linens",
      rating: 4.7,
      reviews: 267,
      category: "accessories",
      size: "King/Queen/Single",
      features: ["Hotel Quality", "Durable Fabric", "Easy Care"],
      warranty: "2 Years",
    },
  ]

  const certifications = [
    { name: "ECO INSTITUT", icon: <Leaf className="h-5 w-5" /> },
    { name: "SGS Certified", icon: <Award className="h-5 w-5" /> },
    { name: "GOLS Certified", icon: <Shield className="h-5 w-5" /> },
  ]

  // Filter products based on selected category and price range
  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory
    const selectedPriceRange = priceRanges.find((range) => range.id === priceRange)
    const priceMatch = selectedPriceRange
      ? product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
      : true
    return categoryMatch && priceMatch
  })

  // Update category counts based on current filters
  const updatedCategories = categories.map((category) => {
    if (category.id === "all") {
      return { ...category, count: allProducts.length }
    }
    const count = allProducts.filter((product) => product.category === category.id).length
    return { ...category, count }
  })

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  const addToCart = (product: any) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        size: product.size,
      },
    })
    dispatch({ type: "OPEN_CART" })
  }

  const openProductModal = (product: any) => {
    const productWithDetails = {
      ...product,
      specifications: {
        material: product.features.includes("100% Natural Latex")
          ? "100% Natural Latex from Thailand"
          : "Premium quality materials",
        thickness: product.size || "Standard thickness",
        firmness: product.category === "pillows" ? "Soft to medium support" : "Medium-firm support",
        care: "Spot clean with mild detergent, air dry",
      },
    }
    setSelectedProduct(productWithDetails)
    setIsProductModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header comes from global SiteChrome (SaasHeader). */}

      {/* Shop Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Shop</h1>
            <p className="text-xl text-gray-600">
              Premium sleep products with 7-zone comfort latex imported from Thailand
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
              <h3 className="text-lg font-semibold text-gray-900">100% Natural Latex</h3>
              <p className="text-gray-600">Sap from rubber trees processed into premium mattresses</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">7-Zone Support</h3>
              <p className="text-gray-600">Different zones of hardness and softness for optimal spine alignment</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">15 Years Warranty</h3>
              <p className="text-gray-600">Rigorously tested for quality and backed by comprehensive warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Filters */}
      <section className="py-8 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {updatedCategories.map((category) => (
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
              Showing {filteredProducts.length} of {allProducts.length} products
              {selectedCategory !== "all" && ` in ${updatedCategories.find((c) => c.id === selectedCategory)?.name}`}
              {priceRange !== "all" && ` • ${priceRanges.find((p) => p.id === priceRange)?.name}`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-0">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-orange-600 text-white text-xs">
                        {product.category === "mattresses" ? "Premium" : "Popular"}
                      </Badge>
                      {product.warranty && (
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white text-xs">
                          {product.warranty} Warranty
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
                      <p className="text-xs text-gray-600 line-clamp-2 min-h-[2rem]">{product.description}</p>
                      <p className="text-xs text-orange-600 font-medium">Size: {product.size}</p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) ? "fill-orange-400 text-orange-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">({product.reviews})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
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

          {filteredProducts.length === 0 && (
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
            <p className="text-gray-600">Premium quality features in every product</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Leaf className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">100% Natural</h3>
              <p className="text-sm text-gray-600">Made from natural rubber tree sap</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Anti-Allergic</h3>
              <p className="text-sm text-gray-600">Hypoallergenic and dust mite resistant</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Certified Quality</h3>
              <p className="text-sm text-gray-600">ECO INSTITUT, SGS, and GOLS certified</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">15 Year Warranty</h3>
              <p className="text-sm text-gray-600">Long-lasting quality guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
