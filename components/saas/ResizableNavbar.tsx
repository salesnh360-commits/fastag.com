"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"

type Item = { label: string; href: string; target?: string; children?: Item[] }

export default function ResizableNavbar({
  items = [
    { label: "Home", href: "/" },
    { label: "Buy FASTag", href: "/buy" },
    { label: "Recharge FASTag", href: "/recharge" },
    { label: "Get Support", href: "/support" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ],
}: { items?: Item[] }) {
  const pathname = usePathname()
  // Helper to detect active item anywhere in its descendants
  const pathMatches = (n: Item): boolean => {
    if (!n) return false
    if (pathname === n.href) return true
    return (n.children || []).some(pathMatches)
  }
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [indicator, setIndicator] = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 })
  const [activeIndex, setActiveIndex] = useState<number>(0)

  // Derive active item from pathname
  const computedActive = useMemo(() => {
    const idx = items.findIndex((it) => pathMatches(it))
    return idx >= 0 ? idx : 0
  }, [items, pathname])

  useEffect(() => {
    setActiveIndex(computedActive)
  }, [computedActive])

  const moveTo = (index: number) => {
    const el = itemRefs.current[index]
    const container = containerRef.current
    if (!el || !container) return
    const elRect = el.getBoundingClientRect()
    const parentRect = container.getBoundingClientRect()
    const left = elRect.left - parentRect.left
    const width = elRect.width
    setIndicator({ left, width, opacity: 1 })
  }

  useEffect(() => {
    // Position under active on mount and on resize
    const handle = () => moveTo(activeIndex)
    handle()
    window.addEventListener("resize", handle)
    return () => window.removeEventListener("resize", handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, items.length])

  // Recursive flyout renderer for arbitrary depth
  function NavSubList({ items, nested = false }: { items: Item[]; nested?: boolean }) {
    return (
      <div
        className={`relative min-w-56 rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black/10 p-2
                    transform ${nested ? 'translate-x-1' : 'translate-y-1'} transition-transform duration-200 ease-out
                    ${nested ? 'group-hover/item:translate-x-0' : 'group-hover:translate-y-0 group-focus-within:translate-y-0'}`}
      >
        {!nested && (
          <div className="pointer-events-none absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white border-l border-t border-gray-200" />
        )}
        {nested && (
          <div className="pointer-events-none absolute left-[-5px] top-3 h-2 w-2 rotate-45 bg-white border-b border-r border-gray-200" />
        )}
        {items.map((c) => {
          const hasKids = (c.children || []).length > 0
          return (
            <div key={c.href} className="relative group/item">
              <Link
                href={c.href}
                target={c.target}
                className={`block rounded-md px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 ${hasKids ? 'pr-8' : ''}`}
              >
                {c.label}
                {hasKids && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">›</span>
                )}
              </Link>
              {hasKids && (
                <div
                  className="absolute left-full top-0 ml-2 opacity-0 pointer-events-none transition-all duration-200 ease-out
                             group-hover/item:opacity-100 group-focus-within/item:opacity-100 group-hover/item:pointer-events-auto"
                >
                  <NavSubList items={c.children || []} nested />
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative hidden md:flex items-center gap-6 rounded-full border border-gray-200 bg-white/90 px-2 py-1 shadow-sm"
      onMouseLeave={() => moveTo(activeIndex)}
    >
      {/* Indicator bar */}
      <div
        className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 transition-all duration-300"
        style={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity }}
      />
      {items.map((item, i) => (
        <div key={item.href} className="relative group" onMouseEnter={() => moveTo(i)} onFocus={() => moveTo(i)}>
          <Link
            href={item.href}
            ref={(el) => { itemRefs.current[i] = el }}
            onClick={() => setActiveIndex(i)}
            target={item.target}
            className={`relative rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-gray-900 ${
              i === activeIndex ? "text-gray-900" : "text-gray-700"
            }`}
          >
            {item.label}
          </Link>
          {(item.children && item.children.length > 0) && (
            <div
              className="absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 opacity-0 pointer-events-none
                         transition-all duration-200 ease-out
                         group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto"
            >
              {/* Dropdown panel - now recursive for any depth */}
              <NavSubList items={item.children || []} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
