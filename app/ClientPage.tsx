"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Truck, Shield, Clock, MapPin, Award, Car, CreditCard, UserCheck, Ban, Headphones } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCarousel } from "@/components/product-carousel"

export default function ClientPage() {
  // FASTag-focused services and highlights

  const services = [
    {
      icon: <Car className="h-8 w-8" />,
      title: "Buy FASTag",
      description: "New FASTag issuance for cars, SUVs, and commercial vehicles with quick KYC assistance.",
      points: ["Same‑day activation", "Doorstep document help", "PAN‑India"],
      image: "/placeholder.jpg",
      id: "buy",
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Recharge Assistance",
      description: "Top up any bank’s FASTag, fix failed recharges and reversals with guided support.",
      points: ["All issuers supported", "Instant help", "Secure payments"],
      image: "/placeholder.jpg",
      id: "recharge",
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "KYC & Tag Replacement",
      description: "Update KYC, replace damaged tags, or move FASTag to a new vehicle easily.",
      points: ["Doorstep KYC", "Quick replacement", "All vehicles"],
      image: "/placeholder.jpg",
      id: "services",
    },
    {
      icon: <Ban className="h-8 w-8" />,
      title: "Blacklist Removal",
      description: "Resolve blacklist due to low balance, KYC, or issuer issues. We coordinate end‑to‑end.",
      points: ["Faster resolution", "Issuer coordination", "Dispute support"],
      image: "/placeholder.jpg",
      id: "services",
    },
  ]

  const testimonials = [
    {
      name: "Vikram Singh",
      location: "Delhi",
      rating: 5,
      text: "Got my FASTag same day with NH360. KYC was super easy and support was excellent.",
      verified: true,
    },
    {
      name: "Anjali Mehta",
      location: "Mumbai",
      rating: 5,
      text: "They quickly resolved a blacklist issue and helped with recharge reversal. Highly recommended!",
      verified: true,
    },
    {
      name: "Ramesh Nair",
      location: "Bengaluru",
      rating: 5,
      text: "Great for fleet recharge and consolidated support. Smooth coordination and quick response.",
      verified: true,
    },
  ]

  const usp = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Same‑Day Activation",
      description: "Get up and running faster",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "All Banks Supported",
      description: "Recharge and service any issuer",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "PAN‑India Service",
      description: "We cover every highway",
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "24×7 Support",
      description: "Expert help when you need it",
    },
  ]

  const certifications = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "IHMCL/NHAI Compliant",
      description: "Aligned with national FASTag standards",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Payments",
      description: "Safe and trusted processing",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Fleet Ready",
      description: "Built for logistics and transport",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header comes from global SiteChrome (SaasHeader). */}

      {/* Hero Section */}
      <HeroCarousel />

      {/* Quick Actions */}
      <section className="py-12 bg-white" id="buy">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                    <Car className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Buy FASTag</h3>
                </div>
                <p className="text-gray-600">Get a new FASTag for your vehicle with doorstep KYC assistance and quick activation.</p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Link href="/contact">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg" id="recharge">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Recharge Assistance</h3>
                </div>
                <p className="text-gray-600">Top up any bank’s FASTag and fix failed recharge or reversal issues.</p>
                <Button asChild variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  <Link href="/contact">Recharge Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Certified Quality You Can Trust</h2>
            <p className="text-xl text-gray-600">International certifications ensuring premium quality and safety</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full">
                  {cert.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{cert.title}</h3>
                <p className="text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FASTag Products Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <ProductCarousel
            title="FASTag Products"
            subtitle="Choose your FASTag type"
            disableLinks
            leadMode
            products={[
              {
                id: 101,
                name: "FASTag (Car / Jeep / Van)",
                price: "₹499",
                originalPrice: "₹600",
                image: "/placeholder.jpg",
                description: "Tag issuance + activation + KYC assistance",
                rating: 4.8,
                reviews: 1200,
                category: "fastag",
                features: ["Same‑day activation", "All India", "KYC support"],
              },
              {
                id: 102,
                name: "FASTag (LCV / Truck / Bus)",
                price: "₹600",
                originalPrice: "₹750",
                image: "/placeholder.jpg",
                description: "Commercial vehicle FASTag issuance and activation",
                rating: 4.7,
                reviews: 890,
                category: "fastag",
                features: ["Fleet ready", "Assisted onboarding", "Nationwide"],
              },
              {
                id: 103,
                name: "FASTag Recharge Assistance",
                price: "₹100",
                originalPrice: "₹150",
                image: "/placeholder.jpg",
                description: "Recharge guidance and failed-payment resolution",
                rating: 4.9,
                reviews: 2100,
                category: "fastag",
                features: ["All issuers", "Instant help", "Secure"],
              },
              {
                id: 104,
                name: "KYC Update / Tag Replacement",
                price: "₹199",
                originalPrice: "₹249",
                image: "/placeholder.jpg",
                description: "KYC updates and damaged tag replacement support",
                rating: 4.6,
                reviews: 540,
                category: "fastag",
                features: ["Quick processing", "Doorstep help", "Nationwide"],
              },
            ]}
          />
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {usp.map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Services</h2>
            <p className="text-xl text-gray-600">FASTag sales, recharge, and support across India</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((spec, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={spec.image || "/placeholder.svg"}
                      alt={spec.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                        {spec.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{spec.title}</h3>
                    </div>
                    <p className="text-gray-600">{spec.description}</p>
                    <div className="space-y-2">
                      {spec.points.map((p: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                          <span className="text-sm text-gray-700">{p}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2">
                      <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                        <Link href={`#${spec.id}`}>Get Started</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why NH360 FASTag */}
      <section className="py-16 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Why NH360 FASTag?</h2>
            <p className="text-xl text-orange-100">Fast, reliable, and compliant FASTag services</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Trusted & Compliant</h3>
              <p className="text-orange-100">Aligned with IHMCL/NHAI guidelines and best practices</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Quick Activation</h3>
              <p className="text-orange-100">Same‑day onboarding with guided KYC support</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Fleet Friendly</h3>
              <p className="text-orange-100">Bulk issuance, centralized recharge, and reports</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">PAN‑India Support</h3>
              <p className="text-orange-100">End‑to‑end help across all states</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from real customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                    {testimonial.verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-orange-500">NH360 FASTag</div>
              </div>
              <p className="text-gray-400">FASTag Sales & Services Across India</p>
              <p className="text-gray-400">Buy FASTag, recharge, and get 24×7 support for all issuers.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Services</h4>
              <div className="space-y-2 text-gray-400">
                <Link href="#buy" className="block hover:text-orange-500 transition-colors">Buy FASTag</Link>
                <Link href="#recharge" className="block hover:text-orange-500 transition-colors">Recharge</Link>
                <Link href="/support/kyc-update" className="block hover:text-orange-500 transition-colors">KYC Update</Link>
                <Link href="/support/blacklist-removal" className="block hover:text-orange-500 transition-colors">Blacklist Removal</Link>
                <Link href="#services" className="block hover:text-orange-500 transition-colors">Fleet Solutions</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Support</h4>
              <div className="space-y-2 text-gray-400">
                <Link href="/about" className="block hover:text-orange-500 transition-colors">
                  About Us
                </Link>
                <Link href="/faq" className="block hover:text-orange-500 transition-colors">
                  FAQ
                </Link>
                <Link href="/contact" className="block hover:text-orange-500 transition-colors">
                  Contact
                </Link>
                <Link href="/privacy-policy" className="block hover:text-orange-500 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/return-policy" className="block hover:text-orange-500 transition-colors">
                  Return Policy
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Connect</h4>
              <div className="space-y-2 text-gray-400">
                <Link href="#" className="block hover:text-orange-500 transition-colors">
                  Facebook
                </Link>
                <Link href="#" className="block hover:text-orange-500 transition-colors">
                  Instagram
                </Link>
                <Link href="#" className="block hover:text-orange-500 transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="block hover:text-orange-500 transition-colors">
                  YouTube
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NH360 FASTag. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
