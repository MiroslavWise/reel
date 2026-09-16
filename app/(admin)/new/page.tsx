import type { Metadata } from "next"

import { CreateReelForm } from "@/components/create-reel-form"

export const metadata: Metadata = {
  title: "Создать колесо | Reel",
}

export default function NewPage() {
  return (
    <div className="min-h-dvh bg-zinc-50 px-6 py-10 pt-20 text-zinc-950">
      <main className="mx-auto w-full max-w-2xl py-6">
        <h2 className="text-2xl font-semibold tracking-tight">Создать колесо</h2>
        <p className="mt-2 text-zinc-600">Добавьте название и участников.</p>
        <div className="mt-8">
          <CreateReelForm />
        </div>
      </main>
    </div>
  )
}