"use client"

import Link from "next/link"
import { useReel } from "@/hooks/use-reel"

export function ReelView({ id }: { id: string }) {
  const { data: reel, error, isPending } = useReel(id)

  return (
    <div className="min-h-dvh pt-20 bg-zinc-50 px-6 py-10 text-zinc-950">
      <main className="mx-auto w-full max-w-2xl bg-white">
        {error ? (
          <p className="text-red-600">{error.message}</p>
        ) : isPending || !reel ? (
          <p className="text-zinc-500">Загружаем колесо...</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">{reel.name}</h2>
              <Link
                className="shrink-0 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                href={`/reel/${reel.id}/active`}
              >
                Запустить
              </Link>
            </div>
            <div className="mt-8 space-y-2">
              {reel.users.map((user, index) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
                  key={`${user.name}-${index}`}
                >
                  <span>{user.name}</span>
                  {user.exclude && (
                    <span
                      aria-label="Участник исключён"
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-pink-400"
                      title="Участник исключён"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
