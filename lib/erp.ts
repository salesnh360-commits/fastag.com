// lib/erp.ts
type HeadersDict = Record<string, string>

function baseUrl() {
  const raw = process.env.ERP_BASE_URL || ""
  return raw.replace(/\/$/, "")
}

function buildHeaders(extra?: HeadersDict): HeadersDict {
  const headers: HeadersDict = { "Content-Type": "application/json" }

  const apiKey = process.env.ERP_API_KEY || process.env.ERP_TOKEN
  const headerName = process.env.ERP_AUTH_HEADER || ""
  const scheme = (process.env.ERP_AUTH_SCHEME || "").toLowerCase()

  if (apiKey) {
    if (headerName) {
      headers[headerName] = apiKey
    } else if (scheme === "basic") {
      headers["Authorization"] = `Basic ${apiKey}`
    } else if (scheme === "bearer" || !scheme) {
      headers["Authorization"] = `Bearer ${apiKey}`
    }
  }

  return { ...(extra || {}), ...headers }
}

function tryParse<T = any>(t: string): T | string {
  try { return JSON.parse(t) as T } catch { return t }
}

export async function sendLeadToErp(payload: {
  name: string
  phone: string
  place?: string | null
  vehicleRegNo?: string | null
  product?: string | null
  notes?: string | null
}) {
  const base = baseUrl()
  const path = (process.env.ERP_LEADS_ENDPOINT || "/leads").replace(/^\//, "")
  if (!base) return { skipped: true, reason: "ERP_BASE_URL not set" }

  const url = `${base}/${path}`
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      place: payload.place || undefined,
      vehicleRegNo: payload.vehicleRegNo || undefined,
      product: payload.product || undefined,
      notes: payload.notes || undefined,
      source: "website",
      type: "lead",
    }),
  })
  const text = await res.text().catch(() => "")
  const data = tryParse(text)
  if (!res.ok) throw new Error(`ERP lead failed ${res.status}: ${typeof data === 'string' ? data.slice(0,180) : JSON.stringify(data).slice(0,180)}`)
  return { ok: true, data }
}

export async function sendOrderToErp(payload: {
  orderId: string
  customerName?: string
  customerEmail?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  totalAmount?: number
  paymentMethod?: string
  items?: Array<{ name?: string; quantity?: number; price?: number }>
  docs?: Array<{ doc_type?: string; url?: string }>
}) {
  const base = baseUrl()
  const path = (process.env.ERP_ORDERS_ENDPOINT || "/orders").replace(/^\//, "")
  if (!base) return { skipped: true, reason: "ERP_BASE_URL not set" }

  const url = `${base}/${path}`
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      orderId: payload.orderId,
      customer: {
        name: payload.customerName,
        email: payload.customerEmail,
        phone: payload.phone,
      },
      shippingAddress: {
        address: payload.address,
        city: payload.city,
        state: payload.state,
        pincode: payload.pincode,
      },
      paymentMethod: payload.paymentMethod || "Prepaid",
      totalAmount: payload.totalAmount || 0,
      items: payload.items || [],
      documents: (payload.docs || []).map(d => ({ type: d.doc_type, url: d.url })),
      source: "website",
    }),
  })
  const text = await res.text().catch(() => "")
  const data = tryParse(text)
  if (!res.ok) throw new Error(`ERP order failed ${res.status}: ${typeof data === 'string' ? data.slice(0,180) : JSON.stringify(data).slice(0,180)}`)
  return { ok: true, data }
}

export async function sendOrderUpdateToErp(payload: {
  id?: number
  orderId?: string
  newStatus?: string
  provider?: string
  shipping?: {
    shipment_id?: string | null
    awb?: string | null
    tracking_url?: string | null
    courier?: string | null
  }
}) {
  const base = baseUrl()
  const templated = process.env.ERP_ORDER_UPDATE_ENDPOINT || "/orders/{orderId}/status"
  if (!base) return { skipped: true, reason: "ERP_BASE_URL not set" }

  const path = templated
    .replace(/^\//, "")
    .replace("{orderId}", encodeURIComponent(payload.orderId || ""))

  const url = `${base}/${path}`
  const res = await fetch(url, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify({
      id: payload.id,
      orderId: payload.orderId,
      status: payload.newStatus,
      provider: payload.provider,
      shipping: payload.shipping,
    }),
  })
  const text = await res.text().catch(() => "")
  const data = tryParse(text)
  if (!res.ok) throw new Error(`ERP order update failed ${res.status}: ${typeof data === 'string' ? data.slice(0,180) : JSON.stringify(data).slice(0,180)}`)
  return { ok: true, data }
}

