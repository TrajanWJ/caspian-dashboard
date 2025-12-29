import type React from "react"
import { OwnerSidebar } from "@/components/owner-sidebar"

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <OwnerSidebar />
      {children}
    </div>
  )
}
