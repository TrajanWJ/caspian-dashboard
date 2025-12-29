import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar variant="owner" />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
