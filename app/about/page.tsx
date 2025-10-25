import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  Shield,
  Leaf,
  Users,
  Factory,
  CheckCircle,
  Hotel,
  Building2,
  Baby,
  PillIcon as Pillow,
  Globe,
  Truck,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About NH360 FASTag | FASTag Sales & Support Across India",
  description:
    "NH360 FASTag issues FASTags, provides recharge assistance, KYC updates, blacklist removal, and fleet solutions with PAN-India coverage and 24×7 support.",
  openGraph: {
    title: "About NH360 FASTag",
    description: "Nationwide FASTag sales, recharge, and support for individuals and fleets.",
    images: ["/placeholder.jpg"],
  },
}

export default function AboutPage() {
  const certifications = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "ECO INSTITUT Certified",
      description: "Environmental safety and sustainability standards for all our latex products",
      details: "Ensures our products meet strict environmental and health safety criteria",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "SGS Certified",
      description: "International quality and safety verification from the world's leading inspection company",
      details: "Comprehensive testing for durability, safety, and performance standards",
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "GOLS Certified",
      description: "Global Organic Latex Standard certification for organic latex products",
      details: "Guarantees organic integrity from raw material to finished product",
    },
    {
      icon: <Factory className="h-8 w-8" />,
      title: "Make in India Certified",
      description: "Proudly manufactured in India with global quality standards",
      details: "Supporting local manufacturing while maintaining international quality",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "ISO 9001:2015",
      description: "Quality management systems certification ensuring consistent product quality",
      details: "Systematic approach to quality management and continuous improvement",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "CertiPUR-US",
      description: "Foam certification program ensuring safe and environmentally responsible materials",
      details: "Free from harmful chemicals and low VOC emissions for indoor air quality",
    },
  ]

  const specializations = [
    {
      icon: <Hotel className="h-8 w-8" />,
      title: "Hotel & Hospitality Solutions",
      description: "Premium sleep solutions designed for the hospitality industry",
      products: [
        "Hotel Grade Mattresses",
        "Premium Bed Linens",
        "Bulk Order Management",
        "Custom Sizing Available",
        "Commercial Warranty",
      ],
      image: "/images/hotel-linens.jpg",
      features: ["Durability Tested", "Easy Maintenance", "Cost Effective"],
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Hostel & Institutional",
      description: "Space-efficient and durable bedding solutions for hostels and institutions",
      products: [
        "Foldable Beds 72x36x2",
        "Hostel Beds 72x36x3",
        "Compact Storage Solutions",
        "Easy Assembly Design",
        "Bulk Pricing Available",
      ],
      image: "/images/hostel-bed.jpg",
      features: ["Space Saving", "Durable Construction", "Easy Transport"],
    },
    {
      icon: <Baby className="h-8 w-8" />,
      title: "Baby & Kids Specialty",
      description: "Safe and comfortable sleep solutions designed specifically for children",
      products: [
        "Baby Safe Mattresses",
        "Hypoallergenic Materials",
        "Non-Toxic Certifications",
        "Soft Support Systems",
        "Easy Clean Covers",
      ],
      image: "/images/baby-bed.jpg",
      features: ["Safety First", "Gentle Support", "Easy Care"],
    },
    {
      icon: <Pillow className="h-8 w-8" />,
      title: "Therapeutic & Wellness",
      description: "Specialized pillows and accessories for health and wellness",
      products: [
        "Cervical Support Pillows",
        "Charcoal Infused Pillows",
        "Memory Foam Neck Pillows",
        "Therapeutic Toppers",
        "Ergonomic Designs",
      ],
      image: "/images/cervical-pillow.jpg",
      features: ["Health Focused", "Ergonomic Design", "Therapeutic Benefits"],
    },
  ]

  const features = [
    "7-Layer Premium Latex Construction",
    "Natural Latex from Sustainable Sources",
    "Zone-Based Support Technology",
    "Cooling Gel Infusion",
    "Anti-Microbial Treatment",
    "Edge Support Technology",
    "Breathable Design",
    "Anti-Dust Mite Properties",
    "100% Natural Materials",
    "Eco-Friendly Processing",
    "Temperature Regulation",
    "Pressure Point Relief",
  ]

  const qualityStandards = [
    {
      title: "15-Year Warranty",
      description: "Comprehensive warranty coverage on all latex products",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "100% Natural Latex",
      description: "Sourced from sustainable rubber tree plantations",
      icon: <Leaf className="h-6 w-6" />,
    },
    {
      title: "7-Zone Comfort",
      description: "Different zones of hardness for optimal spine alignment",
      icon: <Award className="h-6 w-6" />,
    },
    {
      title: "Anti-Allergic",
      description: "Naturally resistant to dust mites and allergens",
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header comes from global SiteChrome (SaasHeader). */}

      {/* About Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">About Us</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  About <span className="text-orange-600">NH360 FASTag</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Since our inception, Cortez has been committed to revolutionizing sleep comfort through innovative
                  design, premium materials, and cutting-edge technology. We believe everyone deserves exceptional
                  sleep.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/hero-mattress.jpg"
                alt="NH360 FASTag"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our mission is to make highway payments seamless and hassle‑free. From individual motorists to large
              fleets, we help customers get and manage FASTags with the right guidance and support.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              NH360 FASTag serves customers across India with reliable service, transparent pricing, and responsive
              support.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Certifications</h2>
            <p className="text-xl text-gray-600">
              International standards ensuring quality, safety, and sustainability
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full">
                    {cert.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{cert.title}</h3>
                  <p className="text-gray-600 text-sm">{cert.description}</p>
                  <p className="text-gray-500 text-xs">{cert.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Layer Technology */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Revolutionary 7-Layer Latex Technology</h2>
            <p className="text-xl text-gray-600">The science behind superior sleep comfort</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Why 7 Layers?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our proprietary 7-layer latex construction provides optimal support, comfort, and durability. Each
                  layer serves a specific purpose - from pressure relief and spinal alignment to temperature regulation
                  and edge support. The natural latex material is sourced from sustainable plantations and processed
                  using eco-friendly methods.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/mattress-topper.jpg"
                alt="7-Layer Construction"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white p-4 rounded-xl shadow-lg">
                <div className="text-sm">Premium Quality</div>
                <div className="text-2xl font-bold">7 Layers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Quality Standards</h2>
            <p className="text-xl text-gray-600">What makes our products exceptional</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityStandards.map((standard, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full">
                    {standard.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{standard.title}</h3>
                  <p className="text-gray-600 text-sm">{standard.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Specializations</h2>
            <p className="text-xl text-gray-600">Tailored solutions for every sleep need</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {specializations.map((spec, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2">
                    <div className="relative">
                      <Image
                        src={spec.image || "/placeholder.svg"}
                        alt={spec.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          {spec.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{spec.title}</h3>
                      </div>
                      <p className="text-gray-600">{spec.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Products & Services:</h4>
                        {spec.products.map((product, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                            <span className="text-sm text-gray-700">{product}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {spec.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-orange-50 text-orange-700">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Our Mission & Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <Users className="h-12 w-12 mx-auto text-orange-200" />
              <h3 className="text-xl font-semibold">Customer First</h3>
              <p className="text-orange-100">
                Every decision we make is guided by what's best for our customers' sleep and well-being.
              </p>
            </div>
            <div className="text-center space-y-4">
              <Award className="h-12 w-12 mx-auto text-orange-200" />
              <h3 className="text-xl font-semibold">Quality Excellence</h3>
              <p className="text-orange-100">
                We never compromise on quality, ensuring every product meets our rigorous standards.
              </p>
            </div>
            <div className="text-center space-y-4">
              <Leaf className="h-12 w-12 mx-auto text-orange-200" />
              <h3 className="text-xl font-semibold">Sustainability</h3>
              <p className="text-orange-100">
                Committed to eco-friendly practices and sustainable materials in all our products.
              </p>
            </div>
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
              <p className="text-gray-400">A BRITEX Sleep Solution</p>
              <p className="text-gray-400">
                Experience better sleep with our premium mattresses and sleep accessories.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Shop</h4>
              <div className="space-y-2 text-gray-400">
                <Link href="/shop?category=mattresses" className="block hover:text-orange-500 transition-colors">
                  Mattresses
                </Link>
                <Link href="/shop?category=pillows" className="block hover:text-orange-500 transition-colors">
                  Pillows
                </Link>
                <Link href="/shop?category=toppers" className="block hover:text-orange-500 transition-colors">
                  Toppers
                </Link>
                <Link href="/shop?category=protectors" className="block hover:text-orange-500 transition-colors">
                  Protectors
                </Link>
                <Link href="/shop?category=accessories" className="block hover:text-orange-500 transition-colors">
                  Accessories
                </Link>
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
            <p>&copy; 2025 Cortez by BRITEX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
