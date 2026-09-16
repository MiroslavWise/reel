import { NextRequest, NextResponse } from "next/server"

import { createReel } from "@/lib/reels"
import { isAdminTelegramUser, readSession, sessionCookieName } from "@/lib/telegram-auth"
import { createReelSchema } from "@/schemas/create"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const session = readSession(request.cookies.get(sessionCookieName)?.value)

  if (!session?.user || !isAdminTelegramUser(session.user)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const data = await createReelSchema.validate(body, { abortEarly: false, stripUnknown: true })
    const reel = await createReel({ name: data.name, telegramId: session.user.id, users: data.users })

    return NextResponse.json({ id: reel.id, name: reel.name, telegramId: reel.telegramId.toString(), users: reel.users }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") return NextResponse.json({ error: "Проверьте заполнение формы" }, { status: 400 })
    console.error("[reels] create failed", error)
    return NextResponse.json({ error: "Не удалось создать колесо" }, { status: 500 })
  }
}