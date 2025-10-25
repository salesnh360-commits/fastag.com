import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, HelpCircle, Phone, Mail, MapPin, Calendar, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Refund Policy - NH360 FASTag Solutions",
  description:
    "Refund policy for NH360 FASTag Solutions services such as issuance facilitation, recharge assistance, KYC updates, blacklist removal guidance, and fleet solutions.",
  openGraph: {
    title: "Refund Policy - NH360 FASTag Solutions",
    description: "Understand how refunds work for our FASTag-related services.",
    images: ["/placeholder.jpg"],
  },
}

export default function RefundPolicyPage() {
  const lastUpdated = "January 15, 2025"
  const contact = {
    phones: ["+91-8667460935", "+91-8667460635"],
    emails: ["info@nh360fastag.com", "support@nh360fastagsolutions.com"],
    corporateAddress:
      "6th Floor, Block C, Hanudev Infopark, Sf.No.558/2, Udayampalayam Main Rd, KR Puram, NavaIndia, Coimbatore, Tamil Nadu 641028",
  }

  const sections = [
    {
      title: "Scope",
      body:
        "This policy applies to our facilitation and support services including FASTag issuance assistance, recharge assistance, KYC updates, blacklist removal guidance, dispute support, and fleet solutions. We do not sell mattresses, pillows or similar products.",
    },
    {
      title: "Service Fees",
      body:
        "Service fees are charged for our time, expertise and coordination efforts. Bank/issuer charges and wallet balances are separate and governed by the respective institution’s policies.",
    },
    {
      title: "FASTag Issuance Assistance",
      body:
        "If a FASTag cannot be issued/activated after you have provided correct and complete KYC documents, and the failure is not due to bank/issuer restrictions or regulatory reasons, we will refund our service fee. When rejection is due to incomplete/incorrect documentation, regulatory constraints, or issuer policy, service fees may not be refundable.",
    },
    {
      title: "Recharge Assistance",
      body:
        "When we assist with a recharge and the payment is captured but the tag is not credited due to issuer/PG issues, we will work with the issuer/payment gateway for resolution. If unresolved within a reasonable time window (typically 5–7 business days) and the funds are not reflected or reversed, we will refund our service fee. Issuer/PG refunds follow their respective policies.",
    },
    {
      title: "KYC Update & Blacklist Removal",
      body:
        "For KYC updates and blacklist removal guidance, fees are refundable only if we cannot initiate the process with the issuer due to reasons attributable to us. If delays or rejections arise from issuer policy, regulatory checks, or incorrect documents, service fees may not be refundable.",
    },
    {
      title: "Disputes & Double‑Debits",
      body:
        "We submit/guide dispute requests with issuers/NPCI for toll double‑charge or debit errors. Outcomes are subject to issuer/NPCI review. Our service fee is refundable only where we fail to submit/initiate the dispute due to our error.",
    },
    {
      title: "Processing Time",
      body:
        "Approved refunds of our service fees are typically processed within 5–7 business days to the original payment method.",
    },
    {
      title: "How to Request a Refund",
      body:
        "Email or call us with your order/reference number, date, service taken, and a brief description. We may request supporting documents (e.g., payment proof, screenshots).",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mx-auto">
            <CreditCard className="h-8 w-8" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Refund Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Clear, fair and service‑oriented refunds for FASTag facilitation and support.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          {sections.map((s, i) => (
            <Card key={i} className="border border-orange-200 bg-white text-gray-900 shadow-sm">
              <CardContent className="p-6 space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">{s.title}</h2>
                <p className="text-gray-700 leading-relaxed">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact for Refunds */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Need Help With a Refund?</h2>
              <p className="text-gray-600">Reach out with your reference number. We’re happy to assist.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border border-orange-200 bg-white text-gray-900 shadow-sm text-center">
                <CardContent className="p-6 space-y-2">
                  <Phone className="h-6 w-6 text-orange-600 mx-auto" />
                  <div className="font-semibold">Call Us</div>
                  <div className="text-gray-700">{contact.phones.join(" / ")}</div>
                </CardContent>
              </Card>
              <Card className="border border-orange-200 bg-white text-gray-900 shadow-sm text-center">
                <CardContent className="p-6 space-y-2">
                  <Mail className="h-6 w-6 text-orange-600 mx-auto" />
                  <div className="font-semibold">Email Us</div>
                  <div className="text-gray-700">{contact.emails.join(" | ")}</div>
                </CardContent>
              </Card>
              <Card className="border border-orange-200 bg-white text-gray-900 shadow-sm text-center">
                <CardContent className="p-6 space-y-2">
                  <MapPin className="h-6 w-6 text-orange-600 mx-auto" />
                  <div className="font-semibold">Corporate Office</div>
                  <div className="text-gray-700">{contact.corporateAddress}</div>
                </CardContent>
              </Card>
            </div>
            <div className="pt-8 text-center">
              <Link href="/contact">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">Contact Support</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
