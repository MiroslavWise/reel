"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { useReelPlayback } from "@/hooks/use-reel"

export function ActiveReelView({ id }: { id: string }) {
  const { data: reel, error, isPending, spin } = useReelPlayback(id)
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const [offset, setOffset] = useState(0)
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)

  useEffect(() => {
    const updateSizes = () => {
      setViewportWidth(viewportRef.current?.clientWidth ?? 0)
      setCardWidth(cardRef.current?.getBoundingClientRect().width ?? 0)
    }

    updateSizes()
    window.addEventListener("resize", updateSizes)
    return () => window.removeEventListener("resize", updateSizes)
  }, [reel?.users.length])

  const trackUsers = useMemo(() => {
    if (!reel?.users.length) return []
    return Array.from({ length: 9 }, () => reel.users).flat()
  }, [reel?.users])

  const handleSpin = async () => {
    if (!reel || spin.isPending || !cardWidth || !viewportWidth) return

    const result = await spin.mutateAsync()
    const cycle = 7
    const targetIndex = cycle * reel.users.length + result.winnerIndex
    const gap = 12
    const targetOffset = targetIndex * (cardWidth + gap) - (viewportWidth - cardWidth) / 2
    setWinnerIndex(null)
    setOffset(targetOffset)
    window.setTimeout(() => setWinnerIndex(result.winnerIndex), 3200)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <main className="w-full max-w-4xl rounded-2xl bg-white p-6 text-center shadow-sm sm:p-10">
        {error ? (
          <p className="text-red-600">{error.message}</p>
        ) : isPending || !reel ? (
          <p className="text-zinc-500">Загружаем колесо...</p>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">{reel.name}</h1>
            <p className="mt-2 text-zinc-600">Нажмите, чтобы запустить колесо</p>
            <div className="relative mt-10">
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-1 -translate-x-1/2 bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.15)]" />
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 py-4" ref={viewportRef}>
                <div
                  className="flex gap-3 transition-transform duration-[3200ms] ease-out"
                  style={{ transform: `translateX(-${offset}px)` }}
                >
                  {trackUsers.map((user, index) => (
                    <div
                      className="flex h-20 w-40 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-center font-medium shadow-sm sm:w-52"
                      key={`${user.name}-${index}`}
                      ref={index === 0 ? cardRef : undefined}
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="mt-8 rounded-lg bg-zinc-950 px-8 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={spin.isPending}
              onClick={() => void handleSpin()}
              type="button"
            >
              {spin.isPending ? "Готовим запуск..." : "Запустить"}
            </button>
            {spin.error && <p className="mt-4 text-red-600">{spin.error.message}</p>}
            {winnerIndex !== null && <p className="mt-4 text-lg font-semibold">Выпал: {reel.users[winnerIndex]?.name}</p>}
          </>
        )}
      </main>
    </div>
  )
}
