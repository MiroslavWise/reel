"use client"

import { useEffect } from "react"

import { AuthStatus } from "@/enum/auth"
import { useAuthStore } from "@/stores/auth"

import { TelegramLogin } from "./telegram-login"

export function AuthScreen() {
  const { dispatchCheckAuth, dispatchLogout, status, user } = useAuthStore()

  useEffect(() => {
    void dispatchCheckAuth()
  }, [dispatchCheckAuth])

  if (status === AuthStatus.PENDING) {
    return <p className="text-sm text-zinc-500">Проверяем авторизацию...</p>
  }

  if (status === AuthStatus.UNAUTHENTICATED) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-zinc-600">Войдите через Telegram</p>
        <TelegramLogin />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-zinc-700">
        Вы вошли как <strong>{user?.username ? `@${user.username}` : user?.first_name}</strong>
      </p>
      <button
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm transition-colors hover:bg-zinc-100"
        onClick={() => void dispatchLogout()}
        type="button"
      >
        Выйти
      </button>
    </div>
  )
}
