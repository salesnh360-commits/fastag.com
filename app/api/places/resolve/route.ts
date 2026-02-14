import { NextResponse } from "next/server"

type ResolveBody = {
  url?: string
  query?: string
}

export async function POST(req: Request) {
  try {
    const body: ResolveBody = await req.json().catch(() => ({} as any))
    let raw = (body.url || body.query || "").trim()
    if (!raw) return NextResponse.json({ error: "Missing url or query" }, { status: 400 })

    // Resolve shortened URLs
    if (isShortUrl(raw)) {
      const resolved = await resolveShortUrl(raw)
      if (resolved) raw = resolved
    }

    const normalized = normalizeInput(raw)
    const key = process.env.GOOGLE_MAPS_API_KEY

    // Prefer Google Places if key is available
    if (key) {
      // Use Find Place From Text to get place_id
      const fpUrl = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json")
      fpUrl.searchParams.set("input", normalized)
      fpUrl.searchParams.set("inputtype", "textquery")
      fpUrl.searchParams.set("fields", "place_id,name,formatted_address,geometry")
      fpUrl.searchParams.set("key", key)
      const fp = await fetch(fpUrl, { cache: "no-store" })
      const fpj = await fp.json()
      const cand = fpj?.candidates?.[0]
      if (cand?.place_id) {
        // Place details for address components
        const detUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json")
        detUrl.searchParams.set("place_id", cand.place_id)
        detUrl.searchParams.set("fields", "place_id,name,formatted_address,geometry,address_component,url,formatted_phone_number")
        detUrl.searchParams.set("key", key)
        const det = await fetch(detUrl, { cache: "no-store" })
        const dj = await det.json()
        const r = dj?.result
        if (r) {
          const loc = r.geometry?.location
          const comps: any[] = r.address_components || []
          const byType = (t: string) => comps.find((c) => Array.isArray(c.types) && c.types.includes(t))
          const city = byType("locality")?.long_name || byType("administrative_area_level_2")?.long_name || undefined
          const state = byType("administrative_area_level_1")?.long_name || undefined
          const pincode = byType("postal_code")?.long_name || undefined
          const gbpUrl = r.url || (r.place_id && loc ? `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}&query_place_id=${r.place_id}` : undefined)
          return NextResponse.json({
            name: r.name || cand.name,
            address: r.formatted_address || cand.formatted_address,
            city, state, pincode,
            lat: loc?.lat, lng: loc?.lng,
            phone: r.formatted_phone_number,
            gbp_url: gbpUrl,
            place_id: r.place_id,
            source: "google",
          })
        }
      }
    }

    // Fallback: try to parse coordinates from URL and reverse geocode with Nominatim
    // Try original 'raw' URL first as it might contain coords that normalizeInput striped
    let fromUrl = tryParseLatLngFromString(raw)
    // If not found, try normalized
    if (!fromUrl) fromUrl = tryParseLatLngFromString(normalized)

    if (fromUrl) {
      const rev = await nominatimReverse(fromUrl.lat, fromUrl.lng)
      // Attempt to extract name from URL if Nominatim name is generic (like "Road name")
      let name = rev?.name
      if (raw.includes("/place/")) {
        const uName = extractNameFromMapsUrl(raw)
        // If extracted name is better than Nominatim's (which might be just address), prefer it
        // Or if Nominatim failed completely but we have coords
        if (uName) name = uName
      }
      return NextResponse.json({
        ...rev,
        name: name || rev?.name,
        lat: fromUrl.lat,
        lng: fromUrl.lng,
        gbp_url: makeMapsLink(fromUrl.lat, fromUrl.lng),
        source: "nominatim"
      })
    }

    // Fallback: forward geocode text query (normalized)
    const fwd = await nominatimSearch(normalized)
    if (fwd) {
      return NextResponse.json({ ...fwd, gbp_url: makeMapsLink(fwd.lat, fwd.lng), source: "nominatim" })
    }

    return NextResponse.json({ error: "No results found" }, { status: 404 })
  } catch (e) {
    console.error("Resolve error:", e)
    return NextResponse.json({ error: "Resolve failed" }, { status: 500 })
  }
}

function isShortUrl(s: string) {
  return s.match(/https?:\/\/(maps\.app\.goo\.gl|goo\.gl|g\.co|bit\.ly|t\.co)\//)
}

async function resolveShortUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "manual" })
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location")
      if (loc) return loc
    }
    // If HEAD fails to give location, try GET following redirects
    const res2 = await fetch(url, { method: "GET" })
    return res2.url
  } catch {
    return null
  }
}

function extractNameFromMapsUrl(s: string): string | null {
  try {
    const u = new URL(s)
    const idx = u.pathname.indexOf("/place/")
    if (idx >= 0) {
      const rest = u.pathname.slice(idx + 7)
      const seg = rest.split("/")[0]
      if (seg) return decodeURIComponent(seg.replace(/\+/g, " "))
    }
  } catch { }
  return null
}

function tryParseLatLngFromString(s: string): { lat: number; lng: number } | null {
  try {
    // 1. Google Maps Data parameters !3d...!4d... (most accurate for exact pin)
    const d3 = s.match(/!3d(-?\d+\.\d+)/)
    const d4 = s.match(/!4d(-?\d+\.\d+)/)
    if (d3 && d4) return { lat: Number(d3[1]), lng: Number(d4[1]) }

    // 2. Query param q=lat,lng
    const q = s.match(/[?&](?:q|query)=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (q) return { lat: Number(q[1]), lng: Number(q[2]) }

    // 3. Viewport @lat,lng (fallback)
    const at = s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (at) return { lat: Number(at[1]), lng: Number(at[2]) }
  } catch { }
  return null
}

function normalizeInput(s: string): string {
  try {
    const u = new URL(s)
    // Handle Google Search URLs: use `q` param
    if (u.hostname.includes("google.") && u.pathname === "/search") {
      const q = u.searchParams.get("q")
      if (q) return q
    }
    // Handle Google Maps share links: prefer `query` or `q`
    if (u.hostname.includes("google.")) {
      const query = u.searchParams.get("query") || u.searchParams.get("q")
      if (query) return query
      // Extract name from /maps/place/<name>/...
      const name = extractNameFromMapsUrl(s)
      if (name) return name
    }
    // g.page vanity URLs -> take path component
    if (u.hostname === "g.page" && u.pathname && u.pathname !== "/") {
      return decodeURIComponent(u.pathname.slice(1).replace(/\+/g, " "))
    }
  } catch {
    // not a URL: return as-is
  }
  return s
}

async function nominatimReverse(lat: number, lon: number) {
  const headers = { "User-Agent": "nh360-fastag/1.0 (support@nh360fastag.com)" }
  // Add extratags=1 to get phone number if available
  const u = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&format=jsonv2&extratags=1`
  const r = await fetch(u, { headers, cache: "no-store" })
  const j = await r.json().catch(() => null as any)
  if (!j) return null
  const addr = j.address || {}
  const name = j.name || j.display_name?.split(",")[0]
  const address = j.display_name
  const city = addr.city || addr.town || addr.village || addr.county
  const state = addr.state
  const pincode = addr.postcode
  const extra = j.extratags || {}
  const phone = extra.phone || extra["contact:phone"] || extra["contact:mobile"]
  return { name, address, city, state, pincode, phone }
}

async function nominatimSearch(q: string) {
  const headers = { "User-Agent": "nh360-fastag/1.0 (support@nh360fastag.com)" }
  // Add extratags=1
  const u = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=jsonv2&addressdetails=1&limit=1&extratags=1`
  const r = await fetch(u, { headers, cache: "no-store" })
  const arr = await r.json().catch(() => [])
  const first = Array.isArray(arr) ? arr[0] : null
  if (!first) return null
  const lat = Number(first.lat)
  const lng = Number(first.lon)
  const address = first.display_name
  const addr = first.address || {}
  const name = first.name || first.address?.amenity || first.display_name?.split(",")[0]
  const city = addr.city || addr.town || addr.village || addr.county
  const state = addr.state
  const pincode = addr.postcode
  const extra = first.extratags || {}
  const phone = extra.phone || extra["contact:phone"] || extra["contact:mobile"]
  return { name, address, city, state, pincode, lat, lng, phone }
}

function makeMapsLink(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}
