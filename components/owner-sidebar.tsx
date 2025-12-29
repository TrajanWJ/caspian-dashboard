"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    LayoutDashboard,
    Users,
    Activity,
    Webhook,
    Settings,
    Shield,
    BarChart3,
    Trophy,
    History,
    Share2,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    LogOut,
    Menu,
    Database,
    TestTube,
    FileText,
    UserCheck,
    Crown,
    TrendingUp,
    Eye
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OwnerSidebarProps {
    className?: string
}

interface NavItem {
    href: string
    label: string
    icon: any
    badge?: string
    children?: NavItem[]
}

export function OwnerSidebar({ className }: OwnerSidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [expandedGroups, setExpandedGroups] = useState<string[]>(["overview", "management"])

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev =>
            prev.includes(group)
                ? prev.filter(g => g !== group)
                : [...prev, group]
        )
    }

    const isGroupExpanded = (group: string) => expandedGroups.includes(group)

    const navigationItems: NavItem[] = [
        {
            href: "/owner",
            label: "Overview",
            icon: LayoutDashboard,
        },
        {
            href: "/owner/overview",
            label: "Analytics",
            icon: BarChart3,
            children: [
                {
                    href: "/owner/overview/revenue",
                    label: "Revenue",
                    icon: Trophy,
                },
                {
                    href: "/owner/overview/performance",
                    label: "Performance",
                    icon: TrendingUp,
                },
                {
                    href: "/owner/overview/trends",
                    label: "Trends",
                    icon: BarChart3,
                },
            ]
        },
        {
            href: "/owner/management",
            label: "Management",
            icon: Users,
            badge: "5",
            children: [
                {
                    href: "/owner/promoters",
                    label: "Promoters",
                    icon: UserCheck,
                },
                {
                    href: "/owner/accounts",
                    label: "Accounts",
                    icon: Shield,
                },
                {
                    href: "/owner/events",
                    label: "Events",
                    icon: Activity,
                },
            ]
        },
        {
            href: "/owner/webhooks",
            label: "Webhooks & Data",
            icon: Webhook,
            children: [
                {
                    href: "/owner/webhooks",
                    label: "Live Activity",
                    icon: Activity,
                },
                {
                    href: "/owner/webhooks/test",
                    label: "Testing",
                    icon: TestTube,
                },
                {
                    href: "/owner/webhooks/logs",
                    label: "Event Logs",
                    icon: FileText,
                },
            ]
        },
        {
            href: "/owner/config",
            label: "Configuration",
            icon: Settings,
            children: [
                {
                    href: "/owner/config",
                    label: "Settings",
                    icon: Settings,
                },
                {
                    href: "/owner/config/webhooks",
                    label: "Webhook Setup",
                    icon: Webhook,
                },
                {
                    href: "/owner/config/system",
                    label: "System",
                    icon: Database,
                },
            ]
        },
    ]

    const isActive = (href: string) => {
        if (href === "/owner") {
            return pathname === "/owner"
        }
        return pathname.startsWith(href)
    }

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-50 h-screen border-r border-white/10 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-xl transition-all duration-300 shadow-xl",
                isCollapsed ? "w-16" : "w-80",
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
                        <div className="text-white/50">Dashboard</div>
                        <div className="font-medium text-white flex items-center gap-2">
                            <Crown className="h-4 w-4 text-purple-400" />
                            Owner Panel
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Items */}
            <nav className="flex flex-col gap-1 p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {navigationItems.map((item) => {
                    const isItemActive = isActive(item.href)
                    const hasChildren = item.children && item.children.length > 0
                    const groupName = item.href.replace("/", "")

                    return (
                        <div key={item.href} className="space-y-1">
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isItemActive
                                        ? "bg-white/10 text-white"
                                        : "text-white/60 hover:bg-white/5 hover:text-white/80"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("h-5 w-5", isCollapsed && "mx-auto")} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </div>
                                {!isCollapsed && hasChildren && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            toggleGroup(groupName)
                                        }}
                                        className="p-1 hover:bg-white/10 rounded"
                                    >
                                        {isGroupExpanded(groupName) ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                )}
                                {!isCollapsed && item.badge && (
                                    <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>

                            {/* Sub-items */}
                            {hasChildren && !isCollapsed && isGroupExpanded(groupName) && (
                                <div className="ml-6 space-y-1">
                                    {item.children?.map((child) => {
                                        const isChildActive = isActive(child.href)
                                        return (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                                    isChildActive
                                                        ? "bg-white/10 text-white border-l-2 border-purple-400"
                                                        : "text-white/60 hover:bg-white/5 hover:text-white/80"
                                                )}
                                            >
                                                <child.icon className="h-4 w-4" />
                                                <span>{child.label}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            {/* Footer Section */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent p-4">
                <div className="space-y-2">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <Link
                        href="/"
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white/80 hover:shadow-lg"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                            <LogOut className="h-4 w-4" />
                        </div>
                        {!isCollapsed && <span className="font-medium">Exit</span>}
                    </Link>
                </div>
            </div>
        </aside>
    )
}