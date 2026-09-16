import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { Header } from "@/components/header"
import { QueryProvider } from "@/components/query-provider"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Reel",
  description: "Рулетка для выбора случайного каких-либо вариантов",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="relative min-h-full overflow-x-hidden text-[var(--foreground)]">
        <div className="relative z-10">
          <Header />
          <QueryProvider>
            <main className="min-h-dvh flex-1 overflow-x-hidden">{children}</main>
          </QueryProvider>
        </div>
      </body>
    </html>
  )
}
