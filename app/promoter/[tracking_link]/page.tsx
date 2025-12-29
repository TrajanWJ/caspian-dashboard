import { notFound } from "next/navigation"
import { getPromoterByTrackingLink, getOrdersByPromoter, getEvents } from "@/lib/data-store"
import { Card } from "@/components/ui/card"
import { TrendingUp, Ticket, DollarSign, Trophy, Award, Calendar } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default async function PromoterDashboard({
  params,
}: {
  params: Promise<{ tracking_link: string }>
}) {
  const { tracking_link } = await params
  const promoter = await getPromoterByTrackingLink(tracking_link)

  if (!promoter) {
    notFound()
  }

  const orders = await getOrdersByPromoter(promoter.id)
  const events = await getEvents()
  const currentEvent = events.find((e) => e.is_current)

  // Calculate current event stats
  let currentEventStats = { tickets: 0, revenue: 0, commission: 0 }
  if (currentEvent) {
    const currentOrders = orders.filter((o) => o.event_id === currentEvent.id)
    currentEventStats = {
      tickets: currentOrders.reduce((sum, o) => sum + o.items.length, 0),
      revenue: currentOrders.reduce((sum, o) => sum + o.subtotal, 0),
      commission: currentOrders.reduce((sum, o) => sum + o.commission_earned, 0),
    }
  }

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

  const nextTierThreshold = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return { next: "Silver", tickets: 25 }
      case "Silver":
        return { next: "Gold", tickets: 50 }
      case "Gold":
        return { next: "Platinum", tickets: 100 }
      default:
        return null
    }
  }

  const tierInfo = nextTierThreshold(promoter.tier)
  const progressToNext = tierInfo ? Math.min((promoter.total_tickets_sold / tierInfo.tickets) * 100, 100) : 100

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="promoter" trackingLink={tracking_link} promoterName={`${promoter.first_name} ${promoter.last_name}`} />
      <div className="ml-64">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="mb-2 text-sm font-medium uppercase tracking-wider text-white/40">Your Impact</div>
                <div className="flex items-baseline gap-4">
                  <div className="text-7xl font-bold text-white">{promoter.total_tickets_sold}</div>
                  <div className="text-2xl text-white/60">tickets sold</div>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2 text-sm font-medium uppercase tracking-wider text-white/40">Total Earnings</div>
                <div className="text-4xl font-bold text-white">{formatCurrency(promoter.total_commission_earned)}</div>
              </div>
            </div>

            {/* Tier Badge & Progress */}
            <div className="flex items-center gap-8">
              <div
                className={`inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r ${getTierColor(promoter.tier)} px-6 py-3`}
              >
                <Award className="h-6 w-6 text-white" />
                <span className="text-lg font-bold text-white">{promoter.tier} Tier</span>
                <span className="text-sm text-white/90">{(promoter.commission_rate * 100).toFixed(0)}% Commission</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3">
                <Trophy className="h-5 w-5 text-orange-400" />
                <span className="text-white/60">Rank</span>
                <span className="text-lg font-bold text-white">#{promoter.rank}</span>
              </div>
            </div>

            {/* Progress to Next Tier */}
            {tierInfo && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    {tierInfo.tickets - promoter.total_tickets_sold} tickets until {tierInfo.next}
                  </span>
                  <span className="text-sm font-medium text-white">{progressToNext.toFixed(0)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Current Event */}
          {currentEvent && (
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-white/60" />
                <h2 className="text-lg font-medium text-white">Current Event</h2>
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              </div>
              <Card className="border-white/10 bg-white/5 p-8 backdrop-blur">
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
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-white/60">Your Tickets</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{currentEventStats.tickets}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-white/60">Revenue</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{formatCurrency(currentEventStats.revenue)}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-white/60">Your Earnings</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400">
                      {formatCurrency(currentEventStats.commission)}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">Total Revenue</div>
              <div className="text-3xl font-bold text-white">{formatCurrency(promoter.total_revenue_generated)}</div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">Commission Rate</div>
              <div className="text-3xl font-bold text-white">{(promoter.commission_rate * 100).toFixed(0)}%</div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">Avg Per Sale</div>
              <div className="text-3xl font-bold text-white">
                {formatCurrency(
                  promoter.total_tickets_sold > 0 ? promoter.total_revenue_generated / promoter.total_tickets_sold : 0,
                )}
              </div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">Active Events</div>
              <div className="text-3xl font-bold text-white">{events.filter((e) => e.is_current).length}</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
