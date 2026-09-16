"use client"

import { useEffect, useRef } from "react"

export function TelegramLogin() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
    if (!botUsername || !containerRef.current) return

    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.async = true
    script.setAttribute("data-telegram-login", botUsername)
    script.setAttribute("data-size", "large")
    script.setAttribute("data-auth-url", `${window.location.origin}/api/auth/telegram`)
    script.setAttribute("data-request-access", "write")
    containerRef.current.replaceChildren(script)

    return () => script.remove()
  }, [])

  return <div ref={containerRef} aria-label="Войти через Telegram" />
}