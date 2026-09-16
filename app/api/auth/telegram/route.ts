import { NextRequest, NextResponse } from "next/server"

import { createSession, sessionCookieName, sessionMaxAge, verifyTelegramAuth } from "@/lib/telegram-auth"

export const runtime = "nodejs"

export function GET(request: NextRequest) {
  const user = verifyTelegramAuth(request.nextUrl.searchParams)
  const redirectUrl = new URL("/", request.url)

  if (!user) {
    redirectUrl.searchParams.set("auth", "invalid")
    return NextResponse.redirect(redirectUrl)
  }

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set(sessionCookieName, createSession(user), {
    httpOnly: true,
    maxAge: sessionMaxAge,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
  return response
}