import { getPromoters, getOrders, getEvents } from "@/lib/data-store"
import { Card } from "@/components/ui/card"
import { TrendingUp, Ticket, Users, Calendar, Target } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default async function OwnerDashboard() {
  const promoters = await getPromoters()
  const orders = await getOrders()
  const events = await getEvents()

  const activeOrders = orders.filter((o) => !o.cancelled && !o.refunded)
  const totalTickets = activeOrders.reduce((sum, o) => sum + o.items.length, 0)
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.subtotal, 0)
  const totalCommission = activeOrders.reduce((sum, o) => sum + o.commission_earned, 0)
  const netRevenue = totalRevenue - totalCommission
  const activePromoters = promoters.filter((p) => p.total_tickets_sold > 0).length
  const currentEvent = events.find((e) => e.is_current)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const commissionRate = totalRevenue > 0 ? (totalCommission / totalRevenue) * 100 : 0

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <div className="ml-64">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-white/40">Total Revenue</div>
            <div className="mb-8 flex items-baseline gap-6">
              <div className="text-7xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
              <div className="flex flex-col">
                <div className="text-xl text-white/60">Net: {formatCurrency(netRevenue)}</div>
                <div className="text-sm text-red-400">-{formatCurrency(totalCommission)} commission</div>
              </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid gap-6 lg:grid-cols-4">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-2 flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white/60">Total Tickets</span>
                </div>
                <div className="text-4xl font-bold text-white">{totalTickets}</div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white/60">Active Promoters</span>
                </div>
                <div className="text-4xl font-bold text-white">{activePromoters}</div>
                <div className="mt-1 text-xs text-white/40">of {promoters.length} total</div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-white/60">Avg Commission Rate</span>
                </div>
                <div className="text-4xl font-bold text-white">{commissionRate.toFixed(1)}%</div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-white/60">Avg Ticket Price</span>
                </div>
                <div className="text-4xl font-bold text-white">
                  {formatCurrency(totalTickets > 0 ? totalRevenue / totalTickets : 0)}
                </div>
              </Card>
            </div>
          </div>

          {/* Current Event Highlight */}
          {currentEvent && (
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-white/60" />
                <h2 className="text-lg font-medium text-white">Active Event</h2>
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              </div>
              <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 backdrop-blur">
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">{currentEvent.name}</h3>
                  <p className="text-white/60">
                    {new Date(currentEvent.start_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <div className="mb-1 text-sm text-white/40">TICKETS SOLD</div>
                    <div className="text-3xl font-bold text-white">{currentEvent.total_tickets_sold}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-white/40">REVENUE</div>
                    <div className="text-3xl font-bold text-white">{formatCurrency(currentEvent.total_revenue)}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-white/40">STATUS</div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Active
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Top Performers */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-white">Top Performers</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {promoters
                .sort((a, b) => b.total_tickets_sold - a.total_tickets_sold)
                .slice(0, 6)
                .map((promoter, idx) => (
                  <Card key={promoter.id} className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-lg font-bold text-white">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {promoter.first_name} {promoter.last_name}
                          </div>
                          <div className="text-sm text-white/60">{promoter.tracking_link}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{promoter.total_tickets_sold}</div>
                        <div className="text-xs text-white/40">tickets</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                      <div>
                        <div className="text-xs text-white/40">REVENUE</div>
                        <div className="font-semibold text-white">{formatCurrency(promoter.total_revenue_generated)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/40">COMMISSION</div>
                        <div className="font-semibold text-red-400">
                          {formatCurrency(promoter.total_commission_earned)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/40">TIER</div>
                        <div className="font-semibold text-white">{promoter.tier}</div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
