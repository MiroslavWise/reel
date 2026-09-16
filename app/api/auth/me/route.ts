import { NextRequest, NextResponse } from "next/server"

import { isAdminTelegramUser, readSession, sessionCookieName } from "@/lib/telegram-auth"

export const runtime = "nodejs"

export function GET(request: NextRequest) {
  const session = readSession(request.cookies.get(sessionCookieName)?.value)
  return NextResponse.json({
    user: session?.user ?? null,
    isAdmin: isAdminTelegramUser(session?.user),
  })
}