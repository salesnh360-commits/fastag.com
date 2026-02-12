"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-context"
import TextHoverLogo from "./TextHoverLogo"
import ResizableNavbar from "./ResizableNavbar"

export default function SaasHeader() {
  const [open, setOpen] = useState(false)
  const [auth, setAuth] = useState<{ user: any; role: string } | null>(null)
  const { state, dispatch } = useCart()
  const itemCount = state.items.reduce((n, it) => n + it.quantity, 0)
  // No default static menu - all menus are managed by admin through the database
  const [nav, setNav] = useState<{ href: string; label: string; target?: string; children?: any[] }[]>([])
  const MENU_SLUG = (process.env.NEXT_PUBLIC_MENU_SLUG || "main").toLowerCase()
  const SUB_BUYFASTAG = (process.env.NEXT_PUBLIC_MENU_SUB_BUYFASTAG || "").toLowerCase()

  useEffect(() => {
    let active = true
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then(async (r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!active || !j?.authenticated) return
        setAuth({ user: j.user, role: j.user?.role })
      })
      .catch(() => {})
    // load menu
    fetch(`/api/menus?slug=${encodeURIComponent(MENU_SLUG)}`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (!active || !j) return
        const flat = Array.isArray(j.items) ? j.items.filter((x: any) => x.active) : []
        // Build tree by id/parent_id
        const byId: Record<number, any> = {}
        flat.forEach((x: any) => (byId[x.id] = { href: x.href, label: x.label, target: x.target || undefined, sort_order: x.sort_order, children: [] as any[] }))
        const roots: any[] = []
        flat.forEach((x: any) => {
          const node = byId[x.id]
          if (x.parent_id) {
            const parent = byId[x.parent_id]
            if (parent) parent.children.push(node)
          } else {
            roots.push(node)
          }
        })
        const sortTree = (arr: any[]) => {
          arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          arr.forEach((n) => n.children && sortTree(n.children))
        }
        sortTree(roots)
        // Only use database menus - no fallback to static menu
        const base = roots.length ? roots.map(({ sort_order, ...rest }) => rest) : []
        setNav(base)

        // Optionally attach submenu from another slug to the Buy FASTag item
        if (SUB_BUYFASTAG) {
          fetch(`/api/menus?slug=${encodeURIComponent(SUB_BUYFASTAG)}`, { cache: "no-store" })
            .then(r => r.ok ? r.json() : null)
            .then(sub => {
              if (!sub || !Array.isArray(sub.items)) return
              const items = sub.items.filter((x: any) => x.active)
              if (!items.length) return
              const map: Record<number, any> = {}
              items.forEach((x: any) => (map[x.id] = { href: x.href, label: x.label, target: x.target || undefined, sort_order: x.sort_order, children: [] as any[] }))
              const roots2: any[] = []
              items.forEach((x: any) => {
                const node = map[x.id]
                if (x.parent_id) {
                  map[x.parent_id]?.children?.push(node)
                } else {
                  roots2.push(node)
                }
              })
              roots2.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

              setNav(prev => {
                const next = prev.map((it) => ({ ...it }))
                const idx = next.findIndex((n) => (n.href?.includes("/buy") || n.href?.includes("#buy") || /buy\s*fastag/i.test(n.label || "")))
                if (idx >= 0) {
                  next[idx] = { ...next[idx], children: roots2.map(({ sort_order, ...rest }: any) => rest) }
                }
                return next
              })
            })
            .catch(() => {})
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TextHoverLogo />
        </Link>

        <ResizableNavbar items={nav} />

        <div className="hidden md:flex items-center gap-3">
          {!auth ? (
            <Link href="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/account" className="text-gray-700 hover:text-gray-900">{auth.user?.name || auth.user?.email}</Link>
              {auth.role === "admin" && (
                <Link href="/admin" className="text-gray-700 hover:text-gray-900">Admin</Link>
              )}
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" })
                  window.location.href = "/"
                }}
              >
                Logout
              </button>
            </div>
          )}
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white inline-flex items-center gap-2"
            onClick={() => dispatch({ type: "OPEN_CART" })}
          >
            <ShoppingCart className="w-4 h-4" />
            Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </Button>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-orange-300 text-gray-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25A.75.75 0 0 1 4.5 11h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-orange-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-2">
            {nav.map((n, idx) => (
              <div key={n.href} className="flex flex-col">
                {Array.isArray(n.children) && n.children.length > 0 ? (
                  <details className="group" role="list">
                    <summary className="flex items-center justify-between cursor-pointer text-gray-800 py-2 select-none">
                      <Link href={n.href} target={n.target || undefined} onClick={() => setOpen(false)} className="flex-1">
                        {n.label}
                      </Link>
                      <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform" aria-hidden>
                        ?
                      </span>
                    </summary>
                    <div className="pl-4 pb-2 flex flex-col gap-1">
                      {(n.children || []).map((c) => (
                        <Link
                          key={`${n.href}-${c.href}`}
                          href={c.href}
                          target={c.target || undefined}
                          onClick={() => setOpen(false)}
                          className="text-gray-700 hover:text-gray-900 py-1"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    href={n.href}
                    className="text-gray-800 py-2"
                    onClick={() => setOpen(false)}
                    target={n.target || undefined}
                  >
                    {n.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              {!auth ? (
                <Link href="/login" className="text-gray-800" onClick={() => setOpen(false)}>
                  Login
                </Link>
              ) : (
                <>
                  <Link href="/account" className="text-gray-800" onClick={() => setOpen(false)}>
                    Account
                  </Link>
                  {auth.role === "admin" && (
                    <Link href="/admin" className="text-gray-800" onClick={() => setOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <button
                    className="text-gray-600"
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" })
                      setOpen(false)
                      window.location.href = "/"
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                onClick={() => {
                  setOpen(false)
                  dispatch({ type: "OPEN_CART" })
                }}
              >
                <span className="inline-flex items-center gap-2 justify-center">
                  <ShoppingCart className="w-4 h-4" />
                  Cart{itemCount > 0 ? ` (${itemCount})` : ""}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}


