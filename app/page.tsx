"use client"

import Link from "next/link"

import { ReelsList } from "@/components/reels-list"
import { useAuthStore } from "@/stores/auth"

export default function Home() {
  const isAdmin = useAuthStore((state) => state.isAdmin)

  return (
    <div className="flex flex-col min-h-screen items-center bg-zinc-50 px-6 text-zinc-950 pt-20">
      <main className="flex w-full max-w-md flex-col items-center gap-4 text-center sm">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Reel</h2>
          <p className="mt-2 text-zinc-600">Добро пожаловать</p>
        </div>
        {isAdmin && (
          <Link className="rounded-lg bg-zinc-950 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800" href="/new">
            Создать
          </Link>
        )}
        <div className="w-full border-t border-zinc-100 pt-6">
          <ReelsList />
        </div>
      </main>
    </div>
  )
}
