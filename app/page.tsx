import { AuthScreen } from "@/components/auth-screen"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <main className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-10 text-center shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Reel</h1>
          <p className="mt-2 text-zinc-600">Авторизация через Telegram</p>
        </div>
        <AuthScreen />
      </main>
    </div>
  )
}
