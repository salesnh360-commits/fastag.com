import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/db"
import NewBlogForm from "./_new-blog-form"
import AdminBlogsList from "@/components/admin/blogs-list"
import AdminOrdersTable from "@/components/admin/orders-table"
import ProductsManager from "@/components/admin/products-manager"
import ShopsManager from "@/components/admin/shops-manager"
import BannersManager from "@/components/admin/banners-manager"
import MenusManager from "@/components/admin/menus-manager"

export const metadata: Metadata = {
  title: "Admin Dashboard | NH360",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  // Fetch tickets from external system (no-store for live view)
  const TICKETS_API_URL = (process.env.TICKETS_API_URL || "https://nh360-self.vercel.app/api/tickets").replace(/\/+$/, "")
  const token = process.env.TICKETS_API_TOKEN
  const basicUser = process.env.TICKETS_BASIC_USER
  const basicPass = process.env.TICKETS_BASIC_PASS
  const cookie = process.env.TICKETS_COOKIE
  const csrfHeader = process.env.TICKETS_CSRF_HEADER
  const csrfValue = process.env.TICKETS_CSRF_VALUE
  const referer = process.env.TICKETS_REFERER
  let tickets: any[] = []
  try {
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    } else if (basicUser && basicPass) {
      const basic = Buffer.from(`${basicUser}:${basicPass}`).toString("base64")
      headers["Authorization"] = `Basic ${basic}`
    }
    if (cookie) headers["Cookie"] = cookie
    if (csrfHeader && csrfValue) headers[csrfHeader] = csrfValue
    if (referer) headers["Referer"] = referer

    const res = await fetch(TICKETS_API_URL, { cache: "no-store", headers })
    if (res.ok) {
      const data = await res.json()
      tickets = Array.isArray(data) ? data : Array.isArray((data as any)?.data) ? (data as any).data : []
    }
  } catch (e) {
    // ignore, show empty state
  }

  // Fallback: local leads when remote tickets unavailable
  let localLeads: any[] = []
  try {
    const [rows] = await db.query("SELECT id, name, phone, city, vehicle_reg_no, product, created_at FROM leads ORDER BY created_at DESC LIMIT 100")
    localLeads = rows as any[]
  } catch {}

  // Load recent blog posts for management tab
  let adminBlogs: any[] = []
  try {
    const [rows] = await db.query(
      "SELECT slug, title, excerpt, created_at FROM blogs ORDER BY created_at DESC LIMIT 100"
    )
    adminBlogs = rows as any[]
  } catch {
    try {
      const [rows] = await db.query(
        "SELECT slug, title, excerpt, NULL AS created_at FROM blogs LIMIT 100"
      )
      adminBlogs = rows as any[]
    } catch {}
  }
  // Load orders for Orders tab
  let orders: any[] = []
  try {
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
    const [rows] = await db.query(
      "SELECT id, orderId, customerName, customerEmail, phone, totalAmount, status, shipping_provider, orderDate FROM orders ORDER BY orderDate DESC LIMIT 200"
    )
    orders = rows as any[]
  } catch {}
  const stats = [
    { k: "New Orders", v: "12" },
    { k: "Recharge Tickets", v: "27" },
    { k: "New Leads", v: "9" },
    { k: "Revenue (7d)", v: "₹1.2L" },
  ]

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <section className="py-10">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex items-center justify-end">
            <Button asChild variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/30">
              <Link href="/">Logout</Link>
            </Button>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Quick overview of system metrics.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <Card key={s.k} className="border-orange-900 bg-neutral-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400 font-medium">{s.k}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{s.v}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs: Recharge / Leads / Support */}
          <Card className="border-orange-900 bg-neutral-900">
            <CardHeader className="pb-4">
              <CardTitle className="text-white">Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recharge" className="w-full">
                <TabsList className="bg-black text-gray-300">
                  <TabsTrigger value="recharge">Recharge</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="shops">Shops</TabsTrigger>
                  <TabsTrigger value="banners">Banners</TabsTrigger>
                  <TabsTrigger value="menus">Menus</TabsTrigger>
                  <TabsTrigger value="leads">Leads</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                </TabsList>

                {/* Recharge History */}
                <TabsContent value="recharge">
                  <div className="overflow-hidden rounded-lg border border-orange-900/60">
                    <Table className="text-gray-200">
                      <TableHeader>
                        <TableRow className="bg-black/40">
                          <TableHead className="text-gray-400">Date</TableHead>
                          <TableHead className="text-gray-400">Tag/Vehicle</TableHead>
                          <TableHead className="text-gray-400">Issuer</TableHead>
                          <TableHead className="text-gray-400">Amount</TableHead>
                          <TableHead className="text-gray-400">Method</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Replace with live data when available */}
                        <TableRow>
                          <TableCell className="text-gray-400" colSpan={6}>No recharge records yet.</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Products */}
                <TabsContent value="products">
                  <ProductsManager />
                </TabsContent>

                {/* Shops */}
                <TabsContent value="shops">
                  <ShopsManager />
                </TabsContent>

                {/* Banners */}
                <TabsContent value="banners">
                  <BannersManager />
                </TabsContent>

                {/* Menus */}
                <TabsContent value="menus">
                  <MenusManager />
                </TabsContent>

                {/* Leads from Buy flow */}
                <TabsContent value="leads">
                  <div className="overflow-hidden rounded-lg border border-orange-900/60">
                    <Table className="text-gray-200">
                      <TableHeader>
                        <TableRow className="bg-black/40">
                          <TableHead className="text-gray-400">Ticket No</TableHead>
                          <TableHead className="text-gray-400">Created</TableHead>
                          <TableHead className="text-gray-400">Customer</TableHead>
                          <TableHead className="text-gray-400">Phone</TableHead>
                          <TableHead className="text-gray-400">Subject</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tickets.length === 0 ? (
                          <TableRow>
                            <TableCell className="text-gray-400" colSpan={6}>
                              {localLeads.length === 0 ? (
                                <>No leads captured yet.</>
                              ) : (
                                <>
                                  No remote tickets found. Showing local leads below.
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ) : (
                          tickets.map((t: any) => (
                            <TableRow key={t.id}>
                              <TableCell className="text-gray-300">{t.ticket_no || t.id}</TableCell>
                              <TableCell className="text-gray-300">{t.created_at ? new Date(t.created_at).toLocaleString() : "—"}</TableCell>
                              <TableCell className="text-gray-300">{t.customer_name || "—"}</TableCell>
                              <TableCell className="text-gray-300">{t.phone || "—"}</TableCell>
                              <TableCell className="text-gray-300">{t.subject || "—"}</TableCell>
                              <TableCell className="text-gray-300">{t.status || "—"}</TableCell>
                            </TableRow>
                          ))
                        )}
                        {tickets.length === 0 && localLeads.length > 0 && (
                          localLeads.map((l: any) => (
                            <TableRow key={`local-${l.id}`}>
                              <TableCell className="text-gray-300">—</TableCell>
                              <TableCell className="text-gray-300">{l.created_at ? new Date(l.created_at).toLocaleString() : "—"}</TableCell>
                              <TableCell className="text-gray-300">{l.name || "—"}</TableCell>
                              <TableCell className="text-gray-300">{l.phone || "—"}</TableCell>
                              <TableCell className="text-gray-300">{l.product ? `${l.product}${l.vehicle_reg_no ? ` (${l.vehicle_reg_no})` : ''}` : (l.vehicle_reg_no || "Lead")}</TableCell>
                              <TableCell className="text-gray-300">—</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Orders */}
                <TabsContent value="orders">
                  <AdminOrdersTable orders={orders as any} />
                </TabsContent>

                {/* Blog: Create and manage */}
                <TabsContent value="blog">
                  <div className="space-y-6">
                    <NewBlogForm />
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Manage Posts</h3>
                      <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Link href="/admin/blogs/new">New Post</Link>
                      </Button>
                    </div>
                    {adminBlogs.length === 0 ? (
                      <div className="text-gray-400">No posts yet.</div>
                    ) : (
                      <AdminBlogsList posts={adminBlogs as any} />
                    )}
                  </div>
                </TabsContent>

                {/* Support tickets */}
                <TabsContent value="support">
                  <div className="overflow-hidden rounded-lg border border-orange-900/60">
                    <Table className="text-gray-200">
                      <TableHeader>
                        <TableRow className="bg-black/40">
                          <TableHead className="text-gray-400">Date</TableHead>
                          <TableHead className="text-gray-400">Category</TableHead>
                          <TableHead className="text-gray-400">Detail</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-gray-400" colSpan={4}>No support tickets yet.</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-orange-900 bg-neutral-900">
            <CardHeader>
              <CardTitle className="text-white">Activity</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-400">
              <ul className="list-disc pl-5 space-y-1">
                <li>Latest orders and status changes will appear here.</li>
                <li>Recharge assistance tickets summary.</li>
                <li>Recent leads from Buy/Recharge forms.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
