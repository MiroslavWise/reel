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

const reelAccent = ["#8a7dff", "#ff7ec9", "#6ec9ff", "#7aeac4", "#ffbc7d"]

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

  if (status === AuthStatus.PENDING) return <p className="text-sm text-violet-700/75">Загружаем колёса...</p>
  if (status !== AuthStatus.AUTHENTICATED) return <p className="text-sm text-violet-700/75">Войдите, чтобы увидеть свои колёса.</p>
  if (isLoading) return <p className="text-sm text-violet-700/75">Загружаем колёса...</p>
  if (error) return <p className="text-sm text-rose-600">{error}</p>
  if (!reels.length) return <p className="text-sm text-violet-700/75">У вас пока нет колёс.</p>

  return (
    <div className="w-full space-y-3 text-left">
      {reels.map((reel, index) => {
        const accent = reelAccent[index % reelAccent.length]

        return (
          <Link
            className="group flex items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-white/75 px-4 py-3.5 shadow-[0_12px_30px_rgba(120,90,175,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white"
            href={`/reel/${reel.id}`}
            key={reel.id}
            style={{
              backgroundImage: `linear-gradient(90deg, ${accent}22 0, ${accent}22 6px, rgba(255,255,255,0.82) 6px)`,
            }}
          >
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: accent }} />
              <span className="font-semibold text-violet-950">{reel.name}</span>
            </div>
            <span className="shrink-0 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-800">
              {reel.usersCount} уч.
            </span>
          </Link>
        )
      })}
    </div>
  )
}