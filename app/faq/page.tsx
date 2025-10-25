import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  Truck,
  Shield,
  Clock,
  CreditCard,
  Package,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ - NH360 FASTag | Sales, Recharge, KYC & Support",
  description:
    "Answers to common questions about NH360 FASTag — new tag issuance, recharge assistance, KYC updates, blacklist removal, and fleet solutions.",
  openGraph: {
    title: "FAQ - NH360 FASTag",
    description: "FASTag sales, recharge and support — quick answers.",
    images: ["/placeholder.jpg"],
  },
}

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Product Information",
      icon: <Package className="h-6 w-6" />,
      questions: [
        {
          question: "What makes our services different?",
          answer: "We offer end‑to‑end FASTag assistance — issuance, recharge, KYC, blacklist removal and fleet support — with quick response and PAN‑India coverage.",
        },
        {
          question: "What sizes are available for your mattresses?",
          answer: "We offer all standard sizes: Single (3' x 6'3\"), Double (4'6\" x 6'3\"), Queen (5' x 6'6\"), and King (6' x 6'6\"). Custom sizes are also available for special requirements.",
        },
        {
          question: "Are your products hypoallergenic?",
          answer: "Yes, all our latex products are naturally hypoallergenic and resistant to dust mites, mold, and bacteria. They're perfect for people with allergies or sensitive skin.",
        },
        {
          question: "What is the difference between memory foam and latex?",
          answer: "Memory foam conforms to your body shape and retains heat, while natural latex provides better support, breathability, and temperature regulation. Our latex products offer superior durability and natural comfort.",
        },
      ],
    },
    {
      title: "Ordering & Payment",
      icon: <CreditCard className="h-6 w-6" />,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery. We also offer EMI options through our partner banks for purchases above ₹10,000.",
        },
        {
          question: "Is it safe to order online?",
          answer: "Absolutely! We use industry-standard SSL encryption for all transactions. Your payment information is secure and we never store your card details on our servers.",
        },
        {
          question: "Do you offer bulk discounts?",
          answer: "Yes, we offer special pricing for bulk orders (5+ items) and institutional purchases. Contact our sales team for custom quotes and volume discounts.",
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "You can modify or cancel your order within 2 hours of placement. After that, please contact our customer service team for assistance.",
        },
      ],
    },
    {
      title: "Delivery & Shipping",
      icon: <Truck className="h-6 w-6" />,
      questions: [
        {
          question: "How long does delivery take?",
          answer: "Standard delivery takes 3-7 business days across India. Express delivery (1-2 days) is available in major cities for an additional fee.",
        },
        {
          question: "Do you deliver to all locations in India?",
          answer: "Yes, we provide free delivery across all states and union territories in India. Remote areas may take 7-10 business days.",
        },
        {
          question: "What is your delivery process?",
          answer: "We'll contact you 24 hours before delivery to confirm the time. Our team will deliver, unpack, and set up your mattress in your preferred room.",
        },
        {
          question: "Do you offer white-glove delivery?",
          answer: "Yes, our premium delivery service includes setup, old mattress removal, and packaging disposal at no extra cost.",
        },
      ],
    },
    {
      title: "Warranty & Returns",
      icon: <Shield className="h-6 w-6" />,
      questions: [
        {
          question: "What warranty do you provide?",
          answer: "All our latex mattresses come with a 15-year comprehensive warranty covering manufacturing defects, sagging, and structural issues.",
        },
        {
          question: "What is your return policy?",
          answer: "We offer a 100-night trial period. If you're not satisfied, you can return the product for a full refund within 100 days of delivery.",
        },
        {
          question: "How do I initiate a return?",
          answer: "Contact our customer service team within 100 days of delivery. We'll arrange pickup and process your refund within 7-10 business days.",
        },
        {
          question: "Are there any return fees?",
          answer: "No return fees for manufacturing defects. For trial returns, a nominal pickup fee of ₹500 applies to cover logistics costs.",
        },
      ],
    },
    {
      title: "Customer Support",
      icon: <HelpCircle className="h-6 w-6" />,
      questions: [
        {
          question: "How can I contact customer support?",
          answer: "Call us at 8667460935 or 8667460635, email support@nh360fastag.com, or use our contact form. We're available Mon-Sat, 9 AM - 7 PM IST.",
        },
        {
          question: "Do you offer installation support?",
          answer: "Yes, our delivery team will set up your mattress and provide care instructions. We also offer video consultations for setup guidance.",
        },
        {
          question: "Can I schedule a consultation?",
          answer: "Absolutely! We offer free video consultations to help you choose the right mattress. Book a slot through our website or call us directly.",
        },
        {
          question: "Do you provide maintenance tips?",
          answer: "Yes, we provide comprehensive care guides and maintenance tips with every purchase. Our team is also available for ongoing support.",
        },
      ],
    },
  ]

  const quickLinks = [
    {
      title: "Contact Support",
      description: "Get immediate help from our team",
      icon: <Phone className="h-6 w-6" />,
      link: "/contact",
      color: "bg-blue-500",
    },
    {
      title: "Track Order",
      description: "Check your delivery status",
      icon: <Truck className="h-6 w-6" />,
      link: "#",
      color: "bg-green-500",
    },
    {
      title: "Return Request",
      description: "Start your return process",
      icon: <Package className="h-6 w-6" />,
      link: "#",
      color: "bg-orange-500",
    },
    {
      title: "Warranty Claim",
      description: "Submit warranty requests",
      icon: <Shield className="h-6 w-6" />,
      link: "#",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header comes from global SiteChrome (SaasHeader). */}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our products, services, and policies
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.link}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${link.color} text-white rounded-full`}>
                      {link.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{link.title}</h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-8">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-full">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {category.questions.map((faq, faqIndex) => (
                    <Card key={faqIndex} className="border-0 shadow-lg">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-start space-x-2">
                          <span className="text-orange-600">Q.</span>
                          <span>{faq.question}</span>
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex items-start space-x-2">
                          <span className="text-orange-600 font-semibold">A.</span>
                          <span>{faq.answer}</span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Still Need Help?</h2>
            <p className="text-lg text-gray-600">
              Can't find what you're looking for? Our customer support team is here to help you 24/7.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                <p className="text-gray-600">+91-9894517926</p>
                <p className="text-sm text-gray-500">Mon-Sat, 9 AM - 7 PM</p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                <p className="text-gray-600">karan@britexcbe.com</p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                <p className="text-gray-600">54RC+F3, Kakapalayam</p>
                <p className="text-sm text-gray-500">Paduvampalli, Tamil Nadu</p>
              </div>
            </div>
            <div className="pt-8">
              <Link href="/contact">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white h-12 px-8">
                  Contact Support
                </Button>
              </Link>
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
