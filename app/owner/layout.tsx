import type React from "react"
import { OwnerNav } from "@/components/owner-nav"

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <OwnerNav />
      {children}
    </div>
  )
}
