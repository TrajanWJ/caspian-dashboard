import { notFound } from "next/navigation"
import { getPromoterByTrackingLink, getOrdersByPromoter, getEvents } from "@/lib/data-store"
import { Card } from "@/components/ui/card"
import { Clock, User, Receipt, DollarSign } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default async function HistoryPage({ params }: { params: Promise<{ tracking_link: string }> }) {
  const { tracking_link } = await params
  const promoter = await getPromoterByTrackingLink(tracking_link)

  if (!promoter) {
    notFound()
  }

  const orders = await getOrdersByPromoter(promoter.id)
  const events = await getEvents()

  const ordersWithEvents = orders
    .map((order) => ({
      ...order,
      event: events.find((e) => e.id === order.event_id),
    }))
    .sort((a, b) => new Date(b.date_purchased).getTime() - new Date(a.date_purchased).getTime())

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="promoter" trackingLink={tracking_link} promoterName={`${promoter.first_name} ${promoter.last_name}`} />
      <div className="ml-64">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12">
            <h1 className="mb-2 text-3xl font-bold text-white">Transaction History</h1>
            <p className="text-white/60">Complete record of all your sales and earnings</p>
          </div>

          {/* Summary Cards */}
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 text-sm text-white/40">Total Transactions</div>
              <div className="text-4xl font-bold text-white">{orders.length}</div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 text-sm text-white/40">Total Tickets</div>
              <div className="text-4xl font-bold text-white">{promoter.total_tickets_sold}</div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 text-sm text-white/40">Total Earned</div>
              <div className="text-4xl font-bold text-emerald-400">
                {formatCurrency(promoter.total_commission_earned)}
              </div>
            </Card>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {ordersWithEvents.map((order) => (
              <Card
                key={order.id}
                className="border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:bg-white/[0.07]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="mb-1 font-bold text-white">{order.event?.name || "Unknown Event"}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Clock className="h-3 w-3" />
                          <span>{formatDateTime(order.date_purchased)}</span>
                        </div>
                      </div>
                      <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                        +{formatCurrency(order.commission_earned)}
                      </div>
                    </div>

                    <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-white/40" />
                        <div>
                          <div className="text-white/40">Customer</div>
                          <div className="font-medium text-white">
                            {order.account_first_name} {order.account_last_name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-white/40" />
                        <div>
                          <div className="text-white/40">Order #</div>
                          <div className="font-mono text-sm font-medium text-white">{order.order_number}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-white/40" />
                        <div>
                          <div className="text-white/40">Tickets</div>
                          <div className="font-medium text-white">{order.items.length} tickets</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-white/40" />
                        <div>
                          <div className="text-white/40">Order Value</div>
                          <div className="font-medium text-white">{formatCurrency(order.subtotal)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {ordersWithEvents.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                <p className="text-white/60">No transactions yet. Share your referral link to start earning.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
