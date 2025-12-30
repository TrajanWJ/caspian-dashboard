"use client"

import { Card } from "@/components/ui/card"
import { Calendar, Ticket, TrendingUp, DollarSign, Users } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { useEffect, useState } from "react"

interface Event {
  id: string
  name: string
  start_date: string
  end_date: string
  status: "upcoming" | "active" | "completed"
  total_tickets_sold: number
  total_revenue: number
  is_current: boolean
  commission: number
  orderCount: number
  uniquePromoters: number
}

export default function EventsPage() {
  const [eventsWithStats, setEventsWithStats] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, ordersRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/orders')
        ])

        if (!eventsRes.ok || !ordersRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const events = await eventsRes.json()
        const orders = await ordersRes.json()

        const eventsWithStats = events
          .map((event: any) => {
            const eventOrders = orders.filter((o: any) => o.event_id === event.id && !o.cancelled && !o.refunded)
            const uniquePromoters = new Set(eventOrders.map((o: any) => o.promoter_id)).size
            const commission = eventOrders.reduce((sum: number, o: any) => sum + o.commission_earned, 0)

            return {
              ...event,
              orderCount: eventOrders.length,
              uniquePromoters,
              commission,
            }
          })
          .sort((a: Event, b: Event) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())

        setEventsWithStats(eventsWithStats)
      } catch (error) {
        console.error("Failed to load events data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Sidebar variant="owner" />
        <div className="ml-64 flex items-center justify-center py-12">
          <div className="text-white">Loading events...</div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "upcoming":
        return "bg-blue-500/20 text-blue-400"
      case "completed":
        return "bg-white/20 text-white/60"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <div className="ml-64">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12">
            <h1 className="mb-2 text-3xl font-bold text-white">Events</h1>
            <p className="text-white/60">Performance breakdown for all events</p>
          </div>

          {/* Event List */}
          <div className="space-y-6">
            {eventsWithStats.map((event) => (
              <Card key={event.id} className="border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white">{event.name}</h2>
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(event.status)}`}
                      >
                        {event.is_current && <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/40">NET REVENUE</div>
                    <div className="text-3xl font-bold text-white">
                      {formatCurrency(event.total_revenue - event.commission)}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-5">
                  <Card className="border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-white/40">
                      <Ticket className="h-4 w-4" />
                      <span className="text-xs">TICKETS</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{event.total_tickets_sold}</div>
                    <div className="mt-1 text-xs text-white/40">{event.orderCount} orders</div>
                  </Card>

                  <Card className="border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-white/40">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs">GROSS</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(event.total_revenue)}</div>
                  </Card>

                  <Card className="border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-white/40">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs">COMMISSION</span>
                    </div>
                    <div className="text-2xl font-bold text-red-400">{formatCurrency(event.commission)}</div>
                    <div className="mt-1 text-xs text-white/40">
                      {event.total_revenue > 0 ? ((event.commission / event.total_revenue) * 100).toFixed(1) : 0}%
                    </div>
                  </Card>

                  <Card className="border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-white/40">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">PROMOTERS</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{event.uniquePromoters}</div>
                  </Card>

                  <Card className="border-white/10 bg-white/5 p-4">
                    <div className="mb-2 text-xs text-white/40">AVG/TICKET</div>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(event.total_tickets_sold > 0 ? event.total_revenue / event.total_tickets_sold : 0)}
                    </div>
                  </Card>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
