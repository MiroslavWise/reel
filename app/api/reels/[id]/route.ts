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
