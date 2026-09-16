import { createHash, createHmac, timingSafeEqual } from "node:crypto"

const sessionCookieName = "telegram_session"
const sessionMaxAge = 60 * 60 * 24 * 30
const telegramAuthMaxAge = 60 * 60 * 24

function getAdminIds() {
  return new Set(
    (process.env.NEXT_PUBLIC_ADMINS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  )
}

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
}

function getRequiredEnv(name: "TELEGRAM_BOT_TOKEN" | "NEXT_AUTH_SESSION_SECRET") {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not configured`)
  return value
}

function createTelegramDataCheckString(params: URLSearchParams) {
  return [...params.entries()]
    .filter(([key]) => key !== "hash")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")
}

export function verifyTelegramAuth(params: URLSearchParams) {
  const hash = params.get("hash")
  const authDate = Number(params.get("auth_date"))
  if (!hash || !Number.isSafeInteger(authDate) || Math.abs(Date.now() / 1000 - authDate) > telegramAuthMaxAge) return null

  const secretKey = createHash("sha256").update(getRequiredEnv("TELEGRAM_BOT_TOKEN")).digest()
  const expectedHash = createHmac("sha256", secretKey).update(createTelegramDataCheckString(params)).digest("hex")
  const receivedHash = Buffer.from(hash, "hex")
  const calculatedHash = Buffer.from(expectedHash, "hex")
  if (receivedHash.length !== calculatedHash.length || !timingSafeEqual(receivedHash, calculatedHash)) return null

  const user: TelegramUser = {
    id: Number(params.get("id")),
    first_name: params.get("first_name") ?? "",
    last_name: params.get("last_name") ?? undefined,
    username: params.get("username") ?? undefined,
    photo_url: params.get("photo_url") ?? undefined,
    auth_date: authDate,
  }
  return Number.isSafeInteger(user.id) && user.id > 0 && user.first_name ? user : null
}

export function isAdminTelegramId(telegramId: number) {
  return getAdminIds().has(String(telegramId))
}

export function isAdminTelegramUser(user: Pick<TelegramUser, "id"> | null | undefined) {
  return user ? isAdminTelegramId(user.id) : false
}

function signSession(payload: string) {
  return createHmac("sha256", getRequiredEnv("NEXT_AUTH_SESSION_SECRET")).update(payload).digest("base64url")
}

export function createSession(user: TelegramUser) {
  const payload = Buffer.from(JSON.stringify({ user, expiresAt: Date.now() + sessionMaxAge * 1000 })).toString("base64url")
  return `${payload}.${signSession(payload)}`
}

export function readSession(value: string | undefined) {
  if (!value) return null
  const [payload, signature] = value.split(".")
  if (!payload || !signature) return null

  const expectedSignature = signSession(payload)
  const received = Buffer.from(signature)
  const expected = Buffer.from(expectedSignature)
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      user: TelegramUser
      expiresAt: number
    }
    return session.expiresAt > Date.now() ? session : null
  } catch {
    return null
  }
}

export { sessionCookieName, sessionMaxAge }