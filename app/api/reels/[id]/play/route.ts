import { randomInt } from "node:crypto"

import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { isAdminTelegramUser, readSession, sessionCookieName } from "@/lib/telegram-auth"

export const runtime = "nodejs"

interface StoredReelUser {
  name: string
  exclude?: boolean
}

function parseUsers(value: unknown) {
  if (!Array.isArray(value)) return []

  return value.filter(
    (user): user is StoredReelUser =>
      typeof user === "object" && user !== null && "name" in user && typeof user.name === "string",
  )
}

async function getPlayableReel(request: NextRequest, id: string) {
  const session = readSession(request.cookies.get(sessionCookieName)?.value)
  if (!session?.user) return { error: NextResponse.json({ error: "Необходима авторизация" }, { status: 401 }) }

  const reel = await prisma.reel.findUnique({ where: { id }, select: { id: true, name: true, users: true, telegramId: true } })
  if (!reel) return { error: NextResponse.json({ error: "Колесо не найдено" }, { status: 404 }) }

  const canPlay = isAdminTelegramUser(session.user) || reel.telegramId === BigInt(session.user.id)
  if (!canPlay) return { error: NextResponse.json({ error: "Недостаточно прав" }, { status: 403 }) }

  return { reel, users: parseUsers(reel.users) }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getPlayableReel(request, id)
  if (result.error) return result.error

  return NextResponse.json({
    id: result.reel.id,
    name: result.reel.name,
    users: result.users.map(({ name }) => ({ name })),
  })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getPlayableReel(request, id)
  if (result.error) return result.error

  const playableIndexes = result.users.flatMap((user, index) => (user.exclude ? [] : [index]))
  if (!playableIndexes.length) return NextResponse.json({ error: "Нет доступных участников для запуска" }, { status: 400 })

  return NextResponse.json({ winnerIndex: playableIndexes[randomInt(playableIndexes.length)] })
}