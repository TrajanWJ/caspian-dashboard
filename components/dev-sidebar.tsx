"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Code,
    Globe,
    Users,
    Database,
    BarChart3,
    Bug,
    Zap,
    Activity,
    Radio,
    Settings,
    Home
} from "lucide-react"

const devNavigation = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                href: "/dev",
                icon: LayoutDashboard
            },
            {
                title: "Live Stream",
                href: "/dev/live-stream",
                icon: Radio
            }
        ]
    },
    {
        title: "Testing & Monitoring",
        items: [
            {
                title: "Components",
                href: "/dev#components",
                icon: Code
            },
            {
                title: "API Testing",
                href: "/dev#api",
                icon: Globe
            },
            {
                title: "User Flows",
                href: "/dev#flows",
                icon: Users
            },
            {
                title: "Performance",
                href: "/dev#performance",
                icon: BarChart3
            },
            {
                title: "Debugging",
                href: "/dev#debugging",
                icon: Bug
            }
        ]
    },
    {
        title: "Data & Webhooks",
        items: [
            {
                title: "Database",
                href: "/dev/database",
                icon: Database
            },
            {
                title: "Webhooks",
                href: "/dev/webhook",
                icon: Zap
            },
            {
                title: "Monitoring",
                href: "/dev#monitoring",
                icon: Activity
            }
        ]
    },
    {
        title: "System",
        items: [
            {
                title: "Back to App",
                href: "/",
                icon: Home
            },
            {
                title: "Settings",
                href: "/dev/settings",
                icon: Settings
            }
        ]
    }
]

export function DevSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 bg-card border-r border-border min-h-screen">
            <div className="p-6 border-b border-border">
                <Link href="/dev" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Code className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Dev Suite</h1>
                        <p className="text-xs text-muted-foreground">Development Tools</p>
                    </div>
                </Link>
            </div>

            <nav className="p-4 space-y-6">
                {devNavigation.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            {section.title}
                        </h3>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href.includes('#') && pathname === item.href.split('#')[0])

                                return (
                                    <li key={item.title}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                                                isActive
                                                    ? "bg-blue-600 text-white"
                                                    : "text-foreground hover:bg-card hover:text-foreground"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </div>
    )
}