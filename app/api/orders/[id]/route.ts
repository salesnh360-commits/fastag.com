import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 })

    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId VARCHAR(64) UNIQUE,
        customerName VARCHAR(255),
        customerEmail VARCHAR(255),
        phone VARCHAR(32),
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

    const [oRows] = await db.query(
      "SELECT id, orderId, customerName, customerEmail, phone, payment_method, address, city, state, pincode, totalAmount, status, shipping_provider, orderDate, shipping_shipment_id, shipping_awb, shipping_label_url, shipping_manifest_url, shipping_tracking_url, shipping_courier FROM orders WHERE id = ? LIMIT 1",
      [id]
    )
    const list = oRows as any[]
    if (!list || list.length === 0) return NextResponse.json({ error: "not found" }, { status: 404 })
    const order = list[0]
    const [iRows] = await db.query(
      "SELECT id, name, quantity, price FROM order_items WHERE orderId = ? ORDER BY id ASC",
      [id]
    )
    order.items = iRows
    return NextResponse.json(order)
  } catch (e: any) {
    console.error("order detail error", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
