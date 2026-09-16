"use client"

import Link from "next/link"

import { useReel } from "@/hooks/use-reel"

const colors = ["#8a7dff", "#ff7ec9", "#6ec9ff", "#7aeac4", "#ffbc7d", "#ff6f91"]

export function ReelView({ id }: { id: string }) {
  const { data: reel, error, isPending } = useReel(id)

  return (
    <div className="min-h-dvh px-4 pb-16 pt-24 sm:px-6">
      <main className="mx-auto w-full max-w-3xl fade-in-up">
        <div className="glass-panel rounded-4xl p-5 sm:p-8">
          {error ? (
            <p className="text-rose-600">{error.message}</p>
          ) : isPending || !reel ? (
            <p className="text-violet-700/75">Загружаем колесо...</p>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">wheel</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-violet-950 sm:text-4xl">{reel.name}</h2>
                </div>
                <Link
                  className="primary-button inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold"
                  href={`/reel/${reel.id}/active`}
                >
                  Запустить
                </Link>
              </div>

              <div className="mt-8 grid gap-3">
                {reel.users.map((user, index) => {
                  const tone = colors[index % colors.length]

                  return (
                    <div
                      className="flex items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 shadow-[0_12px_30px_rgba(120,90,175,0.08)]"
                      key={`${user.name}-${index}`}
                      style={{ borderLeft: `6px solid ${tone}` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tone }} />
                        <span className="font-medium text-violet-950">{user.name}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
