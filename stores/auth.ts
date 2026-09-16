"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { AuthStatus } from "@/enum/auth"

export interface AuthUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAdmin: boolean
  status: AuthStatus
  dispatchCheckAuth: () => Promise<void>
  dispatchLogin: (token: string, user: AuthUser) => void
  dispatchLogout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAdmin: false,
      status: AuthStatus.PENDING,
      dispatchCheckAuth: async () => {
        set({ status: AuthStatus.PENDING })

        try {
          const response = await fetch("/api/auth/me", { cache: "no-store" })
          const data = (await response.json()) as { user: AuthUser | null; isAdmin: boolean }

          if (!response.ok || !data.user) {
            set({ token: null, user: null, isAdmin: false, status: AuthStatus.UNAUTHENTICATED })
            return
          }

          set({ token: String(data.user.id), user: data.user, isAdmin: data.isAdmin, status: AuthStatus.AUTHENTICATED })
        } catch {
          set({ token: null, user: null, isAdmin: false, status: AuthStatus.UNAUTHENTICATED })
        }
      },
      dispatchLogin: (token, user) => {
        set({ token, user, isAdmin: false, status: AuthStatus.AUTHENTICATED })
      },
      dispatchLogout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" })
        } finally {
          set({ token: null, user: null, isAdmin: false, status: AuthStatus.UNAUTHENTICATED })
        }
      },
    }),
    {
      name: "auth-storage-reel",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, user: state.user, isAdmin: state.isAdmin }) as AuthState,
    },
  ),
)
