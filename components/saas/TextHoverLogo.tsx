"use client"

import React from "react"

export default function TextHoverLogo({
  text = "Nh360 FasTag",
  className = "",
}: {
  text?: string
  className?: string
}) {
  const letters = Array.from(text)
  return (
    <div className={`group inline-flex select-none items-center ${className}`} aria-label={text}>
      <div className="relative">
        {/* Base text */}
        <div className="font-extrabold tracking-tight text-xl md:text-2xl leading-none text-gray-900 transition group-hover:opacity-0">
          {letters.map((ch, i) => (
            <span
              key={i}
              className="inline-block transition-transform duration-300 group-hover:-translate-y-1"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>

        {/* Gradient reveal overlay (hover effect) */}
        <div className="pointer-events-none absolute inset-0 font-extrabold tracking-tight text-xl md:text-2xl leading-none">
          {letters.map((ch, i) => (
            <span
              key={`g-${i}`}
              className="inline-block bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition duration-300"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>
      </div>

      {/* Underline sweep */}
      <span className="ml-2 h-1 w-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-full transition-all duration-500 group-hover:w-6" />
    </div>
  )
}
