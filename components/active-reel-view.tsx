"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

import { useReelPlayback } from "@/hooks/use-reel"

const palette = ["#8a7dff", "#ff7ec9", "#6ec9ff", "#7aeac4", "#ffbc7d", "#ff6f91"]

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
  const [spinProgress, setSpinProgress] = useState(0)
  const finishTimerRef = useRef<number | null>(null)
  const spinFrameRef = useRef<number | null>(null)

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
      left: 4 + ((index * 13) % 82),
      top: 10 + ((index * 19) % 72),
      duration: 14 + (index % 6) * 2,
      delay: -((index % 8) * 1.7),
      rotation: -8 + (index % 9) * 2,
      index,
    }))
  }, [reel?.users])

  const handleSpin = async () => {
    if (!reel || spin.isPending || isSpinning || !cardWidth || !viewportWidth) return

    if (spinFrameRef.current) window.cancelAnimationFrame(spinFrameRef.current)
    setIsSpinning(true)
    setWinnerIndex(null)
    setSpinProgress(0)

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

      const startedAt = performance.now()
      const updateProgress = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        setSpinProgress(progress)

        if (progress < 1) {
          spinFrameRef.current = window.requestAnimationFrame(updateProgress)
          return
        }

        spinFrameRef.current = null
      }

      spinFrameRef.current = window.requestAnimationFrame(updateProgress)

      finishTimerRef.current = window.setTimeout(() => {
        setWinnerIndex(result.winnerIndex)
        setIsSpinning(false)
        setSpinProgress(1)
      }, duration)
    } catch {
      setIsSpinning(false)
      setSpinProgress(0)
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center overflow-hidden px-4 pb-16 pt-24 text-foreground sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {floatingUsers.map((user) => (
          <span
            className="reel-name-float absolute max-w-[35vw] truncate text-lg font-semibold text-violet-900/15 sm:text-2xl"
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

      <main className="relative z-10 w-full max-w-5xl fade-in-up">
        <div className="glass-panel rounded-4xl p-5 sm:p-8">
          {error ? (
            <p className="text-rose-600">{error.message}</p>
          ) : isPending || !reel ? (
            <p className="text-violet-700/75">Загружаем колесо...</p>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">reel</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                  <span className="gradient-title">{reel.name}</span>
                </h2>
                <p className="mt-2 text-sm text-violet-800/75">Нажмите, чтобы запустить вращение и выбрать победителя.</p>
              </div>

              <div className="relative mt-8 min-w-0">
                <div className="reel-indicator" aria-hidden="true" />
                <div
                  className="w-full overflow-hidden rounded-[1.75rem] border border-violet-100 bg-linear-to-r from-violet-50 via-white to-pink-50 px-3 py-4 shadow-[inset_0_0_30px_rgba(255,255,255,0.8)] sm:px-4"
                  ref={viewportRef}
                >
                  <motion.div
                    animate={{ x: -offset }}
                    className="flex w-max flex-nowrap gap-3"
                    transition={{ duration: spinDuration / 1000, ease: [0.05, 0.7, 0.15, 1] }}
                  >
                    {trackUsers.map((user, index) => {
                      const accent = palette[index % palette.length]
                      const cardBlur = isSpinning ? Math.max(0, 4 * (1 - spinProgress)) : 0

                      return (
                        <motion.div
                          animate={
                            isSpinning
                              ? { scale: 0.98, filter: `blur(${cardBlur}px)` }
                              : { scale: 1, filter: "blur(0px)" }
                          }
                          className="flex h-24 w-40 shrink-0 items-center justify-center rounded-2xl border border-white/80 px-3 text-center font-bold text-violet-950 shadow-[0_10px_18px_rgba(58,46,94,0.07)] sm:w-52"
                          key={`${user.name}-${index}`}
                          ref={index === 0 ? cardRef : undefined}
                          style={{
                            background: `linear-gradient(180deg, rgba(255,255,255,0.7), ${accent}33 28%, ${accent}59 100%)`,
                            boxShadow: `0 0 0 1px rgba(255,255,255,0.6), 0 18px 32px ${accent}26`,
                          }}
                          transition={{ duration: 0.22 }}
                        >
                          <span className="max-w-full truncate px-2 text-sm sm:text-base">{user.name}</span>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  className="primary-button inline-flex items-center justify-center rounded-2xl px-7 py-3 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={spin.isPending || isSpinning}
                  onClick={() => void handleSpin()}
                  type="button"
                >
                  {spin.isPending || isSpinning ? "Колесо крутится..." : "Запустить"}
                </button>
              </div>

              {spin.error && <p className="mt-4 text-center text-rose-600">{spin.error.message}</p>}
            </>
          )}
        </div>
      </main>

      <AnimatePresence>
        {winnerIndex !== null && reel && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-violet-950/70 px-6 text-center backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-xl rounded-4xl p-px shadow-[0_30px_80px_rgba(138,125,255,0.45)]"
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              style={{ background: "linear-gradient(135deg, #8a7dff 0%, #ff7ec9 35%, #6ec9ff 100%)" }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            >
              <div className="rounded-[calc(2rem-1px)] bg-[#130d29] px-7 py-10 sm:px-12">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Победитель</p>
                <div className="mt-5 flex justify-center text-5xl sm:text-7xl">🎉</div>
                <h3 className="mt-4 wrap-break-word text-4xl font-black tracking-tight text-white sm:text-6xl">
                  {reel.users[winnerIndex]?.name}
                </h3>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    className="primary-button rounded-2xl px-5 py-3 text-sm font-bold"
                    onClick={() => {
                      setWinnerIndex(null)
                      void handleSpin()
                    }}
                    type="button"
                  >
                    Крутить ещё
                  </button>
                  <button
                    className="secondary-button rounded-2xl px-5 py-3 text-sm font-bold"
                    onClick={() => setWinnerIndex(null)}
                    type="button"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
