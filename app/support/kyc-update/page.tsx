"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function KycUpdatePage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setErr(null)
    setDone(null)
    try {
      const payload = {
        name: String(formData.get("name") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        place: String(formData.get("city") || "").trim(),
        vehicleRegNo: String(formData.get("vehicle") || "").trim(),
        product: "KYC Update",
        notes: [
          `Issuer: ${String(formData.get("issuer") || "").trim()}`,
          `KYC Type: ${String(formData.get("kycType") || "").trim()}`,
          `Existing Issue: ${String(formData.get("issue") || "").trim()}`,
        ].join(" | "),
      }
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const j = await res.json().catch(() => null)
      if (!res.ok || !j?.success) throw new Error(j?.message || "Failed to submit")
      setDone("Request submitted. Our team will contact you shortly.")
    } catch (e: any) {
      setErr(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-4"><Link href="/support" className="text-orange-700 hover:text-orange-600 text-sm">← All Support</Link></div>
          <h1 className="text-3xl font-extrabold mb-2">KYC Update</h1>
          <p className="text-gray-600 mb-6">Update KYC or change vehicle/owner details for your FASTag.</p>
          <Card className="border-orange-200 bg-white">
            <CardContent className="p-6">
              <form action={onSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input id="phone" name="phone" placeholder="10-digit mobile" inputMode="numeric" required />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" placeholder="City / Place" />
                  </div>
                  <div>
                    <Label htmlFor="vehicle">Vehicle Number</Label>
                    <Input id="vehicle" name="vehicle" placeholder="e.g., KA01AB1234" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issuer">FASTag Issuer</Label>
                    <Input id="issuer" name="issuer" placeholder="Bank / Issuer" />
                  </div>
                  <div>
                    <Label htmlFor="kycType">KYC Type</Label>
                    <Input id="kycType" name="kycType" placeholder="MIN/Full/Change in owner" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="issue">Describe the issue</Label>
                  <Textarea id="issue" name="issue" placeholder="Brief description (e.g., Update address, RC name change)" />
                </div>
                {err && <div className="text-red-600 text-sm">{err}</div>}
                {done && <div className="text-green-600 text-sm">{done}</div>}
                <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
