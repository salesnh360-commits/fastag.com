// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendOrderToErp, sendOrderUpdateToErp } from "@/lib/erp"
import { Shiprocket } from "@/lib/shiprocket"

export async function GET() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId VARCHAR(64) UNIQUE,
        customerName VARCHAR(255),
        customerEmail VARCHAR(255),
        phone VARCHAR(32),
        payment_method VARCHAR(16) DEFAULT 'Prepaid',
        address TEXT,
        city VARCHAR(128),
        state VARCHAR(128),
        pincode VARCHAR(16),
        totalAmount INT,
        status VARCHAR(32) DEFAULT 'new',
        shipping_provider VARCHAR(32) DEFAULT 'unassigned',
        orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId INT NOT NULL,
        name VARCHAR(255),
        quantity INT,
        price INT,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_shipment_id VARCHAR(64) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_awb VARCHAR(64) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_label_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_manifest_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_tracking_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_courier VARCHAR(128) NULL") } catch {}

    const [orders] = await db.query("SELECT * FROM orders ORDER BY orderDate DESC")

    for (const order of orders as any[]) {
      const [items] = await db.query("SELECT * FROM order_items WHERE orderId = ?", [order.id])
      order.items = items
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, newStatus, provider } = await req.json();

    if (!id && typeof id !== 'number') {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }
    // Ensure shipping columns exist for status/provider updates
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_shipment_id VARCHAR(64) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_awb VARCHAR(64) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_label_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_manifest_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_tracking_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_courier VARCHAR(128) NULL") } catch {}

    const fields: string[] = []
    const values: any[] = []
    if (typeof newStatus === 'string') { fields.push("status = ?"); values.push(newStatus) }
    if (typeof provider === 'string') { fields.push("shipping_provider = ?"); values.push(String(provider).toLowerCase()) }
    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }
    values.push(id)
    await db.query(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`, values)

    // Auto-create Shiprocket shipment when provider becomes shiprocket, or if status updated while already set.
    let created: any = null
    let shipErr: string | null = null
    try {
      const [rows] = await db.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id])
      const list = rows as any[]
      const o = list?.[0]
      if (o && String(o.shipping_provider).toLowerCase() === 'shiprocket' && !o.shipping_shipment_id) {
        const [iRows] = await db.query("SELECT name, quantity, price FROM order_items WHERE orderId = ?", [id])
        const items = (iRows as any[]) || []
        const payload: any = {
          order_id: o.orderId,
          order_date: new Date(o.orderDate || Date.now()).toISOString(),
          billing_customer_name: String(o.customerName || '').slice(0, 40),
          billing_address: String(o.address || '').slice(0, 200),
          billing_city: o.city || '',
          billing_pincode: o.pincode || '',
          billing_state: o.state || '',
          billing_email: o.customerEmail || 'na@example.com',
          billing_phone: o.phone || '0000000000',
          payment_method: (o.payment_method === 'COD' ? 'COD' : 'Prepaid') as 'Prepaid' | 'COD',
          sub_total: Number(o.totalAmount || 0),
          length: 10,
          breadth: 10,
          height: 2,
          weight: 0.5,
          order_items: items.map((it) => ({ name: it.name || 'Item', units: Number(it.quantity) || 1, selling_price: Number(it.price) || 0 })),
        }
        if (payload.payment_method === 'COD') payload.collectable_amount = Number(o.totalAmount || 0)
        created = await Shiprocket.createOrder(payload)
        let shipment_id = created?.shipment_id || created?.data?.shipment_id || null
        // Attempt AWB assignment if not present
        if (shipment_id && !(created?.awb_code || created?.data?.awb_code)) {
          try {
            const awbResp = await Shiprocket.assignAWB(Number(shipment_id))
            // Some responses wrap data differently
            const awbCode = awbResp?.response?.data?.awb_code || awbResp?.data?.awb_code || awbResp?.awb_code || null
            if (awbCode) {
              created.awb_code = awbCode
            }
          } catch (e) {
            console.warn('shiprocket awb assign failed', e)
          }
        }
        const awb = created?.awb_code || created?.data?.awb_code || null
        const label = created?.label_url || created?.data?.label_url || null
        const manifest = created?.manifest_url || created?.data?.manifest_url || null
        const tracking = created?.tracking_url || created?.data?.tracking_url || (awb ? `https://shiprocket.co/tracking/${awb}` : null)
        const courier = created?.courier_company || created?.data?.courier_company || null
        await db.query(
          "UPDATE orders SET status = 'processing', shipping_shipment_id = ?, shipping_awb = ?, shipping_label_url = ?, shipping_manifest_url = ?, shipping_tracking_url = ?, shipping_courier = ? WHERE id = ?",
          [shipment_id, awb, label, manifest, tracking, courier, id]
        )
      }
    } catch (e: any) {
      shipErr = e?.message || String(e)
      console.warn('shiprocket auto-create failed', e)
    }

    try {
      const [rows] = await db.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id])
      const o = (rows as any[])?.[0]
      if (o) {
        await sendOrderUpdateToErp({
          id,
          orderId: o.orderId,
          newStatus: typeof newStatus === 'string' ? newStatus : undefined,
          provider: typeof provider === 'string' ? String(provider).toLowerCase() : undefined,
          shipping: created ? {
            shipment_id: created?.shipment_id || created?.data?.shipment_id || null,
            awb: created?.awb_code || created?.data?.awb_code || null,
            tracking_url: created?.tracking_url || created?.data?.tracking_url || (created?.awb_code ? `https://shiprocket.co/tracking/${created?.awb_code}` : null),
            courier: created?.courier_company || created?.data?.courier_company || null,
          } : undefined,
        })
      }
    } catch (e) {
      console.warn('erp order update failed', e)
    }

    return NextResponse.json({ success: true, shiprocket: created ? { shipment_id: created?.shipment_id || created?.data?.shipment_id || null, awb: created?.awb_code || created?.data?.awb_code || null } : null, shiprocketError: shipErr })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      orderId,
      customerName,
      customerEmail,
      phone,
      address,
      city,
      state,
      pincode,
      totalAmount,
      items = [],
      docs = [],
    } = body || {}

    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId VARCHAR(64) UNIQUE,
        customerName VARCHAR(255),
        customerEmail VARCHAR(255),
        phone VARCHAR(32),
        payment_method VARCHAR(16) DEFAULT 'Prepaid',
        address TEXT,
        city VARCHAR(128),
        state VARCHAR(128),
        pincode VARCHAR(16),
        totalAmount INT,
        status VARCHAR(32) DEFAULT 'new',
        shipping_provider VARCHAR(32) DEFAULT 'unassigned',
        orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId INT NOT NULL,
        name VARCHAR(255),
        quantity INT,
        price INT,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId INT NOT NULL,
        doc_type VARCHAR(64) NOT NULL,
        url VARCHAR(1024) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_shipment_id VARCHAR(64) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_awb VARCHAR(64) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_label_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_manifest_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_tracking_url VARCHAR(1024) NULL") } catch {}
    try { await db.query("ALTER TABLE orders ADD COLUMN shipping_courier VARCHAR(128) NULL") } catch {}

    const [result] = await db.query(
      `INSERT INTO orders (orderId, customerName, customerEmail, phone, payment_method, address, city, state, pincode, totalAmount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, customerName, customerEmail, phone, (body.paymentMethod || 'Prepaid'), address, city, state, pincode, totalAmount]
    )
    // @ts-ignore
    const id = result.insertId as number

    if (Array.isArray(items)) {
      for (const it of items) {
        const { name, quantity, price } = it || {}
        await db.query(
          `INSERT INTO order_items (orderId, name, quantity, price) VALUES (?, ?, ?, ?)`,
          [id, name || '', Number(quantity) || 1, Number(price) || 0]
        )
      }
    }

    // Save any uploaded document URLs mapped to this order
    if (Array.isArray(docs)) {
      for (const d of docs) {
        const doc_type = (d?.doc_type || d?.type || '').toString().toLowerCase()
        const url = (d?.url || '').toString()
        if (!doc_type || !url) continue
        try {
          await db.query(
            `INSERT INTO order_documents (orderId, doc_type, url) VALUES (?, ?, ?)`,
            [id, doc_type, url]
          )
        } catch (e) {
          console.warn('order create: document save failed', e)
        }
      }
    }

    try {
      await sendOrderToErp({
        orderId,
        customerName,
        customerEmail,
        phone,
        address,
        city,
        state,
        pincode,
        totalAmount,
        paymentMethod: body.paymentMethod || 'Prepaid',
        items,
        docs,
      })
    } catch (e) {
      console.warn('erp order create failed', e)
    }

    return NextResponse.json({ success: true, id })
  } catch (e: any) {
    console.error('order create error', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
 
