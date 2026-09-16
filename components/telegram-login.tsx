"use client"

export function TelegramLogin() {
  return (
    <a
      className="primary-button inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-lg"
      href="/api/auth/telegram/login"
    >
      <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.6 4.2 18.4 19.3c-.24 1.07-.87 1.34-1.76.84l-4.84-3.57-2.34 2.25c-.26.26-.48.48-.99.48l.35-4.93 8.97-8.1c.39-.35-.09-.54-.61-.19L6.1 12.9 1.35 11.4c-1.03-.32-1.05-1.03.22-1.52L20.14 2.6c.87-.32 1.63.19 1.46 1.6Z" />
      </svg>
      Войти
    </a>
  )
}