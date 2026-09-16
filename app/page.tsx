"use client"

import Link from "next/link"

import { ReelsList } from "@/components/reels-list"
import { useAuthStore } from "@/stores/auth"

export default function Home() {
  const isAdmin = useAuthStore((state) => state.isAdmin)

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pb-16 pt-24 text-[var(--foreground)] sm:px-6">
      <main className="w-full max-w-3xl fade-in-up">
        <div className="glass-panel rounded-[2rem] p-5 sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex rounded-full border border-violet-200 bg-violet-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
              party wheel
            </span>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              <span className="gradient-title">Reel</span>
            </h1>
            <p className="max-w-xl text-sm text-violet-900/75 sm:text-base">
              Создавай колёса, собирай участников и запускай яркий розыгрыш в один клик.
            </p>
            {isAdmin && (
              <Link className="primary-button inline-flex items-center rounded-2xl px-5 py-3 text-sm font-bold shadow-lg" href="/new">
                Создать колесо
              </Link>
            )}
          </div>

          <div className="mt-8 border-t border-violet-100 pt-6">
            <ReelsList />
          </div>
        </div>
      </main>
    </div>
  )
}
