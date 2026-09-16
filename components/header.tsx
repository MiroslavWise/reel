"use client"

import { useEffect } from "react"
import Link from "next/link"

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
        <div className="flex items-center gap-5">
          <span className="text-lg font-semibold tracking-tight">Reel</span>
          <Link aria-label="Колёса" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950" href="/">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="m12 3.5 0 6.5m0 4v6.5m8.5-8.5H14m-4 0H3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
            Колёса
          </Link>
        </div>

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
