import type { ReactNode } from "react"

import { AdminPage } from "@/components/admin-page"

export default function AdminTemplate({ children }: { children: ReactNode }) {
  return <AdminPage>{children}</AdminPage>
}
