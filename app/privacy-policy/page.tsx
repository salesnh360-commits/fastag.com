import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Lock,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Users,
  Database,
  Cookie,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy - NH360 FASTag Solutions",
  description:
    "Learn how NH360 FASTag Solutions collects, uses, and protects your personal information. Read about your privacy rights and our data practices.",
  openGraph: {
    title: "Privacy Policy - NH360 FASTag Solutions",
    description: "Your privacy matters. Learn how we protect your information.",
    images: ["/placeholder.jpg"],
  },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2025"
  const companyInfo = {
    name: "NH360 FASTag Solutions",
    corporateAddress:
      "6th Floor, Block C, Hanudev Infopark, Sf.No.558/2, Udayampalayam Main Rd, KR Puram, NavaIndia, Coimbatore, Tamil Nadu 641028",
    registeredAddress:
      "2nd Floor, Isha Towers, 222/4, New Scheme Rd, near KVB Bank, Pappanaickenpalayam, Coimbatore, Tamil Nadu 641037",
    emails: ["info@nh360fastag.com", "support@nh360fastagsolutions.com"],
    phones: ["+91-8667460935", "+91-8667460635"],
  }

  const dataCategories = [
    {
      title: "Personal Information",
      icon: <Users className="h-6 w-6" />,
      description: "Name, email, phone number, address",
      examples: ["Full name", "Email address", "Phone number", "Address"],
    },
    {
      title: "Service Information",
      icon: <FileText className="h-6 w-6" />,
      description: "FASTag-related details needed to provide services",
      examples: ["Vehicle details", "Issuer/bank", "KYC status", "Recharge info"],
    },
    {
      title: "Technical Data",
      icon: <Database className="h-6 w-6" />,
      description: "Device information, browsing behavior, cookies",
      examples: ["IP address", "Browser type", "Pages visited", "Session duration"],
    },
    {
      title: "Communication Data",
      icon: <Mail className="h-6 w-6" />,
      description: "Customer service interactions, feedback",
      examples: ["Support tickets", "Emails", "Phone interactions", "Chat transcripts"],
    },
  ]

  const dataUsage = [
    {
      purpose: "Service Delivery",
      description: "To provide FASTag issuance, recharge assistance, KYC updates and related support.",
      examples: ["KYC facilitation", "Recharge help", "Dispute support"],
    },
    {
      purpose: "Customer Support",
      description: "To respond to queries, troubleshoot and improve service quality.",
      examples: ["Issue resolution", "Verification", "Follow-ups"],
    },
    {
      purpose: "Improvement & Security",
      description: "To analyze usage patterns, enhance services and maintain security.",
      examples: ["Feature improvements", "Fraud detection", "Audit logs"],
    },
    {
      purpose: "Legal Compliance",
      description: "To comply with applicable laws and regulatory requirements.",
      examples: ["Tax compliance", "Regulatory requests", "Court orders"],
    },
  ]

  const userRights = [
    {
      right: "Access Your Data",
      description: "Request a copy of personal information we hold about you.",
      icon: <Eye className="h-5 w-5" />,
    },
    {
      right: "Correct Your Data",
      description: "Request correction of inaccurate or incomplete information.",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      right: "Delete Your Data",
      description: "Request deletion of personal information subject to law.",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      right: "Data Portability",
      description: "Request transfer of your data to another provider.",
      icon: <Database className="h-5 w-5" />,
    },
    {
      right: "Withdraw Consent",
      description: "Opt out of marketing communications at any time.",
      icon: <Mail className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="border border-orange-200 bg-white text-gray-900 shadow-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">About {companyInfo.name}</h2>
                  <p className="text-gray-600">
                    We are committed to protecting your privacy and ensuring the security of your personal information.
                    This policy explains how we collect, use, and safeguard your data.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div className="text-gray-700">
                        <div className="font-medium">Corporate Office</div>
                        <div>{companyInfo.corporateAddress}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div className="text-gray-700">
                        <div className="font-medium">Registered Office</div>
                        <div>{companyInfo.registeredAddress}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div className="text-gray-700 space-y-0.5">
                        {companyInfo.emails.map((e) => (
                          <div key={e}>{e}</div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-orange-600" />
                      <span className="text-gray-700">{companyInfo.phones.join(" / ")}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Contact</h3>
                  <p className="text-gray-600">
                    If you have any questions about this privacy policy or our data practices, please contact us:
                  </p>
                  <Link href="/contact">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What We Collect */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Information We Collect</h2>
            <p className="text-xl text-gray-600">We collect only what we need to deliver our services</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataCategories.map((category, index) => (
              <Card key={index} className="border border-orange-200 bg-white text-gray-900 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                  <div className="space-y-1">
                    {category.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                        <span className="text-xs text-gray-600">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How We Use Your Information</h2>
            <p className="text-xl text-gray-600">We use your information for specific, legitimate purposes</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {dataUsage.map((usage, index) => (
              <Card key={index} className="border border-orange-200 bg-white text-gray-900 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{usage.purpose}</h3>
                  <p className="text-gray-600">{usage.description}</p>
                  <div className="space-y-2">
                    {usage.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
              <p className="text-xl text-gray-600">We implement robust security measures to protect your information</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Encryption</h3>
                <p className="text-gray-600">
                  Data in transit is protected with SSL/TLS and stored securely with access controls.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Access Control</h3>
                <p className="text-gray-600">
                  Only authorized personnel can access personal information, on a need-to-know basis.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full">
                  <Database className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Secure Storage</h3>
                <p className="text-gray-600">
                  We maintain secure systems, backups and monitoring to protect your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Your Rights</h2>
            <p className="text-xl text-gray-600">You have certain rights regarding your personal information</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRights.map((right, index) => (
              <Card key={index} className="border border-orange-200 bg-white text-gray-900 shadow-sm">
                <CardContent className="p-6 space-y-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-full">
                    {right.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{right.right}</h3>
                  <p className="text-gray-600 text-sm">{right.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cookies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Cookie className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Cookies & Tracking</h2>
            </div>
            <Card className="border border-orange-200 bg-white text-gray-900 shadow-sm">
              <CardContent className="p-6 space-y-3">
                <p className="text-gray-700">
                  We use essential cookies to enable core functionality, and analytics cookies (where permitted) to
                  understand service usage. You can control cookies via your browser settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Questions About Privacy?</h2>
            <p className="text-lg text-gray-600">
              If you have any questions about this privacy policy or our data practices, we're here to help.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                <p className="text-gray-600">{companyInfo.emails.join(" | ")}</p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                <p className="text-gray-600">{companyInfo.phones.join(" / ")}</p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                <p className="text-gray-600">
                  Corporate: {companyInfo.corporateAddress}
                  <br />
                  Registered: {companyInfo.registeredAddress}
                </p>
              </div>
            </div>
            <div className="pt-8">
              <Link href="/contact">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white h-12 px-8">
                  Contact Privacy Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
