"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { AuthStatus } from "@/enum/auth"
import { useAuthStore } from "@/stores/auth"

interface ReelSummary {
  id: string
  name: string
  usersCount: number
}

export function ReelsList() {
  const status = useAuthStore((state) => state.status)
  const [reels, setReels] = useState<ReelSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status !== AuthStatus.AUTHENTICATED) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetch("/api/reels", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as { reels?: ReelSummary[]; error?: string }
        if (!response.ok) throw new Error(data.error ?? "Не удалось загрузить колёса")
        return data.reels ?? []
      })
      .then((data) => {
        if (!cancelled) setReels(data)
      })
      .catch((requestError: Error) => {
        if (!cancelled) setError(requestError.message)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [status])

  if (status === AuthStatus.PENDING) return <p className="text-sm text-zinc-500">Загружаем колёса...</p>
  if (status !== AuthStatus.AUTHENTICATED) return <p className="text-sm text-zinc-500">Войдите, чтобы увидеть свои колёса.</p>
  if (isLoading) return <p className="text-sm text-zinc-500">Загружаем колёса...</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!reels.length) return <p className="text-sm text-zinc-500">У вас пока нет колёс.</p>

  return (
    <div className="w-full space-y-2 text-left">
      {reels.map((reel) => (
        <Link
          className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-zinc-400 hover:bg-zinc-50"
          href={`/reel/${reel.id}`}
          key={reel.id}
        >
          <span className="font-medium text-zinc-950">{reel.name}</span>
          <span className="shrink-0 text-sm text-zinc-500">{reel.usersCount} уч.</span>
        </Link>
      ))}
    </div>
  )
}