"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Activity, Webhook, LogOut } from "lucide-react"

export function OwnerNav() {
  const pathname = usePathname()

  const navItems = [
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

  return (
    <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <div className="text-sm">
              <div className="text-white/50">Dashboard</div>
              <div className="font-medium text-white">Owner</div>
            </div>
            <div className="flex gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white/80"
          >
            <LogOut className="h-4 w-4" />
            Exit
          </Link>
        </div>
      </div>
    </nav>
  )
}
