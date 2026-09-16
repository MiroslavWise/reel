"use client"

import { useQuery } from "@tanstack/react-query"

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