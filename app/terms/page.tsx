import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, FileText, Mail, Phone, MapPin, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions - NH360 FASTag Solutions",
  description:
    "Terms and Conditions for using NH360 FASTag Solutions website and services, including sales, recharge assistance, KYC updates, blacklist removal, and fleet solutions.",
  openGraph: {
    title: "Terms & Conditions - NH360 FASTag Solutions",
    description:
      "Read the Terms and Conditions governing your use of NH360 FASTag Solutions website and services.",
    images: ["/placeholder.jpg"],
  },
}

export default function TermsPage() {
  const updatedOn = "January 15, 2025"
  const company = {
    name: "NH360 FASTag Solutions",
    corporateAddress:
      "6th Floor, Block C, Hanudev Infopark, Sf.No.558/2, Udayampalayam Main Rd, KR Puram, NavaIndia, Coimbatore, Tamil Nadu 641028",
    registeredAddress:
      "2nd Floor, Isha Towers, 222/4, New Scheme Rd, near KVB Bank, Pappanaickenpalayam, Coimbatore, Tamil Nadu 641037",
    phones: ["+91-8667460935", "+91-8667460635"],
    emails: ["info@nh360fastag.com", "support@nh360fastagsolutions.com"],
  }

  const sections = [
    {
      title: "Acceptance of Terms",
      body:
        "By accessing or using our website or services, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use immediately.",
    },
    {
      title: "Services Provided",
      body:
        "We provide assistance related to FASTag including new tag issuance facilitation, recharge assistance, KYC updates, blacklist removal guidance, dispute support, tag replacement coordination, and fleet solutions. We are a facilitation and support provider; issuance and transactional decisions rest with the respective issuing banks and NPCI/NHAI frameworks.",
    },
    {
      title: "User Responsibilities",
      body:
        "You are responsible for providing accurate information and valid KYC documents. You agree not to misuse the website, impersonate others, or engage in any activity that violates applicable laws or issuer/bank policies.",
    },
    {
      title: "Payments & Fees",
      body:
        "Service charges for facilitation and support may apply and are displayed before confirmation. Bank/issuer fees and wallet balances are separate from our service fees. Taxes are applied as per law.",
    },
    {
      title: "Refunds",
      body:
        "Refunds are governed by our Refund Policy. Service fees may be refundable only when the primary service outcome cannot be completed due to reasons attributable to us. Bank/issuer charges are subject to the respective institution’s policies.",
    },
    {
      title: "Third‑Party Services",
      body:
        "Our services may rely on third‑party systems (banks, NPCI, PGs). We do not control their availability, performance, or decisions. Outages or delays at third‑party systems are not within our control.",
    },
    {
      title: "Disclaimers",
      body:
        "Services are provided on an ‘as‑is’ and ‘as‑available’ basis. We disclaim warranties of any kind to the maximum extent permitted by law, including implied warranties of merchantability, fitness for a particular purpose, and non‑infringement.",
    },
    {
      title: "Limitation of Liability",
      body:
        "To the extent permitted by law, NH360 FASTag Solutions shall not be liable for indirect, incidental, special, or consequential damages, or loss of data, profits, or goodwill arising from the use or inability to use our services.",
    },
    {
      title: "Privacy",
      body:
        "Your use of our website and services is also governed by our Privacy Policy, which explains how we collect and process personal data.",
    },
    {
      title: "Prohibited Activities",
      body:
        "You agree not to attempt unauthorized access, interfere with service operations, submit fraudulent documents, or engage in any unlawful activities.",
    },
    {
      title: "Governing Law & Dispute Resolution",
      body:
        "These Terms are governed by the laws of India. Courts at Coimbatore, Tamil Nadu shall have exclusive jurisdiction. We may offer amicable resolution channels prior to legal recourse.",
    },
    {
      title: "Changes to Terms",
      body:
        "We may update these Terms from time to time. Continued use after changes implies acceptance of the updated Terms.",
    },
    {
      title: "Contact",
      body:
        "For questions regarding these Terms, contact us via the channels below.",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mx-auto">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Terms & Conditions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these Terms carefully before using NH360 FASTag Solutions services.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {updatedOn}</span>
          </div>
        </div>
      </section>

      {/* Sections */}
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

      {/* Contact */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border border-orange-200 bg-white text-gray-900 shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">NH360 FASTag Solutions</h3>
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="h-4 w-4 text-orange-600 mt-1" />
                  <div>
                    <div className="font-medium">Corporate Office</div>
                    <div>{company.corporateAddress}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="h-4 w-4 text-orange-600 mt-1" />
                  <div>
                    <div className="font-medium">Registered Office</div>
                    <div>{company.registeredAddress}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4 text-orange-600" />
                  <span>{company.phones.join(" / ")}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <Mail className="h-4 w-4 text-orange-600 mt-1" />
                  <div className="space-y-1">
                    {company.emails.map((e) => (
                      <div key={e}>{e}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-orange-200 bg-white text-gray-900 shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Helpful Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/privacy-policy" className="text-orange-700 hover:underline">Privacy Policy</Link></li>
                  <li><Link href="/return-policy" className="text-orange-700 hover:underline">Refund Policy</Link></li>
                  <li><Link href="/contact" className="text-orange-700 hover:underline">Contact Support</Link></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Link href="/contact">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">Have questions? Contact us</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
