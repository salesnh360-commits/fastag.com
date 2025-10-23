"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ProductModal } from "./product-modal"

// Convert Google Drive share links to a direct image URL (lh3.googleusercontent)
function normalizeImageUrl(url?: string) {
  if (!url) return url
  try {
    // file page
    const m1 = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//)
    if (m1 && m1[1]) return `https://lh3.googleusercontent.com/d/${m1[1]}=s1600`
    // open/uc?id=
    const m2 = url.match(/drive\.(?:google|usercontent)\.com\/(?:open|uc|download)\?[^#]*[?&]id=([^&#]+)/)
    if (m2 && m2[1]) return `https://lh3.googleusercontent.com/d/${decodeURIComponent(m2[1])}=s1600`
    return url
  } catch {
    return url
  }
}

interface HeroSlide {
  id: number
  badge: string
  title: string
  subtitle: string
  description: string
  primaryButton: {
    text: string
    action: "shop" | "product"
    href?: string
  }
  secondaryButton: {
    text: string
    href: string
  }
  rating: number
  reviews: string
  additionalInfo: string
  startingPrice: string
  image: string
  imageAlt: string
  product?: {
    id: number
    name: string
    price: number
    originalPrice: number
    image: string
    description: string
    rating: number
    reviews: number
    category: string
    size: string
    features: string[]
    warranty: string
    specifications: {
      material: string
      thickness: string
      firmness: string
      care: string
    }
  }
}

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [dynamicSlides, setDynamicSlides] = useState<HeroSlide[] | null>(null)

  const fallbackSlides: HeroSlide[] = [
    {
      id: 1,
      badge: "NH360 FASTag",
      title: "Buy FASTag,",
      subtitle: "Online in Minutes",
      description:
        "FASTag sales and activation across India. Doorstep KYC help, same‑day activation, and expert support for individuals and fleets.",
      primaryButton: {
        text: "Buy FASTag",
        action: "shop",
        href: "#buy",
      },
      secondaryButton: {
        text: "Recharge FASTag",
        href: "#recharge",
      },
      rating: 4.8,
      reviews: "5,000+ tags issued",
      additionalInfo: "PAN‑India assistance",
      startingPrice: "₹499",
      image: "/placeholder.jpg",
      imageAlt: "FASTag purchase and activation",
    },
    {
      id: 2,
      badge: "Instant Recharge",
      title: "FASTag Recharge",
      subtitle: "Assistance",
      description:
        "Top up any bank’s FASTag quickly. Get help fixing failed recharges, reversals, and wallet issues.",
      primaryButton: {
        text: "Recharge Now",
        action: "shop",
        href: "#recharge",
      },
      secondaryButton: {
        text: "See Services",
        href: "#services",
      },
      rating: 4.9,
      reviews: "10,000+ recharges",
      additionalInfo: "Support for all issuers",
      startingPrice: "From ₹100",
      image: "/placeholder.jpg",
      imageAlt: "FASTag recharge support",
    },
    {
      id: 3,
      badge: "Fleet Solutions",
      title: "Corporate & Fleet",
      subtitle: "FASTag",
      description:
        "Bulk issuance, centralized recharge, usage reports, and dispute handling tailored for logistics and transport fleets.",
      primaryButton: {
        text: "Talk to Expert",
        action: "shop",
        href: "/contact",
      },
      secondaryButton: {
        text: "Explore Fleet",
        href: "#services",
      },
      rating: 4.7,
      reviews: "900+ fleets served",
      additionalInfo: "Dedicated account support",
      startingPrice: "Custom",
      image: "/placeholder.jpg",
      imageAlt: "Fleet FASTag solutions",
    },
    {
      id: 4,
      badge: "24×7 Support",
      title: "KYC, Blacklist",
      subtitle: "& Disputes",
      description:
        "End‑to‑end help for KYC updates, blacklist removal, tag replacement, and toll dispute resolution.",
      primaryButton: {
        text: "Get Support",
        action: "shop",
        href: "#services",
      },
      secondaryButton: {
        text: "Contact Us",
        href: "/contact",
      },
      rating: 4.6,
      reviews: "3,500+ resolved",
      additionalInfo: "All India coverage",
      startingPrice: "—",
      image: "/placeholder.jpg",
      imageAlt: "FASTag support and services",
    },
  ]

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const total = (dynamicSlides?.length || fallbackSlides.length)
    setCurrentSlide((prev) => (prev + 1) % total)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const total = (dynamicSlides?.length || fallbackSlides.length)
    setCurrentSlide((prev) => (prev - 1 + total) % total)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  useEffect(() => {
    // Try to load dynamic banners
    fetch("/api/banners", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then((rows) => {
        if (!Array.isArray(rows) || rows.length === 0) return
        const mapped: HeroSlide[] = rows
          .filter((r: any) => r.active)
          .sort((a:any,b:any)=>(a.sort_order??0)-(b.sort_order??0))
          .map((b: any, i: number) => ({
          id: b.id,
          badge: b.title || "",
          title: b.title || "",
          subtitle: b.subtitle || "",
          // Keep description optional (no fallback to subtitle to avoid repetition)
          description: b.description || "",
          primaryButton: { text: b.link ? "Learn more" : "Explore", action: "shop", href: b.link || "#buy" },
          secondaryButton: { text: "Contact", href: "/contact" },
          rating: 5,
          reviews: "",
          additionalInfo: "",
          startingPrice: "",
          image: normalizeImageUrl(b.image_url) || "/placeholder.jpg",
          imageAlt: b.title || "Banner",
        }))
        if (mapped.length) setDynamicSlides(mapped)
      })
      .catch(() => {})
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [])

  const slides = dynamicSlides && dynamicSlides.length ? dynamicSlides : fallbackSlides
  // Clamp currentSlide when data source/length changes
  useEffect(() => {
    const total = slides.length
    if (currentSlide >= total) {
      setCurrentSlide(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length])

  // Safe access to current slide data
  const currentSlideData = slides[currentSlide] ?? slides[0]
  const subtitleText = (currentSlideData?.subtitle || "").trim()
  const descriptionText = (currentSlideData?.description || "").trim()
  const showSubtitle = subtitleText.length > 0
  const showDescription = descriptionText.length > 0 && descriptionText !== subtitleText

  const handlePrimaryButtonClick = () => {
    if (currentSlideData.primaryButton.action === "product" && currentSlideData.product) {
      setSelectedProduct(currentSlideData.product)
      setIsProductModalOpen(true)
    }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-orange-50 to-white py-16 lg:py-24 relative overflow-hidden">
        {/* Decorative RFID-like wave background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Left-center emanating waves */}
          <svg
            className="absolute left-[-10%] top-1/2 -translate-y-1/2 h-[160%] w-[70%] opacity-40 text-orange-200"
            viewBox="0 0 800 800"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="rfid-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
              </linearGradient>
              <clipPath id="rfid-clip-left">
                {/* Show only right half to mimic directional waves */}
                <rect x="0" y="0" width="800" height="800" />
              </clipPath>
            </defs>
            <g clipPath="url(#rfid-clip-left)" stroke="url(#rfid-grad)" fill="none" strokeLinecap="round">
              <circle cx="0" cy="400" r="120" strokeWidth="1.5" />
              <circle cx="0" cy="400" r="200" strokeWidth="1.5" />
              <circle cx="0" cy="400" r="280" strokeWidth="1.5" />
              <circle cx="0" cy="400" r="360" strokeWidth="1.25" />
              <circle cx="0" cy="400" r="440" strokeWidth="1.1" />
              <circle cx="0" cy="400" r="520" strokeWidth="1" />
            </g>
          </svg>

          {/* Subtle top-right arcs for balance */}
          <svg
            className="absolute right-[-15%] top-[-10%] h-[70%] w-[50%] opacity-25 text-orange-300"
            viewBox="0 0 800 800"
            aria-hidden="true"
          >
            <g stroke="currentColor" fill="none" strokeLinecap="round">
              <path d="M700,100 a300,300 0 0 1 -300,300" strokeWidth="1.25" />
              <path d="M720,120 a340,340 0 0 1 -340,340" strokeWidth="1.1" />
              <path d="M740,140 a380,380 0 0 1 -380,380" strokeWidth="1" />
            </g>
          </svg>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Text Content */}
            <div className="space-y-8 relative">
              <div
                className={`space-y-6 transition-all duration-500 ease-in-out ${
                  isTransitioning ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
                }`}
              >
                <div className="space-y-4">
                  <Badge className="bg-orange-500/20 text-orange-300 hover:bg-orange-500/25 text-sm font-medium px-4 py-2">
                    {currentSlideData.badge}
                  </Badge>

                  <div className="space-y-2">
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                      {currentSlideData.title}
                      {showSubtitle && (
                        <>
                          <br />
                          <span className="text-orange-600">{subtitleText}</span>
                        </>
                      )}
                    </h1>
                  </div>

                  {showDescription && (
                    <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">{descriptionText}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {currentSlideData.primaryButton.action === "shop" ? (
                    <Link href={currentSlideData.primaryButton.href!}>
                      <Button
                        size="lg"
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto transition-all duration-300 hover:shadow-lg"
                      >
                        {currentSlideData.primaryButton.text}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto transition-all duration-300 hover:shadow-lg"
                      onClick={handlePrimaryButtonClick}
                    >
                      {currentSlideData.primaryButton.text}
                    </Button>
                  )}
                  <Link href={currentSlideData.secondaryButton.href}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold w-full sm:w-auto transition-all duration-300"
                    >
                      {currentSlideData.secondaryButton.text}
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
                      <span className="font-bold text-gray-900 text-base">{currentSlideData.rating}/5</span>
                    </div>
                    <span className="text-gray-600">({currentSlideData.reviews})</span>
                  </div>
                  <div className="text-gray-600 font-medium">{currentSlideData.additionalInfo}</div>
                </div>
              </div>
            </div>

            {/* Image Content */}
            <div className="relative w-full max-w-[800px] aspect-[4/3] mx-auto">
              <div
                className={`relative h-full transition-all duration-500 ease-in-out ${
                  isTransitioning ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
                }`}
              >
                <div className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden bg-white">
                  <Image
                    src={currentSlideData.image || "/placeholder.svg"}
                    alt={currentSlideData.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 800px, 92vw"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    priority
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl border border-orange-200">
                  <div className="text-sm text-gray-700 font-medium">Starting from</div>
                  <div className="text-3xl font-bold text-orange-600">{currentSlideData.startingPrice}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
          <button
            aria-label="Previous slide"
            onClick={prevSlide}
            className="pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow border border-gray-200"
          >
            <span className="sr-only">Previous</span>
            {/* left chevron */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M15.53 4.47a.75.75 0 0 1 0 1.06L9.06 12l6.47 6.47a.75.75 0 1 1-1.06 1.06l-7-7a.75.75 0 0 1 0-1.06l7-7a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            aria-label="Next slide"
            onClick={nextSlide}
            className="pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow border border-gray-200"
          >
            <span className="sr-only">Next</span>
            {/* right chevron */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M8.47 19.53a.75.75 0 0 1 0-1.06L14.94 12 8.47 5.53a.75.75 0 0 1 1.06-1.06l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-6 bg-orange-600" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
    </>
  )
}

