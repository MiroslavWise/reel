"use client"

import { useEffect, type PropsWithChildren } from "react"
import { useRouter } from "next/navigation"

import { AuthStatus } from "@/enum/auth"
import { useAuthStore } from "@/stores/auth"

export function AuthPage({ children }: PropsWithChildren) {
  const router = useRouter()
  const { dispatchCheckAuth, status } = useAuthStore()

  useEffect(() => {
    void dispatchCheckAuth()
  }, [dispatchCheckAuth])

  useEffect(() => {
    if (status === AuthStatus.UNAUTHENTICATED) router.replace("/")
  }, [router, status])

  if (status !== AuthStatus.AUTHENTICATED) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 px-6 text-zinc-500">
        Проверяем доступ...
      </div>
    )
  }

  return <>{children}</>
}