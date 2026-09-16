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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/50 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            aria-label="Колёса"
            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 p-2.5 text-violet-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            href="/"
          >
            <svg aria-hidden="true" className="h-5 w-5 animate-[spin_2s_linear_infinite]" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="m12 3.5 0 6.5m0 4v6.5m8.5-8.5H14m-4 0H3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
          </Link>
          <Link className="text-lg font-black tracking-tight gradient-title" href="/">
            Reel
          </Link>
        </div>

        {status === AuthStatus.PENDING ? (
          <span className="rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-sm font-medium text-violet-900/75">
            Проверяем...
          </span>
        ) : status === AuthStatus.AUTHENTICATED ? (
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1.5 text-sm font-medium text-violet-900 sm:inline">
              {user?.username ? `@${user.username}` : user?.first_name}
            </span>
            <button
              className="secondary-button rounded-xl px-3 py-2 text-sm font-semibold"
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
