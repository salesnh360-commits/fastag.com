import { NextResponse } from "next/server"
import { branches, Branch } from "@/data/branches"

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

    const url = new URL(_req.url)
    const pickupMode = ["1", "true", "yes"].includes((url.searchParams.get("pickup") || "").toLowerCase())
    const radiusKm = Math.max(0.5, Number(url.searchParams.get("radiusKm")) || 5)

    if (pickupMode) {
      // Compute nearby branches (pickup points) within radius
      const pinCoords = await geocodePincode(pin)
      if (!pinCoords) {
        return NextResponse.json({ pincode: pin, source: "pickup", count: 0, offices: [] })
      }

      const withDistance = branches
        .filter((b) => typeof b.lat === "number" && typeof b.lng === "number")
        .map((b) => ({
          branch: b,
          distanceKm: haversineKm(pinCoords.lat, pinCoords.lng, b.lat as number, b.lng as number),
        }))
        .filter((x) => x.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm)

      const offices = withDistance.map(({ branch, distanceKm }) => toOfficeShape(branch, distanceKm))
      return NextResponse.json({ pincode: pin, source: "pickup", count: offices.length, offices })
    }

    // Default: India Post office lookup
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

// --- Helpers ---

function toOfficeShape(b: Branch, distanceKm?: number) {
  return {
    name: b.name,
    branchType: "Pickup Point",
    district: b.city,
    state: b.state,
    country: "India",
    pincode: b.postalCode,
    address: [b.addressLine1, b.addressLine2, b.city, b.state, b.postalCode].filter(Boolean).join(", "),
    slug: b.slug,
    distanceKm: typeof distanceKm === "number" ? Number(distanceKm.toFixed(2)) : undefined,
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // km
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

async function geocodePincode(pin: string): Promise<{ lat: number; lng: number } | null> {
  // Prefer Google if key is available
  const key = process.env.GOOGLE_MAPS_API_KEY
  try {
    if (key) {
      const g = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(pin + ', India')}&key=${key}`, { cache: 'no-store' })
      const gj = await g.json().catch(() => null as any)
      const loc = gj?.results?.[0]?.geometry?.location
      if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
        return { lat: loc.lat, lng: loc.lng }
      }
    }
  } catch {}

  // Fallback to Nominatim (OpenStreetMap)
  try {
    const headers = { 'User-Agent': 'nh360-fastag/1.0 (support@nh360fastag.com)' }
    const u = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pin + ' India')}&format=json&limit=1`
    const r = await fetch(u, { headers, cache: 'no-store' })
    const j = await r.json().catch(() => [])
    const first = Array.isArray(j) ? j[0] : null
    const lat = first ? Number(first.lat) : NaN
    const lon = first ? Number(first.lon) : NaN
    if (isFinite(lat) && isFinite(lon)) return { lat, lng: lon }
  } catch {}
  return null
}
