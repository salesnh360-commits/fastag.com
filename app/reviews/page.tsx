import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, User, Calendar } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "NH360 FASTag Reviews | 4.8/5 | Real Customer Experiences",
  description:
    "Read genuine customer feedback for NH360 FASTag services — tag issuance, recharge assistance, KYC and blacklist support. 4.8/5 with 3,000+ verified experiences.",
  openGraph: {
    title: "NH360 FASTag Reviews",
    description: "Real experiences for FASTag sales, recharge, and support across India.",
    images: ["/placeholder.jpg"],
  },
}

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      rating: 5,
      date: "2024-01-15",
      product: "FASTag Issuance & Activation",
      title: "Quick and hassle-free!",
      content:
        "Got my FASTag the same day. KYC help was smooth and activation was quick. Excellent service!",
      verified: true,
      helpful: 24,
      images: 2,
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi, NCR",
      rating: 5,
      date: "2024-01-10",
      product: "Recharge Assistance",
      title: "Recharge issue fixed fast",
      content:
        "A failed recharge got reversed and re-processed correctly with their help. Very responsive team.",
      verified: true,
      helpful: 18,
      images: 1,
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Bangalore, Karnataka",
      rating: 5,
      date: "2024-01-08",
      product: "Blacklist Removal",
      title: "Blacklist resolved",
      content:
        "They coordinated with the issuer and got my tag out of blacklist quickly. Kept me updated throughout.",
      verified: true,
      helpful: 31,
      images: 3,
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Pune, Maharashtra",
      rating: 4,
      date: "2024-01-05",
      product: "Fleet FASTag",
      title: "Good for our fleet",
      content:
        "Bulk issuance and centralized recharge made things easier. Reporting could be even more detailed, but overall very helpful.",
      verified: true,
      helpful: 15,
      images: 0,
    },
    {
      id: 5,
      name: "Meera Reddy",
      location: "Hyderabad, Telangana",
      rating: 5,
      date: "2024-01-03",
      product: "KYC Update",
      title: "Smooth KYC update",
      content:
        "Updated KYC and replaced the tag in one go. Process was clear and quick.",
      verified: true,
      helpful: 12,
      images: 1,
    },
    {
      id: 6,
      name: "Arjun Gupta",
      location: "Chennai, Tamil Nadu",
      rating: 5,
      date: "2023-12-28",
      product: "Recharge Assistance",
      title: "Reliable recharge help",
      content:
        "We use them regularly to assist with recharges and reversals for our drivers. Dependable service.",
      verified: true,
      helpful: 27,
      images: 2,
    },
  ]

  const stats = [
    { label: "Average Rating", value: "4.8/5", icon: <Star className="h-6 w-6" /> },
    { label: "Total Reviews", value: "3,247", icon: <User className="h-6 w-6" /> },
    { label: "Verified Purchases", value: "98%", icon: <Badge className="h-6 w-6" /> },
    { label: "Recommend Rate", value: "96%", icon: <ThumbsUp className="h-6 w-6" /> },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header comes from global SiteChrome (SaasHeader). */}

      {/* Reviews Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Customer Reviews</h1>
            <p className="text-xl text-gray-600">Real experiences from real customers</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {reviews.map((review) => (
              <Card key={review.id} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Verified Purchase</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(review.date).toLocaleDateString()}</span>
                          </span>
                          <span>{review.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Product */}
                    <div className="text-sm text-orange-600 font-medium">Product: {review.product}</div>

                    {/* Review Content */}
                    <div className="space-y-3">
                      <h4 className="text-xl font-semibold text-gray-900">{review.title}</h4>
                      <p className="text-gray-700 leading-relaxed">{review.content}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {review.images > 0 && (
                          <span>
                            {review.images} photo{review.images > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.helpful} people found this helpful</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              Load More Reviews
            </Button>
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
                <Link href="/#buy" className="block hover:text-orange-500 transition-colors">Buy FASTag</Link>
                <Link href="/#recharge" className="block hover:text-orange-500 transition-colors">Recharge</Link>
                <Link href="/#services" className="block hover:text-orange-500 transition-colors">KYC Update</Link>
                <Link href="/#services" className="block hover:text-orange-500 transition-colors">Blacklist Removal</Link>
                <Link href="/#services" className="block hover:text-orange-500 transition-colors">Fleet Solutions</Link>
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
