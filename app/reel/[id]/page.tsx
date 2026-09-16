import type { Metadata } from "next"

import { AdminPage } from "@/components/admin-page"
import { ReelView } from "@/components/reel-view"

export const metadata: Metadata = {
  title: "Колесо | Reel",
}

export default async function ReelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <AdminPage>
      <ReelView id={id} />
    </AdminPage>
  )
}
