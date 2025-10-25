import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact NH360 FASTag | FASTag Sales, Recharge & Support",
  description:
    "Get FASTag help from NH360 FASTag — new tag issuance, recharge assistance, KYC updates, blacklist removal, and fleet solutions across India.",
  openGraph: {
    title: "Contact NH360 FASTag",
    description: "Talk to our FASTag experts for sales, recharge, and support.",
    images: ["/placeholder.jpg"],
  },
}

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+91-8667460935", "+91-8667460635"],
      description: "Mon-Sat, 9 AM - 7 PM",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["info@nh360fastag.com", "support@nh360fastagsolutions.com"],
      description: "We'll respond within 24 hours",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Address",
      details: [
        "6th Floor, Block C, Hanudev Infopark, Sf.No.558/2",
        "Udayampalayam Main Rd, KR Puram, NavaIndia, Coimbatore, Tamil Nadu 641028",
      ],
      description: "Corporate Office",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      details: ["Monday - Saturday: 9:00 AM - 7:00 PM", "Sunday: 10:00 AM - 5:00 PM"],
      description: "Indian Standard Time",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Global SiteChrome already injects the main header. */}

      {/* Contact Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Get FASTag Support</h1>
            <p className="text-xl text-gray-600">Sales, recharge, KYC and blacklist assistance across India</p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center border border-orange-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border border-orange-200 bg-white shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                    <p className="text-gray-600">Fill out the form below and we'll get back to you soon.</p>
                  </div>

                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <Input placeholder="Enter your first name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <Input placeholder="Enter your last name" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input type="email" placeholder="Enter your email" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <Input type="tel" placeholder="Enter your phone number" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Subject</label>
                      <Input placeholder="What's this about?" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Message</label>
                      <Textarea placeholder="Tell us how we can help you..." className="min-h-[120px]" />
                    </div>

                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              <Card className="border border-orange-200 bg-white shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Visit Our Location</h3>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <MapPin className="h-12 w-12 text-orange-600 mx-auto" />
                        <p className="text-gray-600">Interactive map will be loaded here</p>
                        <p className="text-sm text-gray-500">54RC+F3, Kakapalayam, Paduvampalli, Tamil Nadu 641659</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-orange-200 bg-white shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Quick Support</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">Call Us Directly</p>
                          <p className="text-sm text-gray-600">+91-8667460935 / +91-8667460635</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">Email Support</p>
                          <p className="text-sm text-gray-600">support@nh360fastagsolutions.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50">
                        Schedule a Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600">FASTag sales, recharge and service FAQs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">How fast can I get a FASTag?</h3>
              <p className="text-gray-600">Most tags are activated the same day once KYC is complete. We guide you through the process end-to-end.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Which banks/issuers do you support?</h3>
              <p className="text-gray-600">We assist across major issuers including HDFC, ICICI, SBI, Axis, IDFC FIRST, Kotak, Paytm, Airtel Payments Bank and more.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Can you help with KYC and blacklist issues?</h3>
              <p className="text-gray-600">Yes. We provide document guidance for KYC and coordinate with issuers to resolve blacklist due to low balance or KYC problems.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What documents are required?</h3>
              <p className="text-gray-600">Typically RC, PAN, and ID proof. Requirements vary by issuer and vehicle class; our team confirms what’s needed for your case.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

