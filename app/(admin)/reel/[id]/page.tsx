import type { Metadata } from "next"

import { ReelView } from "@/components/reel-view"

export const metadata: Metadata = {
  title: "Колесо | Reel",
}

export default async function ReelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ReelView id={id} />
}