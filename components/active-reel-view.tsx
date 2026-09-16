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
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinRound, setSpinRound] = useState(0)
  const [spinDuration, setSpinDuration] = useState(10_000)
  const finishTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const updateSizes = () => {
      setViewportWidth(viewportRef.current?.clientWidth ?? 0)
      setCardWidth(cardRef.current?.getBoundingClientRect().width ?? 0)
    }

    updateSizes()
    window.addEventListener("resize", updateSizes)
    return () => {
      window.removeEventListener("resize", updateSizes)
      if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current)
    }
  }, [reel?.users.length])

  const trackUsers = useMemo(() => {
    if (!reel?.users.length) return []
    return Array.from({ length: Math.max(24, spinRound + 12) }, () => reel.users).flat()
  }, [reel?.users, spinRound])

  const floatingUsers = useMemo(() => {
    if (!reel?.users.length) return []

    return reel.users.map((user, index) => ({
      ...user,
      left: 4 + Math.random() * 88,
      top: 8 + Math.random() * 80,
      duration: 14 + Math.random() * 12,
      delay: -(Math.random() * 14),
      rotation: -8 + Math.random() * 16,
      index,
    }))
  }, [reel?.users])

  const handleSpin = async () => {
    if (!reel || spin.isPending || isSpinning || !cardWidth || !viewportWidth) return

    setIsSpinning(true)
    setWinnerIndex(null)

    try {
      const result = await spin.mutateAsync()
      const cycle = 7 + spinRound
      const targetIndex = cycle * reel.users.length + result.winnerIndex
      const gap = 12
      const targetOffset = targetIndex * (cardWidth + gap) - (viewportWidth - cardWidth) / 2
      const duration = 9_000 + Math.floor(Math.random() * 3_001)

      setSpinDuration(duration)
      setOffset(targetOffset)
      setSpinRound((round) => round + 1)
      finishTimerRef.current = window.setTimeout(() => {
        setWinnerIndex(result.winnerIndex)
        setIsSpinning(false)
      }, duration)
    } catch {
      setIsSpinning(false)
    }
  }

  return (
    <div className="relative flex  pt-20 flex-col items-center overflow-hidden bg-zinc-50 px-6 text-zinc-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {floatingUsers.map((user) => (
          <span
            className="absolute max-w-[35vw] truncate text-lg font-semibold text-sky-900/10 animate-[reel-float_linear_infinite] sm:text-2xl"
            key={`${user.name}-${user.index}`}
            style={{
              left: `${user.left}%`,
              top: `${user.top}%`,
              animationDelay: `${user.delay}s`,
              animationDuration: `${user.duration}s`,
              transform: `rotate(${user.rotation}deg)`,
            }}
          >
            {user.name}
          </span>
        ))}
      </div>

      <main className="relative z-10 w-full max-w-4xl rounded-2xl bg-white p-6 text-center shadow-sm sm:p-10">
        {error ? (
          <p className="text-red-600">{error.message}</p>
        ) : isPending || !reel ? (
          <p className="text-zinc-500">Загружаем колесо...</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">{reel.name}</h2>
            <p className="mt-2 text-zinc-600">Нажмите, чтобы запустить колесо</p>
            <div className="relative mt-10 min-w-0">
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-1 -translate-x-1/2 bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.15)]" />
              <div
                className="w-full overflow-x-hidden overflow-y-hidden rounded-xl border border-zinc-200 bg-zinc-100 py-4"
                ref={viewportRef}
              >
                <div
                  className="flex w-max flex-nowrap gap-3 transition-transform ease-out"
                  style={{
                    transform: `translateX(-${offset}px)`,
                    transitionDuration: `${spinDuration}ms`,
                    transitionTimingFunction: "cubic-bezier(0.05, 0.7, 0.15, 1)",
                  }}
                >
                  {trackUsers.map((user, index) => (
                    <div
                      className={`flex h-20 w-40 shrink-0 items-center justify-center rounded-lg border border-white/60 px-3 text-center font-medium text-zinc-950 shadow-sm sm:w-52 ${
                        ["bg-sky-300", "bg-amber-300", "bg-emerald-300", "bg-rose-300", "bg-violet-300", "bg-orange-300"][index % 6]
                      }`}
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
              disabled={spin.isPending || isSpinning}
              onClick={() => void handleSpin()}
              type="button"
            >
              {spin.isPending || isSpinning ? "Колесо крутится..." : "Запустить"}
            </button>
            {spin.error && <p className="mt-4 text-red-600">{spin.error.message}</p>}
          </>
        )}
      </main>
      {winnerIndex !== null && reel && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/90 px-6 text-center text-white backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-linear-to-br from-sky-400 via-violet-400 to-rose-400 p-1 shadow-2xl">
            <div className="rounded-[calc(1.5rem-4px)] bg-zinc-950 px-8 py-12 sm:px-16">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">Победитель</p>
              <h2 className="mt-5 wrap-break-word text-5xl font-black tracking-tight sm:text-7xl">{reel.users[winnerIndex]?.name}</h2>
              <button
                className="mt-10 rounded-lg bg-white px-6 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200"
                onClick={() => setWinnerIndex(null)}
                type="button"
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
