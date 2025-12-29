import { notFound } from "next/navigation"
import { getPromoterByTrackingLink, getOrdersByPromoter, getEvents } from "@/lib/data-store"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Award, Target } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default async function PerformancePage({ params }: { params: Promise<{ tracking_link: string }> }) {
  const { tracking_link } = await params
  const promoter = await getPromoterByTrackingLink(tracking_link)

  if (!promoter) {
    notFound()
  }

  const orders = await getOrdersByPromoter(promoter.id)
  const events = await getEvents()

  // Group by event
  const eventPerformance = events
    .map((event) => {
      const eventOrders = orders.filter((o) => o.event_id === event.id)
      const tickets = eventOrders.reduce((sum, o) => sum + o.items.length, 0)
      const revenue = eventOrders.reduce((sum, o) => sum + o.subtotal, 0)
      const commission = eventOrders.reduce((sum, o) => sum + o.commission_earned, 0)
      return { event, tickets, revenue, commission, orders: eventOrders.length }
    })
    .filter((e) => e.tickets > 0)
    .sort((a, b) => new Date(b.event.start_date).getTime() - new Date(a.event.start_date).getTime())

  // Calculate trends
  const last3Events = eventPerformance.slice(0, 3)
  const avgTicketsLast3 =
    last3Events.length > 0 ? last3Events.reduce((sum, e) => sum + e.tickets, 0) / last3Events.length : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-400" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-400" />
    return <Minus className="h-4 w-4 text-white/40" />
  }

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-400"
    if (current < previous) return "text-red-400"
    return "text-white/40"
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="promoter" trackingLink={tracking_link} promoterName={`${promoter.first_name} ${promoter.last_name}`} />
      <div className="ml-64">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12">
            <h1 className="mb-2 text-3xl font-bold text-white">Performance Analytics</h1>
            <p className="text-white/60">Deep dive into your sales performance and trends</p>
          </div>

          {/* Performance Insights */}
          <div className="mb-12 grid gap-6 lg:grid-cols-3">
            <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium uppercase tracking-wider text-white/60">Avg Per Event</span>
              </div>
              <div className="text-4xl font-bold text-white">
                {eventPerformance.length > 0 ? Math.round(promoter.total_tickets_sold / eventPerformance.length) : 0}
              </div>
              <div className="mt-2 text-sm text-white/60">tickets per event</div>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium uppercase tracking-wider text-white/60">Conversion</span>
              </div>
              <div className="text-4xl font-bold text-white">
                {promoter.total_tickets_sold > 0
                  ? ((promoter.total_revenue_generated / promoter.total_tickets_sold / 50) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <div className="mt-2 text-sm text-white/60">estimated conversion rate</div>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium uppercase tracking-wider text-white/60">Recent Momentum</span>
              </div>
              <div className="text-4xl font-bold text-white">{Math.round(avgTicketsLast3)}</div>
              <div className="mt-2 text-sm text-white/60">avg tickets (last 3 events)</div>
            </Card>
          </div>

          {/* Event by Event Performance */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-white">Event Performance</h2>
            <div className="space-y-4">
              {eventPerformance.map((item, idx) => {
                const previous = eventPerformance[idx + 1]
                const ticketChange = previous ? ((item.tickets - previous.tickets) / previous.tickets) * 100 : 0

                return (
                  <Card key={item.event.id} className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white">{item.event.name}</h3>
                          {previous && (
                            <div
                              className={`flex items-center gap-1 text-sm ${getTrendColor(item.tickets, previous.tickets)}`}
                            >
                              {getTrendIcon(item.tickets, previous.tickets)}
                              <span>
                                {ticketChange > 0 ? "+" : ""}
                                {ticketChange.toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-white/60">
                          {new Date(item.event.start_date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <div className="mb-1 text-xs text-white/40">TICKETS</div>
                          <div className="text-2xl font-bold text-white">{item.tickets}</div>
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-white/40">ORDERS</div>
                          <div className="text-2xl font-bold text-white">{item.orders}</div>
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-white/40">REVENUE</div>
                          <div className="text-2xl font-bold text-white">{formatCurrency(item.revenue)}</div>
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-white/40">EARNINGS</div>
                          <div className="text-2xl font-bold text-emerald-400">{formatCurrency(item.commission)}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}

              {eventPerformance.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                  <p className="text-white/60">No performance data yet. Start selling tickets to see your analytics.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
