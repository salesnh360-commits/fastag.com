import { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

const COOKIE_NAME = "nh360_auth"

export type AuthPayload = { uid: number; role: string } | null

export function getAuth(req: NextRequest): AuthPayload {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) return null
    const payload = verifyToken(token)
    if (!payload) return null
    return { uid: payload.uid, role: payload.role }
  } catch {
    return null
  }
}

export function isAdmin(req: NextRequest): boolean {
  const a = getAuth(req)
  return !!a && a.role === "admin"
}

