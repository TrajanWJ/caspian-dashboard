"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    LayoutDashboard,
    Users,
    Activity,
    Webhook,
    BarChart3,
    Trophy,
    History,
    Share2,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
    variant?: "owner" | "promoter"
    trackingLink?: string
    promoterName?: string
    className?: string
}

export function Sidebar({ variant = "owner", trackingLink, promoterName, className }: SidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    const ownerNavItems = [
        {
            href: "/owner",
            label: "Overview",
            icon: LayoutDashboard,
        },
        {
            href: "/owner/promoters",
            label: "Promoters",
            icon: Users,
        },
        {
            href: "/owner/events",
            label: "Events",
            icon: Activity,
        },
        {
            href: "/owner/webhooks",
            label: "Webhooks",
            icon: Webhook,
        },
    ]

    const promoterNavItems = [
        {
            href: `/promoter/${trackingLink}`,
            label: "Dashboard",
            icon: BarChart3,
        },
        {
            href: `/promoter/${trackingLink}/performance`,
            label: "Performance",
            icon: Trophy,
        },
        {
            href: `/promoter/${trackingLink}/history`,
            label: "History",
            icon: History,
        },
        {
            href: `/promoter/${trackingLink}/referral`,
            label: "Referral",
            icon: Share2,
        },
    ]

    const navItems = variant === "promoter" ? promoterNavItems : ownerNavItems

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-50 h-screen border-r border-white/10 bg-black/60 backdrop-blur-xl transition-all duration-300",
                isCollapsed ? "w-16" : "w-64",
                className
            )}
        >
            {/* Collapse Toggle Button */}
            <div className="flex h-16 items-center justify-end border-b border-white/10 px-4">
                <button
                    onClick={toggleSidebar}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Header Section */}
            {!isCollapsed && (
                <div className="border-b border-white/10 px-6 py-4">
                    <div className="text-sm">
                        <div className="text-white/50">{variant === "promoter" ? "Promoter" : "Dashboard"}</div>
                        <div className="font-medium text-white">
                            {variant === "promoter" ? promoterName : "Owner"}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Items */}
            <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:bg-white/5 hover:text-white/80"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isCollapsed && "mx-auto")} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Section */}
            {!isCollapsed && (
                <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:text-white/80"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Exit</span>
                    </Link>
                </div>
            )}
        </aside>
    )
}

// Legacy component for backward compatibility
export function OwnerNav() {
    return (
        <Sidebar variant="owner" />
    )
}

export function PromoterNav({ trackingLink, promoterName }: { trackingLink: string; promoterName: string }) {
    return (
        <Sidebar variant="promoter" trackingLink={trackingLink} promoterName={promoterName} />
    )
}