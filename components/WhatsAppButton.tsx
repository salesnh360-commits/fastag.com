import React from "react"

// Renders a floating WhatsApp button on all pages when
// NEXT_PUBLIC_WHATSAPP_NUMBER is set. Optional default message via
// NEXT_PUBLIC_WHATSAPP_MESSAGE.
export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!number) return null

  const digits = number.replace(/[^\d]/g, "")
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    "Hi, I’d like help with FASTag."

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-50 right-4 bottom-4 md:right-6 md:bottom-6"
    >
      <span
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg ring-1 ring-black/10 transition-transform hover:scale-105 focus:scale-105 focus:outline-none"
        title="Chat on WhatsApp"
      >
        {/* WhatsApp logo (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-7 w-7 text-white"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.114 17.113c-.28-.14-1.654-.814-1.91-.907-.257-.094-.444-.14-.632.14-.187.28-.725.907-.888 1.094-.163.187-.326.21-.605.07-.28-.14-1.18-.435-2.247-1.387-.83-.74-1.39-1.653-1.553-1.933-.163-.28-.017-.432.123-.572.127-.127.28-.326.42-.49.14-.163.187-.28.28-.467.093-.187.047-.35-.023-.49-.07-.14-.632-1.525-.867-2.088-.228-.548-.46-.474-.632-.482-.163-.008-.35-.01-.538-.01-.187 0-.49.07-.747.35-.257.28-.98.958-.98 2.335 0 1.377 1.003 2.708 1.144 2.895.14.187 1.973 3.012 4.78 4.21.668.288 1.19.46 1.596.59.67.213 1.28.183 1.763.111.538-.08 1.654-.676 1.888-1.33.233-.655.233-1.216.163-1.335-.07-.117-.257-.187-.538-.327z" />
          <path d="M26.882 5.118A13.91 13.91 0 0 0 16 .5C7.886.5 1.5 6.885 1.5 15a13.91 13.91 0 0 0 4.618 10.382L4.6 30.5l5.262-1.374A13.91 13.91 0 0 0 16 29.5C24.114 29.5 30.5 23.115 30.5 15a13.91 13.91 0 0 0-3.618-9.882zM16 27.5c-2.33 0-4.49-.689-6.294-1.872l-.45-.286-3.117.814.834-3.043-.294-.468A11.497 11.497 0 0 1 4.5 15C4.5 8.931 9.93 3.5 16 3.5S27.5 8.931 27.5 15 22.07 27.5 16 27.5z" />
        </svg>
      </span>
    </a>
  )
}

