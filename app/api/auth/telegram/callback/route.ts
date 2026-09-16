import { NextRequest, NextResponse } from "next/server"

import { createSession, sessionCookieName, sessionMaxAge } from "@/lib/telegram-auth"
import { exchangeCodeForUser } from "@/lib/telegram-oidc"

import { stateCookieName, verifierCookieName } from "../login/route"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const redirectUrl = new URL("/", request.url)
  const params = request.nextUrl.searchParams
  const state = params.get("state")
  const code = params.get("code")
  const savedState = request.cookies.get(stateCookieName)?.value
  const verifier = request.cookies.get(verifierCookieName)?.value

  if (!state || state !== savedState || !code || !verifier) {
    redirectUrl.searchParams.set("auth", "invalid")
    return NextResponse.redirect(redirectUrl)
  }

  try {
    const callbackUrl = new URL("/api/auth/telegram/callback", request.url).toString()
    const user = await exchangeCodeForUser(code, callbackUrl, verifier)
    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set(sessionCookieName, createSession(user), {
      httpOnly: true,
      maxAge: sessionMaxAge,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    response.cookies.delete(stateCookieName)
    response.cookies.delete(verifierCookieName)
    return response
  } catch (error) {
     console.error("[telegram-auth] callback failed", error)
     
    redirectUrl.searchParams.set("auth", "failed")
    return NextResponse.redirect(redirectUrl)
  }
}