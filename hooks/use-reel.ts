"use client"

import { useQuery } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"

export interface ReelUser {
  name: string
  exclude: boolean
}

export interface ReelDetails {
  id: string
  name: string
  users: ReelUser[]
}

async function fetchReel(id: string) {
  const response = await fetch(`/api/reels/${id}`)
  const data = (await response.json()) as ReelDetails & { error?: string }

  if (!response.ok) throw new Error(data.error ?? "Не удалось загрузить колесо")
  return data
}

export function useReel(id: string) {
  return useQuery({
    queryKey: ["reel", id],
    queryFn: () => fetchReel(id),
  })
}

export interface PlayableReel {
  id: string
  name: string
  users: Array<{ name: string }>
}

async function fetchPlayableReel(id: string) {
  const response = await fetch(`/api/reels/${id}/play`)
  const data = (await response.json()) as PlayableReel & { error?: string }
  if (!response.ok) throw new Error(data.error ?? "Не удалось загрузить колесо")
  return data
}

interface SpinResult {
  winnerIndex: number
}

async function spinReel(id: string): Promise<SpinResult> {
  const response = await fetch(`/api/reels/${id}/play`, { method: "POST" })
  const data = (await response.json()) as { winnerIndex?: number; error?: string }
  if (!response.ok || data.winnerIndex === undefined) throw new Error(data.error ?? "Не удалось запустить колесо")
  return { winnerIndex: data.winnerIndex }
}

export function useReelPlayback(id: string) {
  const query = useQuery({
    queryKey: ["reel-playback", id],
    queryFn: () => fetchPlayableReel(id),
  })
  const spin = useMutation({ mutationFn: () => spinReel(id) })

  return { ...query, spin }
}