export default function Loading() {
  return (
    <div className="flex min-h-screen animate-pulse items-center justify-center bg-zinc-50 px-6 pt-20">
      <main className="w-full max-w-2xl rounded-2xl bg-white p-10 shadow-sm">
        <div className="mx-auto h-9 w-2/3 rounded-lg bg-zinc-200" />
        <div className="mx-auto mt-4 h-5 w-1/3 rounded bg-zinc-100" />
      </main>
    </div>
  )
}