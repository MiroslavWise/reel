export default function Loading() {
  return (
    <div className="min-h-dvh animate-pulse bg-zinc-50 px-6 py-10 pt-20 text-zinc-950">
      <main className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <div className="h-9 w-2/3 rounded-lg bg-zinc-200" />
        <div className="mt-8 space-y-3">
          <div className="h-12 rounded-lg bg-zinc-100" />
          <div className="h-12 rounded-lg bg-zinc-100" />
          <div className="h-12 rounded-lg bg-zinc-100" />
        </div>
      </main>
    </div>
  )
}