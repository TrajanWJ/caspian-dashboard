
import "server-only"

export interface Promoter {
  id: string
  tracking_link: string
  first_name: string
  last_name: string
  email: string
  phone: string
  total_tickets_sold: number
  total_revenue_generated: number
  total_commission_earned: number
  tier: "Bronze" | "Silver" | "Gold" | "Platinum"
  rank: number
  commission_rate: number
  created_at: string
}

export interface Event {
  id: string
  name: string
  start_date: string
  end_date: string
  status: "upcoming" | "active" | "completed"
  total_tickets_sold: number
  total_revenue: number
  is_current: boolean
}

export interface Order {
  id: string
  order_number: string
  event_id: string
  promoter_id: string
  tracking_link: string
  account_first_name: string
  account_last_name: string
  account_email: string
  account_phone: string
  items: Array<{
    item_id: string
    name: string
    price: number
  }>
  subtotal: number
  total: number
  date_purchased: string
  cancelled: boolean
  refunded: boolean
  commission_earned: number
}

export interface WebhookLog {
  id: string
  timestamp: string
  type: string
  order_number: string
  promoter_id: string | null
  event_id: string
  success: boolean
  error_message?: string
  raw_data: any
}

const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:3001"

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${FLASK_API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API call failed: ${response.status} ${errorText}`)
  }

  return response.json()
}

export async function getPromoters(): Promise<Promoter[]> {
  return apiCall<Promoter[]>('/api/promoters')
}

export async function getPromoterByTrackingLink(trackingLink: string): Promise<Promoter | null> {
  const promoters = await getPromoters()
  return promoters.find((p) => p.tracking_link === trackingLink) || null
}

export async function updatePromoter(promoter: Promoter): Promise<void> {
  await apiCall(`/api/promoters/${promoter.id}`, {
    method: 'PUT',
    body: JSON.stringify(promoter),
  })
}

export async function getEvents(): Promise<Event[]> {
  return apiCall<Event[]>('/api/events')
}

export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    return await apiCall<Event>(`/api/events/${eventId}`)
  } catch (error) {
    return null
  }
}

export async function updateEvent(event: Event): Promise<void> {
  await apiCall(`/api/events/${event.id}`, {
    method: 'PUT',
    body: JSON.stringify(event),
  })
}

export async function getOrders(): Promise<Order[]> {
  return apiCall<Order[]>('/api/orders')
}

export async function getOrdersByPromoter(promoterId: string): Promise<Order[]> {
  const orders = await getOrders()
  return orders.filter((o) => o.promoter_id === promoterId && !o.cancelled && !o.refunded)
}

export async function getOrdersByEvent(eventId: string): Promise<Order[]> {
  const orders = await getOrders()
  return orders.filter((o) => o.event_id === eventId && !o.cancelled && !o.refunded)
}

export async function addOrder(order: Order): Promise<void> {
  // Assuming the Flask API doesn't have a direct add order endpoint
  // This would need to be implemented in the Flask backend
  throw new Error('addOrder not implemented')
}

export async function getWebhookLogs(): Promise<WebhookLog[]> {
  return apiCall<WebhookLog[]>('/api/webhook/events')
}

export async function addWebhookLog(log: WebhookLog): Promise<void> {
  // This function might not be needed if webhooks are added via the webhook endpoint
  throw new Error('addWebhookLog not implemented')
}

export async function updateOrder(order: Order): Promise<void> {
  await apiCall(`/api/orders/${order.order_number}`, {
    method: 'PUT',
    body: JSON.stringify(order),
  })
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  try {
    return await apiCall<Order>(`/api/orders/${orderNumber}`)
  } catch (error) {
    return null
  }
}

export function calculateTier(ticketsSold: number): { tier: Promoter["tier"]; rate: number } {
  if (ticketsSold >= 100) return { tier: "Platinum", rate: 0.35 }
  if (ticketsSold >= 50) return { tier: "Gold", rate: 0.3 }
  if (ticketsSold >= 25) return { tier: "Silver", rate: 0.25 }
  return { tier: "Bronze", rate: 0.2 }
}

export async function recalculateRankings(): Promise<void> {
  // This would need to be implemented in the Flask backend
  throw new Error('recalculateRankings not implemented')
}
