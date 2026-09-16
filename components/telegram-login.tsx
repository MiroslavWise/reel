"use client"

export function TelegramLogin() {
  return (
    <a
      className="rounded-lg bg-sky-500 px-5 py-3 font-medium text-white transition-colors hover:bg-sky-600"
      href="/api/auth/telegram/login"
    >
      Войти через Telegram
    </a>
  )
}