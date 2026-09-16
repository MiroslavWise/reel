import type { Metadata } from "next"

import { AuthPage } from "@/components/auth-page"
import { ActiveReelView } from "@/components/active-reel-view"

export const metadata: Metadata = {
  title: "Запуск колеса | Reel",
}

export default async function ActiveReelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <AuthPage>
      <ActiveReelView id={id} />
    </AuthPage>
  )
}