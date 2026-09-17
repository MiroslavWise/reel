"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"

import { useAddReelUser, useReel } from "@/hooks/use-reel"

const colors = ["#8a7dff", "#ff7ec9", "#6ec9ff", "#7aeac4", "#ffbc7d", "#ff6f91"]

export function ReelView({ id }: { id: string }) {
  const { data: reel, error, isPending } = useReel(id)
  const addUser = useAddReelUser(id)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [name, setName] = useState("")
  const [exclude, setExclude] = useState(false)

  const handleAddUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    try {
      await addUser.mutateAsync({ name: trimmedName, exclude })
      setName("")
      setExclude(false)
      setIsSheetOpen(false)
    } catch {}
  }

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
                      {user.exclude && (
                        <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-600">
                          •
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <button
                className="secondary-button mt-6 w-full rounded-2xl px-4 py-3 text-sm font-bold"
                onClick={() => setIsSheetOpen(true)}
                type="button"
              >
                Добавить участника
              </button>
            </>
          )}
        </div>
      </main>

      {isSheetOpen && (
        <div className="fixed inset-0 z-50 bg-violet-950/30 backdrop-blur-sm" onClick={() => setIsSheetOpen(false)}>
          <div
            aria-labelledby="add-user-title"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 rounded-t-[2rem] border-t border-white/70 bg-white/95 p-5 shadow-[0_-20px_60px_rgba(58,46,94,0.2)] sm:bottom-6 sm:mx-auto sm:max-w-2xl sm:rounded-[2rem]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-violet-200 sm:hidden" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-violet-950" id="add-user-title">Новый участник</h2>
                <p className="mt-1 text-sm text-violet-800/70">Добавьте имя в это колесо.</p>
              </div>
              <button
                aria-label="Закрыть"
                className="secondary-button rounded-xl px-3 py-2 text-sm font-bold"
                onClick={() => setIsSheetOpen(false)}
                type="button"
              >
                Закрыть
              </button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={handleAddUser}>
              <input
                autoFocus
                className="w-full rounded-2xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                onChange={(event) => setName(event.target.value)}
                placeholder="Имя участника"
                value={name}
              />
              <label className="flex items-center gap-3 text-sm font-medium text-violet-900">
                <input
                  checked={exclude}
                  className="h-4 w-4 accent-violet-600"
                  onChange={(event) => setExclude(event.target.checked)}
                  type="checkbox"
                />
                Исключить из розыгрыша
              </label>
              {addUser.error && <p className="text-sm text-rose-600">{addUser.error.message}</p>}
              <button
                className="primary-button w-full rounded-2xl px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!name.trim() || addUser.isPending}
                type="submit"
              >
                {addUser.isPending ? "Добавляем..." : "Добавить"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
