import type { Metadata } from "next"

import { AdminPage } from "@/components/admin-page"
import { CreateReelForm } from "@/components/create-reel-form"

export const metadata: Metadata = {
  title: "Создать колесо | Reel",
}

export default function NewPage() {
  return (
    <AdminPage>
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 px-6 py-10 text-zinc-950">
        <main className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-semibold tracking-tight">Создать колесо</h1>
          <p className="mt-2 text-zinc-600">Добавьте название и участников.</p>
          <div className="mt-8">
            <CreateReelForm />
          </div>
        </main>
      </div>
    </AdminPage>
  )
}
