import type React from "react"
import { DevSidebar } from "@/components/dev-sidebar"

export default function DevLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black">
            <DevSidebar />
            <div className="ml-64">
                {children}
            </div>
        </div>
    )
}