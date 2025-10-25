"use client"

import { Briefcase, Target, BarChart3, type LucideIcon } from "lucide-react"

type Step = {
  num: number
  title: string
  description: string
  Icon: LucideIcon
}

const steps: Step[] = [
  {
    num: 1,
    title: "Share Details",
    description: "Tell us about your vehicle and city.",
    Icon: Briefcase,
  },
  {
    num: 2,
    title: "KYC & Issuer",
    description: "We guide you through KYC and bank selection.",
    Icon: Target,
  },
  {
    num: 3,
    title: "Activation",
    description: "Tag is activated and ready for tolls.",
    Icon: BarChart3,
  },
]

export default function HexSteps() {
  return (
    <section id="how-it-works" aria-label="How it works" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ num, title, description, Icon }) => (
            <article key={num} className="relative transition-transform hover:-translate-y-0.5">
              {/* Outer bordered hexagon */}
              <div className="clip-hex p-[3px] bg-gradient-to-r from-orange-500 to-orange-600 shadow-md">
                {/* Inner hexagon content */}
                <div className="clip-hex bg-white">
                  <div className="relative px-8 py-10 text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-orange-500/15 text-orange-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    {/* Title */}
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  </div>
                </div>
              </div>

              {/* Number badge */}
              <div
                className="absolute -left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white shadow-md"
                aria-hidden
              >
                <span className="text-sm font-bold">{String(num).padStart(2, "0")}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
