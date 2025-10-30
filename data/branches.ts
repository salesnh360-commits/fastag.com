export type Branch = {
  slug: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  phone: string
  gbpUrl?: string
  neighborhoods?: string[]
}

export const branches: Branch[] = [
  {
    slug: "coimbatore-edayarpalayam",
    name: "KOVAI FASTAG & GPS SERVICE",
    addressLine1: "410A, First Floor, Thadagam Main Road, junction, Edayarpalayam",
    city: "Coimbatore",
    state: "Tamil Nadu",
    postalCode: "641025",
    phone: "094885 00360",
    gbpUrl:
      "https://www.google.com/search?q=KOVAI+FASTAG+%26+GPS+SERVICE&stick=H4sIAAAAAAAA_-NgU1I1qDBOSrQwtTRNSTVLTLYwMU6yMqhIsTBLNLc0NE4xM0gytDAzXMQq5e0f5uip4OYYHOLorqCm4B4QrBDsGhTm6ewKAO0qhFtGAAAA&hl=en&mat=CWopZ4lsa_MlElYBTVDHnrtw7lZASKYphq3vsPZsclCq3rn1c6Do5eloXE5in5ct3bUXKhb_UankCEkQ3gxItEhM2tghaBczGRf9X4nDkT0Y7UhR4wuUx0JBA2Y3UlncTw&authuser=0",
    neighborhoods: ["Edayarpalayam", "Thadagam Road", "Gandhipuram", "RS Puram"],
  },
  {
    slug: "coimbatore-ganapathy",
    name: "Ganapathy Fastag & GPS Service",
    addressLine1: "144/1, Raja St, Ganapathy",
    city: "Coimbatore",
    state: "Tamil Nadu",
    postalCode: "641006",
    phone: "+91 86674 60635",
    gbpUrl:
      "https://www.google.com/search?q=Ganapathy+Fastag+%26+GPS+Service&stick=H4sIAAAAAAAA_-NgU1I1qDBOSrQwtTQ0sjAzMTVMSbS0MqiwTDEyN01MNUlLNjNPMTYyWcQq556Yl1iQWJJRqeCWWFySmK6gpuAeEKwQnFpUlpmcCgAdTooUSgAAAA&hl=en&mat=CS5imygxH9JVElcBTVDHnkwqa0bAYMWwX3aMjaqJnlS_vj1o7LqXaKdlPFirntTdgRoq_Zw4qMjxU8UJKgsuSvf6P5Tt7NTZ-IJj3QFeFdWfaYBhaLzUrS3i0TYfSKL9ZwQ&authuser=0",
    neighborhoods: ["Ganapathy", "Peelamedu", "Gandhipuram", "Saibaba Colony"],
  },
]

export function formatFullAddress(b: Branch): string {
  const parts = [b.addressLine1, b.addressLine2, b.city, b.state, b.postalCode].filter(Boolean)
  return parts.join(", ")
}

export function getBranchBySlug(slug: string): Branch | undefined {
  return branches.find((b) => b.slug === slug)
}
