"use client"

import { Car, Wallet, Truck, LifeBuoy, type LucideIcon } from "lucide-react"

type Step = {
  title: string
  description: string
  step: string
  // Tailwind color classes for accenting the card
  accent: {
    text: string
    border: string
    bg: string
  }
  Icon: LucideIcon
}

const steps: Step[] = [
  {
    step: "Step 01",
    title: "FASTag Issuance",
    description: "Same-day activation with KYC help",
    accent: { text: "text-sky-600", border: "border-sky-500", bg: "bg-sky-500" },
    Icon: Car,
  },
  {
    step: "Step 02",
    title: "Recharge Assistance",
    description: "Support across all issuers",
    accent: { text: "text-orange-600", border: "border-orange-500", bg: "bg-orange-500" },
    Icon: Wallet,
  },
  {
    step: "Step 03",
    title: "Fleet Solutions",
    description: "Bulk issuance, MIS reports & support",
    accent: { text: "text-rose-600", border: "border-rose-500", bg: "bg-rose-500" },
    Icon: Truck,
  },
  {
    step: "Step 04",
    title: "FASTag Services",
    description: "KYC update, blacklist removal, disputes",
    accent: { text: "text-indigo-700", border: "border-indigo-700", bg: "bg-indigo-700" },
    Icon: LifeBuoy,
  },
]

export default function InfographicSteps() {
  return (
    <section
      aria-label="FASTag solutions steps"
      className="relative py-16"
    >
      {/* subtle colorful background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_60%_at_50%_40%,#fff7ed,transparent_60%)]" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map(({ step, title, description, accent, Icon }) => (
            <article
              key={step}
              className="relative rounded-xl bg-white/90 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* decorative corner brackets */}
              <span className={`pointer-events-none absolute top-3 left-3 h-8 w-8 rounded-tl-lg border-t-4 border-l-4 ${accent.border}`} />
              <span className={`pointer-events-none absolute bottom-3 left-3 h-8 w-8 rounded-bl-lg border-b-4 border-l-4 ${accent.border}`} />
              <span className={`pointer-events-none absolute top-3 right-3 h-8 w-8 rounded-tr-lg border-t-4 border-r-4 ${accent.border}`} />
              <span className={`pointer-events-none absolute bottom-3 right-3 h-8 w-8 rounded-br-lg border-b-4 border-r-4 ${accent.border}`} />

              {/* icon tile */}
              <div className={`absolute -left-4 top-1/2 -translate-y-1/2 h-14 w-14 ${accent.bg} text-white rounded-md shadow-md flex items-center justify-center`}
                aria-hidden
              >
                <Icon className="h-7 w-7" />
              </div>

              <div className="pl-12">
                <div className={`text-xs font-extrabold tracking-wider uppercase ${accent.text}`}>{step}</div>
                <h3 className="mt-1 text-xl font-extrabold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
