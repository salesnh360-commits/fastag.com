import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

async function ensureShopsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS shops (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address TEXT NULL,
      city VARCHAR(128) NULL,
      state VARCHAR(128) NULL,
      pincode VARCHAR(16) NULL,
      contact_name VARCHAR(255) NULL,
      phone VARCHAR(32) NULL,
      email VARCHAR(255) NULL,
      status VARCHAR(32) DEFAULT 'active',
      lat DECIMAL(9,6) NULL,
      lng DECIMAL(9,6) NULL,
      gbp_url VARCHAR(1024) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  // Best-effort schema upgrades if the table already exists
  await Promise.all([
    db.query("ALTER TABLE shops ADD COLUMN lat DECIMAL(9,6) NULL").catch(() => {}),
    db.query("ALTER TABLE shops ADD COLUMN lng DECIMAL(9,6) NULL").catch(() => {}),
    db.query("ALTER TABLE shops ADD COLUMN gbp_url VARCHAR(1024) NULL").catch(() => {}),
  ])
}

export async function GET() {
  try {
    await ensureShopsTable();
    const [rows] = await db.query("SELECT * FROM shops ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureShopsTable();
    const body = await req.json();
    const { name, address, city, state, pincode, contact_name, phone, email, status, lat, lng, gbp_url } = body || {};
    if (!name || !String(name).trim()) return NextResponse.json({ error: "Missing shop name" }, { status: 400 });

    const [result] = await db.query(
      `INSERT INTO shops (name, address, city, state, pincode, contact_name, phone, email, status, lat, lng, gbp_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, state, pincode, contact_name, phone, email, status || "active", lat, lng, gbp_url]
    ) as [ResultSetHeader, any];
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating shop:", error);
    return NextResponse.json({ error: "Failed to create shop" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await ensureShopsTable();
    const body = await req.json();
    const { id, name, address, city, state, pincode, contact_name, phone, email, status, lat, lng, gbp_url } = body || {};
    if (!id) return NextResponse.json({ error: "Missing shop id" }, { status: 400 });

    await db.query(
      `UPDATE shops SET name=?, address=?, city=?, state=?, pincode=?, contact_name=?, phone=?, email=?, status=?, lat=?, lng=?, gbp_url=? WHERE id=?`,
      [name, address, city, state, pincode, contact_name, phone, email, status, lat, lng, gbp_url, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json({ error: "Failed to update shop" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureShopsTable();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing shop id" }, { status: 400 });
    await db.query("DELETE FROM shops WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return NextResponse.json({ error: "Failed to delete shop" }, { status: 500 });
  }
}
