"use client"

import { useEffect, useState } from "react"

interface ReelUser {
  name: string
  exclude: boolean
}

interface ReelDetails {
  id: string
  name: string
  users: ReelUser[]
}

export function ReelView({ id }: { id: string }) {
  const [reel, setReel] = useState<ReelDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/reels/${id}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as ReelDetails & { error?: string }
        if (!response.ok) throw new Error(data.error ?? "Не удалось загрузить колесо")
        return data
      })
      .then(setReel)
      .catch((requestError: Error) => setError(requestError.message))
  }, [id])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 px-6 py-10 text-zinc-950">
      <main className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : !reel ? (
          <p className="text-zinc-500">Загружаем колесо...</p>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">{reel.name}</h1>
            <div className="mt-8 space-y-2">
              {reel.users.map((user, index) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
                  key={`${user.name}-${index}`}
                >
                  <span>{user.name}</span>
                  {user.exclude && <span className="text-sm text-zinc-500">Исключён</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
