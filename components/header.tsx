"use client"

import { useEffect } from "react"
import Link from "next/link"

import { AuthStatus } from "@/enum/auth"
import { useAuthStore } from "@/stores/auth"

import { TelegramLogin } from "./telegram-login"

export function Header() {
  const { dispatchCheckAuth, dispatchLogout, isAdmin, status, user } = useAuthStore()

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
            {isAdmin && (
              <Link className="rounded-lg bg-zinc-950 px-3 py-2 text-sm text-white transition-colors hover:bg-zinc-800" href="/new">
                Создать
              </Link>
            )}
            <button
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors hover:bg-zinc-100"
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
