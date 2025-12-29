import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

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

async function readJSON<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.log(`[v0] Error reading ${filename}:`, error)
    return []
  }
}

async function writeJSON<T>(filename: string, data: T[]): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
  } catch (error) {
    console.log(`[v0] Error writing ${filename}:`, error)
  }
}

export async function getPromoters(): Promise<Promoter[]> {
  return readJSON<Promoter>("promoters.json")
}

export async function getPromoterByTrackingLink(trackingLink: string): Promise<Promoter | null> {
  const promoters = await getPromoters()
  return promoters.find((p) => p.tracking_link === trackingLink) || null
}

export async function updatePromoter(promoter: Promoter): Promise<void> {
  const promoters = await getPromoters()
  const index = promoters.findIndex((p) => p.id === promoter.id)
  if (index !== -1) {
    promoters[index] = promoter
    await writeJSON("promoters.json", promoters)
  }
}

export async function getEvents(): Promise<Event[]> {
  return readJSON<Event>("events.json")
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const events = await getEvents()
  return events.find((e) => e.id === eventId) || null
}

export async function updateEvent(event: Event): Promise<void> {
  const events = await getEvents()
  const index = events.findIndex((e) => e.id === event.id)
  if (index !== -1) {
    events[index] = event
    await writeJSON("events.json", events)
  }
}

export async function getOrders(): Promise<Order[]> {
  return readJSON<Order>("orders.json")
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
  const orders = await getOrders()
  orders.push(order)
  await writeJSON("orders.json", orders)
}

export async function getWebhookLogs(): Promise<WebhookLog[]> {
  return readJSON<WebhookLog>("webhook-logs.json")
}

export async function addWebhookLog(log: WebhookLog): Promise<void> {
  const logs = await getWebhookLogs()
  logs.unshift(log) // Add to beginning for most recent first
  // Keep only last 100 logs
  const trimmed = logs.slice(0, 100)
  await writeJSON("webhook-logs.json", trimmed)
}

export async function updateOrder(order: Order): Promise<void> {
  const orders = await getOrders()
  const index = orders.findIndex((o) => o.id === order.id)
  if (index !== -1) {
    orders[index] = order
    await writeJSON("orders.json", orders)
  }
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  const orders = await getOrders()
  return orders.find((o) => o.order_number === orderNumber) || null
}

export function calculateTier(ticketsSold: number): { tier: Promoter["tier"]; rate: number } {
  if (ticketsSold >= 100) return { tier: "Platinum", rate: 0.35 }
  if (ticketsSold >= 50) return { tier: "Gold", rate: 0.3 }
  if (ticketsSold >= 25) return { tier: "Silver", rate: 0.25 }
  return { tier: "Bronze", rate: 0.2 }
}

export async function recalculateRankings(): Promise<void> {
  const promoters = await getPromoters()
  const sorted = promoters.sort((a, b) => b.total_tickets_sold - a.total_tickets_sold)

  for (let i = 0; i < sorted.length; i++) {
    sorted[i].rank = i + 1
  }

  await writeJSON("promoters.json", sorted)
}
