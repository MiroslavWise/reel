"use client"

import Link from "next/link"

import { useAuthStore } from "@/stores/auth"

export default function Home() {
  const isAdmin = useAuthStore((state) => state.isAdmin)

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <main className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-10 text-center shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Reel</h1>
          <p className="mt-2 text-zinc-600">Добро пожаловать</p>
        </div>
        {isAdmin && (
          <Link className="rounded-lg bg-zinc-950 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800" href="/new">
            Создать
          </Link>
        )}
      </main>
    </div>
  )
}
