import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  trend?: {
    value: number
    positive: boolean
  }
  subtitle?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-blue-400",
  trend,
  subtitle,
}: MetricCardProps) {
  return (
    <Card className="group border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:bg-white/[0.07]">
      <div className="mb-3 flex items-start justify-between">
        <div className={`rounded-xl bg-white/5 p-3 transition-colors group-hover:bg-white/10`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.positive ? "text-green-400" : "text-red-400"}`}>
            {trend.positive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mb-1 text-sm font-medium uppercase tracking-wider text-white/40">{label}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-white/40">{subtitle}</div>}
    </Card>
  )
}
