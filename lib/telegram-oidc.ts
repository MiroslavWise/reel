import { createHash, randomBytes } from "node:crypto"

import { createRemoteJWKSet, jwtVerify } from "jose"

import type { TelegramUser } from "./telegram-auth"

const telegramIssuer = "https://oauth.telegram.org"
const telegramKeys = createRemoteJWKSet(new URL(`${telegramIssuer}/.well-known/jwks.json`))

function getRequiredEnv(name: "NEXT_PUBLIC_TELEGRAM_CLIENT_ID" | "NEXT_TELEGRAM_CLIENT_SECRET") {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not configured`)
  return value
}

export function createOidcState() {
  return randomBytes(32).toString("base64url")
}

export function createCodeVerifier() {
  return randomBytes(48).toString("base64url")
}

export function createCodeChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url")
}

export function getClientId() {
  return getRequiredEnv("NEXT_PUBLIC_TELEGRAM_CLIENT_ID")
}

export function getTelegramAuthorizationUrl({ callbackUrl, codeChallenge, state }: { callbackUrl: string; codeChallenge: string; state: string }) {
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid profile",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  })

  return `${telegramIssuer}/auth?${params}`
}

interface TelegramIdTokenClaims {
  sub: string
  iss: string
  aud: string | string[]
  iat: number
  exp: number
  name?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
  picture?: string
}

export async function exchangeCodeForUser(code: string, callbackUrl: string, codeVerifier: string): Promise<TelegramUser> {
  const credentials = Buffer.from(`${getClientId()}:${getRequiredEnv("NEXT_TELEGRAM_CLIENT_SECRET")}`).toString("base64")
  const response = await fetch(`${telegramIssuer}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackUrl,
      client_id: getClientId(),
      code_verifier: codeVerifier,
    }),
    cache: "no-store",
  })

  if (!response.ok) throw new Error(`Telegram token exchange failed: ${response.status}`)

  const tokenResponse = (await response.json()) as { id_token?: string }
  if (!tokenResponse.id_token) throw new Error("Telegram did not return an id_token")

  const { payload } = await jwtVerify<TelegramIdTokenClaims>(tokenResponse.id_token, telegramKeys, {
    issuer: telegramIssuer,
    audience: getClientId(),
  })
  const id = Number(payload.sub)
  const firstName = payload.given_name ?? payload.name?.split(" ")[0] ?? "Telegram user"

  if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Invalid Telegram user id")

  return {
    id,
    first_name: firstName,
    last_name: payload.family_name,
    username: payload.preferred_username,
    photo_url: payload.picture,
    auth_date: payload.iat,
  }
}