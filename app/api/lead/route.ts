import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/db"
import { sendLeadToErp } from "@/lib/erp"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, place, vehicleRegNo, product, notes } = body || {}

    const digits = String(phone || "").replace(/\D/g, "")
    const phone10 = digits.slice(-10)
    const validPhone = /^[6-9][0-9]{9}$/.test(phone10)

    if (!name || !validPhone) {
      return NextResponse.json(
        { success: false, message: "Valid name and 10-digit mobile number are required" },
        { status: 400 }
      )
    }
    const phoneNormalized = phone10

    // 1) Save lead locally (non-fatal if fails)
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(64) NOT NULL,
          city VARCHAR(128),
          vehicle_reg_no VARCHAR(64),
          product VARCHAR(128),
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `)

      // Ensure new column exists if table was created earlier without it
      try { await db.query(`ALTER TABLE leads ADD COLUMN vehicle_reg_no VARCHAR(64) NULL`) } catch {}

      await db.query(
        `INSERT INTO leads (name, phone, city, vehicle_reg_no, product, notes) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, phoneNormalized, place ?? null, vehicleRegNo ?? null, product ?? null, notes ?? null]
      )
    } catch (e) {
      console.warn("lead: local save failed", e)
    }

    // 2) Forward to Tickets API
    let ticketResponse: any = null
    try {
      const TICKETS_API_URL = (process.env.TICKETS_API_URL || "https://nh360-self.vercel.app/api/tickets").replace(/\/+$/, "")
      const TICKETS_API_KEY = process.env.TICKETS_API_KEY

      const payload = {
        subject: product || "New FASTag",
        phone: phoneNormalized,
        customer_name: name,
        details: `Lead from website${product ? `, Product: ${product}` : ""}${place ? `, Place: ${place}` : ""}${vehicleRegNo ? `, Vehicle Reg No: ${vehicleRegNo}` : ""}${notes ? `, Notes: ${notes}` : ""}`,
        lead_received_from: "website",
        status: "waiting",
        kyv_status: "kyv_pending_approval",
        vehicle_reg_no: vehicleRegNo || "",
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (TICKETS_API_KEY) {
        headers["x-api-key"] = TICKETS_API_KEY
      }

      const res = await fetch(TICKETS_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        ticketResponse = await res.json()
      } else {
        const errTxt = await res.text().catch(() => "")
        console.warn("lead: tickets api non-200", res.status, errTxt.slice(0, 200))
        ticketResponse = {
          error: true,
          status: res.status,
          location: res.headers.get("location"),
          message: errTxt.slice(0, 200),
        }
      }
    } catch (e) {
      console.warn("lead: tickets api failed", e)
    }

    // 3) Forward to ERP (optional)
    let erpResult: any = null
    try {
      const erp = await sendLeadToErp({
        name,
        phone: phoneNormalized,
        place: place ?? null,
        vehicleRegNo: vehicleRegNo ?? null,
        product: product ?? null,
        notes: notes ?? null,
      })
      erpResult = erp
    } catch (e) {
      console.warn("lead: erp forward failed", e)
      erpResult = { error: true }
    }

    // 4) Email notification (optional)
    try {
      const {
        SMTP_HOST,
        SMTP_PORT = "587",
        SMTP_SECURE = "false",
        SMTP_USER,
        SMTP_PASS,
        SMTP_FROM = "NH360 FASTag <no-reply@nh360fastag.com>",
        SALES_EMAIL = "sales@nh360fastag.com",
      } = process.env as Record<string, string | undefined>

      if (SMTP_USER && SMTP_PASS) {
        const transporter = nodemailer.createTransport(
          SMTP_HOST
            ? {
                host: SMTP_HOST,
                port: Number(SMTP_PORT),
                secure: SMTP_SECURE === "true",
                auth: { user: SMTP_USER, pass: SMTP_PASS },
              }
            : {
                service: "gmail",
                auth: { user: SMTP_USER, pass: SMTP_PASS },
              }
        )

        try { await transporter.verify() } catch {}

        const html = `
          <h2>New FASTag Lead</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Phone:</b> ${phoneNormalized}</p>
          ${place ? `<p><b>City/Place:</b> ${place}</p>` : ""}
          ${vehicleRegNo ? `<p><b>Vehicle Reg No:</b> ${vehicleRegNo}</p>` : ""}
          ${product ? `<p><b>Product:</b> ${product}</p>` : ""}
          ${notes ? `<p><b>Notes:</b> ${notes}</p>` : ""}
          <p>— NH360 FASTag website</p>
        `

        await transporter.sendMail({
          from: SMTP_FROM,
          to: SALES_EMAIL || "sales@nh360fastag.com",
          subject: `New FASTag Lead - ${name}`,
          html,
        })
      } else {
        console.info("lead: SMTP credentials missing; email notification skipped")
      }
    } catch (mailErr) {
      console.warn("lead: email send failed", mailErr)
    }

    // 5) WhatsApp notification (optional: Meta Cloud API or Twilio)
    try {
      const env = process.env as Record<string, string | undefined>
      const provider = (env.WHATSAPP_PROVIDER || "meta").toLowerCase() // "meta" or "twilio"
      const to = env.WHATSAPP_TO // E.g., "+91XXXXXXXXXX"

      const text = [
        `New FASTag Lead`,
        `Name: ${name}`,
        `Phone: ${phoneNormalized}`,
        place ? `Place: ${place}` : null,
        vehicleRegNo ? `Vehicle: ${vehicleRegNo}` : null,
        product ? `Product: ${product}` : null,
        notes ? `Notes: ${notes}` : null,
      ].filter(Boolean).join("\n")

      if (to) {
        if (provider === "twilio") {
          const sid = env.TWILIO_SID
          const auth = env.TWILIO_AUTH_TOKEN
          const from = env.TWILIO_WHATSAPP_FROM // e.g., "whatsapp:+14155238886"
          if (sid && auth && from) {
            const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`
            const body = new URLSearchParams({
              From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
              To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
              Body: text,
            })
            const res = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(`${sid}:${auth}`).toString("base64"),
              },
              body: body.toString(),
            })
            if (!res.ok) {
              const t = await res.text().catch(() => "")
              console.warn("lead: twilio whatsapp failed", res.status, t.slice(0, 180))
            }
          } else {
            console.info("lead: Twilio WhatsApp env missing; skipping")
          }
        } else {
          // Meta WhatsApp Cloud API
          const token = env.WHATSAPP_TOKEN
          const phoneId = env.WHATSAPP_PHONE_ID
          if (token && phoneId) {
            const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`
            const template = env.WHATSAPP_TEMPLATE
            const lang = env.WHATSAPP_TEMPLATE_LANG || "en_US"
            const payload = template
              ? {
                  messaging_product: "whatsapp",
                  to,
                  type: "template",
                  template: {
                    name: template,
                    language: { code: lang },
                    components: [
                      {
                        type: "body",
                        parameters: [{ type: "text", text }],
                      },
                    ],
                  },
                }
              : {
                  messaging_product: "whatsapp",
                  to,
                  type: "text",
                  text: { body: text },
                }
            const res = await fetch(url, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            })
            if (!res.ok) {
              const t = await res.text().catch(() => "")
              console.warn("lead: meta whatsapp failed", res.status, t.slice(0, 180))
            }
          } else {
            console.info("lead: Meta WhatsApp env missing; skipping")
          }
        }
      } else {
        console.info("lead: WHATSAPP_TO not set; skipping WhatsApp notify")
      }
    } catch (waErr) {
      console.warn("lead: whatsapp notify failed", waErr)
    }

    return NextResponse.json({
      success: true,
      forwardedToTickets: ticketResponse && ticketResponse.error !== true,
      ticket: ticketResponse && ticketResponse.error !== true ? ticketResponse : null,
      forwardedToErp: erpResult && !erpResult.error && !erpResult.skipped ? true : false,
      erp: erpResult && !erpResult.error ? erpResult : null,
      ticketsDebug: ticketResponse && ticketResponse.error === true
        ? {
            url: (process.env.TICKETS_API_URL || "https://nh360-self.vercel.app/api/tickets").replace(/\/+$/, ""),
            auth: "x-api-key",
            remoteStatus: ticketResponse.status ?? null,
            remoteLocation: ticketResponse.location ?? null,
            message: ticketResponse.message ?? undefined,
          }
        : {
            url: (process.env.TICKETS_API_URL || "https://nh360-self.vercel.app/api/tickets").replace(/\/+$/, ""),
            auth: "x-api-key",
          },
    })
  } catch (e: any) {
    console.error("lead error", e)
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
