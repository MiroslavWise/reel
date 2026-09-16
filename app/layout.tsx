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
      <body className="min-h-full flex flex-col">
        <Header />
        <QueryProvider>
          <main className="flex-1 pt-16">{children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}
