"use client"

import { useReel } from "@/hooks/use-reel"

export function ActiveReelView({ id }: { id: string }) {
  const { data: reel, error, isPending } = useReel(id)

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <main className="w-full max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm">
        {error ? (
          <p className="text-red-600">{error.message}</p>
        ) : isPending || !reel ? (
          <p className="text-zinc-500">Загружаем колесо...</p>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">{reel.name}</h1>
            <p className="mt-2 text-zinc-600">Готово к запуску</p>
            <p className="mt-8 text-sm text-zinc-500">Участников: {reel.users.length}</p>
          </>
        )}
      </main>
    </div>
  )
}