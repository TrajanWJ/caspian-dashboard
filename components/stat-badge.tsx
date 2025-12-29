interface StatBadgeProps {
  label: string
  value: string | number
  variant?: "default" | "success" | "warning" | "danger"
}

export function StatBadge({ label, value, variant = "default" }: StatBadgeProps) {
  const variantStyles = {
    default: "border-white/10 bg-white/5 text-white",
    success: "border-green-500/20 bg-green-500/10 text-green-400",
    warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    danger: "border-red-500/20 bg-red-500/10 text-red-400",
  }

  return (
    <div className={`inline-flex flex-col gap-1 rounded-xl border px-4 py-2 ${variantStyles[variant]}`}>
      <div className="text-xs opacity-60">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  )
}
