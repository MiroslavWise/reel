import { NextRequest, NextResponse } from "next/server"

import {
  createCodeChallenge,
  createCodeVerifier,
  createOidcState,
  getTelegramAuthorizationUrl,
} from "@/lib/telegram-oidc"

export const runtime = "nodejs"

const stateCookieName = "telegram_oidc_state"
const verifierCookieName = "telegram_oidc_verifier"

export function GET(request: NextRequest) {
  const state = createOidcState()
  const verifier = createCodeVerifier()
  const callbackUrl = new URL("/api/auth/telegram/callback", request.url).toString()
  const response = NextResponse.redirect(getTelegramAuthorizationUrl({ callbackUrl, codeChallenge: createCodeChallenge(verifier), state }))
  const cookieOptions = {
    httpOnly: true,
    maxAge: 600,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  }

  response.cookies.set(stateCookieName, state, cookieOptions)
  response.cookies.set(verifierCookieName, verifier, cookieOptions)
  return response
}

export { stateCookieName, verifierCookieName }