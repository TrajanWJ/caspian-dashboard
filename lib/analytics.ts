import { getPromoters, getEvents, getOrders, getOrdersByPromoter } from "./data-store"

export interface PromoterMetrics {
  total_tickets_sold: number
  total_revenue_generated: number
  total_commission_earned: number
  tier: string
  rank: number
  recent_event: EventMetrics | null
  past_events: EventMetrics[]
}

export interface OwnerMetrics {
  total_tickets_sold: number
  total_gross_revenue: number
  total_commission_paid: number
  active_promoters: number
  revenue_change: number
  recent_event: EventMetrics | null
  past_events: EventMetrics[]
}

export interface EventMetrics {
  event_id: string
  event_name: string
  event_date: string
  tickets_sold: number
  revenue: number
  payout: number
  status: string
}

export async function getPromoterMetrics(trackingLink: string): Promise<PromoterMetrics | null> {
  const promoters = await getPromoters()
  const promoter = promoters.find((p) => p.tracking_link === trackingLink)

  if (!promoter) return null

  const orders = await getOrdersByPromoter(promoter.id)
  const events = await getEvents()

  // Group orders by event
  const eventMetrics = new Map<string, EventMetrics>()

  for (const order of orders) {
    const event = events.find((e) => e.id === order.event_id)
    if (!event) continue

    const existing = eventMetrics.get(event.id)
    const ticketCount = order.items.length
    const commission = order.subtotal * promoter.commission_rate

    if (existing) {
      existing.tickets_sold += ticketCount
      existing.revenue += order.subtotal
      existing.payout += commission
    } else {
      eventMetrics.set(event.id, {
        event_id: event.id,
        event_name: event.name,
        event_date: event.start_date,
        tickets_sold: ticketCount,
        revenue: order.subtotal,
        payout: commission,
        status: event.status,
      })
    }
  }

  const eventList = Array.from(eventMetrics.values()).sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime(),
  )

  return {
    total_tickets_sold: promoter.total_tickets_sold,
    total_revenue_generated: promoter.total_revenue_generated,
    total_commission_earned: promoter.total_commission_earned,
    tier: promoter.tier,
    rank: promoter.rank,
    recent_event: eventList[0] || null,
    past_events: eventList.slice(1),
  }
}

export async function getOwnerMetrics(): Promise<OwnerMetrics> {
  const promoters = await getPromoters()
  const events = await getEvents()
  const orders = await getOrders()

  const activeOrders = orders.filter((o) => !o.cancelled && !o.refunded)

  const total_tickets_sold = activeOrders.reduce((sum, o) => sum + o.items.length, 0)
  const total_gross_revenue = activeOrders.reduce((sum, o) => sum + o.subtotal, 0)

  let total_commission_paid = 0
  for (const order of activeOrders) {
    const promoter = promoters.find((p) => p.id === order.promoter_id)
    if (promoter) {
      total_commission_paid += order.subtotal * promoter.commission_rate
    }
  }

  const active_promoters = promoters.filter((p) => p.total_tickets_sold > 0).length

  // Calculate revenue change (simplified: compare last two events)
  const completedEvents = events
    .filter((e) => e.status === "completed")
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())

  let revenue_change = 0
  if (completedEvents.length >= 2) {
    const lastRevenue = completedEvents[0].total_revenue
    const previousRevenue = completedEvents[1].total_revenue
    revenue_change = previousRevenue > 0 ? ((lastRevenue - previousRevenue) / previousRevenue) * 100 : 0
  }

  // Group orders by event for event metrics
  const eventMetrics = new Map<string, EventMetrics>()

  for (const order of activeOrders) {
    const event = events.find((e) => e.id === order.event_id)
    const promoter = promoters.find((p) => p.id === order.promoter_id)
    if (!event || !promoter) continue

    const existing = eventMetrics.get(event.id)
    const ticketCount = order.items.length
    const commission = order.subtotal * promoter.commission_rate

    if (existing) {
      existing.tickets_sold += ticketCount
      existing.revenue += order.subtotal
      existing.payout += commission
    } else {
      eventMetrics.set(event.id, {
        event_id: event.id,
        event_name: event.name,
        event_date: event.start_date,
        tickets_sold: ticketCount,
        revenue: order.subtotal,
        payout: commission,
        status: event.status,
      })
    }
  }

  const eventList = Array.from(eventMetrics.values()).sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime(),
  )

  return {
    total_tickets_sold,
    total_gross_revenue,
    total_commission_paid,
    active_promoters,
    revenue_change,
    recent_event: eventList[0] || null,
    past_events: eventList.slice(1),
  }
}
