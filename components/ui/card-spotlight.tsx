"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Props = React.HTMLAttributes<HTMLDivElement>

export function CardSpotlight({ className, children, ...props }: Props) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: -9999, y: -9999 })
  const [hovered, setHovered] = React.useState(false)

  const updateFromEvent = (clientX: number, clientY: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({ x: clientX - rect.left, y: clientY - rect.top })
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    setHovered(true)
    updateFromEvent(e.clientX, e.clientY)
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fallback for older browsers
    setHovered(true)
    updateFromEvent(e.clientX, e.clientY)
  }

  const onLeave = () => {
    setHovered(false)
    setPos({ x: -9999, y: -9999 })
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onMouseMove={onMouseMove}
      onMouseLeave={onLeave}
      onPointerLeave={onLeave}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-orange-200 bg-white p-6 transition-colors",
        className
      )}
      {...props}
    >
      {/* Base subtle glow always visible (helps on touch devices) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(180px circle at 20% 20%, rgba(251,146,60,0.08), transparent 60%)",
        }}
      />

      {/* Spotlight overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(260px circle at ${pos.x}px ${pos.y}px, rgba(251,146,60,0.35), transparent 60%)`,
          mixBlendMode: "screen" as any,
        }}
      />

      {/* Subtle inner ring */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-orange-100" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
