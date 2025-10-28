import { NextResponse } from "next/server"

export const runtime = "nodejs"

// Simple pincode lookup using India Post public API
// Optionally, you can extend this to use Google Maps if GOOGLE_MAPS_API_KEY is set.

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ pincode: string }> }
) {
  try {
    const { pincode } = await params
    const pin = (pincode || "").trim()
    if (!/^[1-9]\d{5}$/.test(pin)) {
      return NextResponse.json({ error: "Invalid pincode" }, { status: 400 })
    }

    // India Post API with timeout and no-store cache
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 7000)
    const resp = await fetch(`https://api.postalpincode.in/pincode/${pin}` , { cache: "no-store", signal: controller.signal })
    clearTimeout(t)
    if (!resp.ok) {
      // Return empty offices gracefully instead of failing hard
      return NextResponse.json({ pincode: pin, source: "india-post", count: 0, offices: [] })
    }
    const data = await resp.json()
    const entry = Array.isArray(data) ? data[0] : null
    const offices = Array.isArray(entry?.PostOffice)
      ? entry.PostOffice.map((po: any) => ({
          name: po?.Name || "",
          branchType: po?.BranchType || "",
          district: po?.District || "",
          state: po?.State || "",
          country: po?.Country || "India",
          pincode: po?.Pincode || pin,
          division: po?.Division || "",
          region: po?.Region || "",
          circle: po?.Circle || "",
        }))
      : []

    return NextResponse.json({
      pincode: pin,
      source: "india-post",
      count: offices.length,
      offices,
    })
  } catch (e: any) {
    // Network or timeout errors: respond gracefully with empty list
    return NextResponse.json({ pincode: (e?.pin as string) || undefined, source: "india-post", count: 0, offices: [], note: e?.message || "lookup failed" })
  }
}
