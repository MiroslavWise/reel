"use client"

import { useEffect } from "react"

import { AuthStatus } from "@/enum/auth"
import { useAuthStore } from "@/stores/auth"

import { TelegramLogin } from "./telegram-login"

export function Header() {
  const { dispatchCheckAuth, dispatchLogout, status, user } = useAuthStore()

  useEffect(() => {
    void dispatchCheckAuth()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <span className="text-lg font-semibold tracking-tight">Reel</span>

        {status === AuthStatus.PENDING ? (
          <span className="text-sm text-zinc-500">Проверяем...</span>
        ) : status === AuthStatus.AUTHENTICATED ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-zinc-700 sm:inline">{user?.username ? `@${user.username}` : user?.first_name}</span>
            <button
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-100"
              onClick={() => void dispatchLogout()}
              type="button"
            >
              Выйти
            </button>
          </div>
        ) : (
          <TelegramLogin />
        )}
      </div>
    </header>
  )
}
