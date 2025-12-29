import { getPromoters, getOrdersByPromoter } from "@/lib/data-store"
import { Card } from "@/components/ui/card"
import { Award, TrendingUp, DollarSign, Ticket } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"

export default async function PromotersPage() {
  const promoters = await getPromoters()

  const promotersWithStats = await Promise.all(
    promoters.map(async (promoter) => {
      const orders = await getOrdersByPromoter(promoter.id)
      return {
        ...promoter,
        orderCount: orders.length,
      }
    }),
  )

  const sortedPromoters = promotersWithStats.sort((a, b) => b.total_tickets_sold - a.total_tickets_sold)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "from-cyan-500 to-blue-500"
      case "Gold":
        return "from-yellow-500 to-orange-500"
      case "Silver":
        return "from-gray-400 to-gray-600"
      case "Bronze":
        return "from-orange-600 to-red-600"
      default:
        return "from-gray-500 to-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <div className="ml-64">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12">
            <h1 className="mb-2 text-3xl font-bold text-white">Promoter Network</h1>
            <p className="text-white/60">Complete overview of all promoters and their performance</p>
          </div>

          {/* Summary Stats */}
          <div className="mb-12 grid gap-6 sm:grid-cols-4">
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 text-sm text-white/40">Total Promoters</div>
              <div className="text-4xl font-bold text-white">{promoters.length}</div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 text-sm text-white/40">Active Promoters</div>
              <div className="text-4xl font-bold text-white">
                {promoters.filter((p) => p.total_tickets_sold > 0).length}
              </div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 text-sm text-white/40">Platinum Tier</div>
              <div className="text-4xl font-bold text-white">{promoters.filter((p) => p.tier === "Platinum").length}</div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 text-sm text-white/40">Total Commission</div>
              <div className="text-4xl font-bold text-white">
                {formatCurrency(promoters.reduce((sum, p) => sum + p.total_commission_earned, 0))}
              </div>
            </Card>
          </div>

          {/* Promoter List */}
          <div className="space-y-3">
            {sortedPromoters.map((promoter) => (
              <Link key={promoter.id} href={`/promoter/${promoter.tracking_link}`}>
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:bg-white/[0.07] hover:scale-[1.01]">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-2xl font-bold text-white">
                        #{promoter.rank}
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-white">
                          {promoter.first_name} {promoter.last_name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-white/60">{promoter.tracking_link}</span>
                          <div
                            className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${getTierColor(promoter.tier)} px-3 py-1 text-xs font-bold text-white`}
                          >
                            <Award className="h-3 w-3" />
                            {promoter.tier}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <div className="mb-1 flex items-center gap-1 text-xs text-white/40">
                          <Ticket className="h-3 w-3" />
                          TICKETS
                        </div>
                        <div className="text-2xl font-bold text-white">{promoter.total_tickets_sold}</div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-1 text-xs text-white/40">
                          <TrendingUp className="h-3 w-3" />
                          REVENUE
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {formatCurrency(promoter.total_revenue_generated)}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-1 text-xs text-white/40">
                          <DollarSign className="h-3 w-3" />
                          COMMISSION
                        </div>
                        <div className="text-2xl font-bold text-red-400">
                          {formatCurrency(promoter.total_commission_earned)}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-xs text-white/40">RATE</div>
                        <div className="text-2xl font-bold text-white">
                          {(promoter.commission_rate * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
