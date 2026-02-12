import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

async function ensureProductsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price INT NULL,
      original_price INT NULL,
      image_url VARCHAR(1024) NULL,
      description TEXT NULL,
      rating DECIMAL(3,2) DEFAULT 0,
      reviews INT DEFAULT 0,
      category VARCHAR(128) NULL,
      size VARCHAR(64) NULL,
      features JSON NULL,
      warranty VARCHAR(255) NULL,
      specifications JSON NULL,
      detailed_description TEXT NULL,
      benefits JSON NULL,
      technology JSON NULL,
      certifications JSON NULL,
      suitable_for JSON NULL,
      care_instructions JSON NULL,
      why_choose JSON NULL,
      in_stock TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

// GET: List all products
export async function GET() {
  try {
    await ensureProductsTable()
    const [products] = await db.query("SELECT * FROM products ORDER BY created_at DESC");
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(req: Request) {
  try {
    await ensureProductsTable()
    const body = await req.json();
    const {
      name, price, original_price, image_url, description, rating, reviews, category, size,
      features, warranty, specifications, detailed_description, benefits, technology,
      certifications, suitable_for, care_instructions, why_choose, in_stock
    } = body;

    const [result] = await db.query(
      `INSERT INTO products (
        name, price, original_price, image_url, description, rating, reviews, category, size,
        features, warranty, specifications, detailed_description, benefits, technology,
        certifications, suitable_for, care_instructions, why_choose, in_stock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        name, price, original_price, image_url, description, rating, reviews, category, size,
        JSON.stringify(features), warranty, JSON.stringify(specifications), detailed_description,
        JSON.stringify(benefits), JSON.stringify(technology), JSON.stringify(certifications),
        JSON.stringify(suitable_for), JSON.stringify(care_instructions), JSON.stringify(why_choose), in_stock
      ]
    ) as [ResultSetHeader, any];
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// PUT: Update a product
export async function PUT(req: Request) {
  try {
    await ensureProductsTable()
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

    // Build dynamic UPDATE query with only provided fields
    const fields: string[] = [];
    const values: any[] = [];

    // Map of field names to their values
    const fieldMap: Record<string, any> = {
      name: updates.name,
      price: updates.price,
      original_price: updates.original_price,
      image_url: updates.image_url,
      description: updates.description,
      rating: updates.rating,
      reviews: updates.reviews,
      category: updates.category,
      size: updates.size,
      features: updates.features,
      warranty: updates.warranty,
      specifications: updates.specifications,
      detailed_description: updates.detailed_description,
      benefits: updates.benefits,
      technology: updates.technology,
      certifications: updates.certifications,
      suitable_for: updates.suitable_for,
      care_instructions: updates.care_instructions,
      why_choose: updates.why_choose,
      in_stock: updates.in_stock,
    };

    // JSON fields that need stringification
    const jsonFields = new Set([
      'features', 'specifications', 'benefits', 'technology',
      'certifications', 'suitable_for', 'care_instructions', 'why_choose'
    ]);

    // Only include fields that are actually provided
    for (const [field, value] of Object.entries(fieldMap)) {
      if (value !== undefined) {
        fields.push(`${field}=?`);
        // Stringify JSON fields
        if (jsonFields.has(field) && value !== null) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add id as the last parameter for WHERE clause
    values.push(id);

    const query = `UPDATE products SET ${fields.join(', ')} WHERE id=?`;

    await db.query(query, values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE: Delete a product
export async function DELETE(req: Request) {
  try {
    await ensureProductsTable()
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
} 
