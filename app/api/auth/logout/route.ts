import { NextResponse } from "next/server"

import { sessionCookieName } from "@/lib/telegram-auth"

export function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(sessionCookieName)
  return response
}