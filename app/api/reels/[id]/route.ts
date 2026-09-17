import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { isAdminTelegramUser, readSession, sessionCookieName } from "@/lib/telegram-auth"

export const runtime = "nodejs"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = readSession(request.cookies.get(sessionCookieName)?.value)

  if (!session?.user || !isAdminTelegramUser(session.user)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
  }

  const { id } = await params
  const reel = await prisma.reel.findUnique({
    where: { id },
    select: { id: true, name: true, users: true, telegramId: true },
  })

  if (!reel) return NextResponse.json({ error: "Колесо не найдено" }, { status: 404 })

  return NextResponse.json({ ...reel, telegramId: reel.telegramId.toString() })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = readSession(request.cookies.get(sessionCookieName)?.value)

  if (!session?.user || !isAdminTelegramUser(session.user)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
  }

  const { id } = await params
  const body = (await request.json().catch(() => null)) as { name?: unknown; exclude?: unknown } | null
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const exclude = body?.exclude === true

  if (!name) return NextResponse.json({ error: "Введите имя участника" }, { status: 400 })
  if (name.length > 120) return NextResponse.json({ error: "Имя слишком длинное" }, { status: 400 })

  const reel = await prisma.reel.findUnique({ where: { id }, select: { users: true } })
  if (!reel) return NextResponse.json({ error: "Колесо не найдено" }, { status: 404 })

  const users = Array.isArray(reel.users) ? reel.users : []
  const updatedReel = await prisma.reel.update({
    where: { id },
    data: { users: [...users, { name, exclude }] },
    select: { id: true, name: true, users: true },
  })

  return NextResponse.json(updatedReel)
}
