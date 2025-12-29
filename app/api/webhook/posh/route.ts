import { type NextRequest, NextResponse } from "next/server"
import {
  getPromoterByTrackingLink,
  updatePromoter,
  getEventById,
  updateEvent,
  addOrder,
  updateOrder,
  getOrderByOrderNumber,
  calculateTier,
  recalculateRankings,
  addWebhookLog,
  type Order,
  type WebhookLog,
} from "@/lib/data-store"

interface PoshWebhookBody {
  type: string
  account_first_name: string
  account_last_name: string
  account_email: string
  account_phone: string
  account_instagram?: string
  event_name: string
  event_start: string
  event_end: string
  event_id: string
  items: Array<{
    item_id: string
    name: string
    price: number
  }>
  date_purchased: string
  promo_code?: string
  subtotal: number
  total: number
  tracking_link: string
  order_number: string
  update_date: string
  cancelled: boolean
  refunded: boolean
  disputed: boolean
  partialRefund: number
  custom_fields?: Array<{
    type: string
    answer: string
    prompt: string
  }>
  isInPersonOrder: boolean
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let webhookLog: WebhookLog | null = null

  try {
    const body: PoshWebhookBody = await request.json()

    console.log("[v0] Received Posh webhook:", body.type, body.order_number)

    if (body.type === "new_order") {
      return await handleNewOrder(body)
    } else if (body.type === "order_updated" || body.cancelled || body.refunded) {
      return await handleOrderUpdate(body)
    }

    // Log unknown webhook type
    webhookLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: body.type,
      order_number: body.order_number,
      promoter_id: null,
      event_id: body.event_id,
      success: false,
      error_message: "Unknown webhook type",
      raw_data: body,
    }
    await addWebhookLog(webhookLog)

    return NextResponse.json({ success: true, message: "Webhook type not processed" })
  } catch (error) {
    console.error("[v0] Webhook error:", error)

    // Log error
    webhookLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "error",
      order_number: "unknown",
      promoter_id: null,
      event_id: "unknown",
      success: false,
      error_message: error instanceof Error ? error.message : "Unknown error",
      raw_data: null,
    }
    await addWebhookLog(webhookLog)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

async function handleNewOrder(body: PoshWebhookBody) {
  const promoter = await getPromoterByTrackingLink(body.tracking_link)

  if (!promoter) {
    const log: WebhookLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: body.type,
      order_number: body.order_number,
      promoter_id: null,
      event_id: body.event_id,
      success: false,
      error_message: "Promoter not found for tracking link",
      raw_data: body,
    }
    await addWebhookLog(log)
    return NextResponse.json({ success: false, error: "Promoter not found" }, { status: 404 })
  }

  const event = await getEventById(body.event_id)
  if (!event) {
    const log: WebhookLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: body.type,
      order_number: body.order_number,
      promoter_id: promoter.id,
      event_id: body.event_id,
      success: false,
      error_message: "Event not found",
      raw_data: body,
    }
    await addWebhookLog(log)
    return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
  }

  const ticketCount = body.items.length
  const tierInfo = calculateTier(promoter.total_tickets_sold + ticketCount)
  const commission = body.subtotal * tierInfo.rate

  const order: Order = {
    id: `order-${Date.now()}`,
    order_number: body.order_number,
    event_id: body.event_id,
    promoter_id: promoter.id,
    tracking_link: body.tracking_link,
    account_first_name: body.account_first_name,
    account_last_name: body.account_last_name,
    account_email: body.account_email,
    account_phone: body.account_phone,
    items: body.items,
    subtotal: body.subtotal,
    total: body.total,
    date_purchased: body.date_purchased,
    cancelled: false,
    refunded: false,
    commission_earned: commission,
  }

  await addOrder(order)

  promoter.total_tickets_sold += ticketCount
  promoter.total_revenue_generated += body.subtotal
  promoter.tier = tierInfo.tier
  promoter.commission_rate = tierInfo.rate
  promoter.total_commission_earned += commission

  await updatePromoter(promoter)

  event.total_tickets_sold += ticketCount
  event.total_revenue += body.subtotal
  await updateEvent(event)

  await recalculateRankings()

  const log: WebhookLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: body.type,
    order_number: body.order_number,
    promoter_id: promoter.id,
    event_id: body.event_id,
    success: true,
    raw_data: body,
  }
  await addWebhookLog(log)

  console.log("[v0] Successfully processed new order:", order.id)

  return NextResponse.json({
    success: true,
    order_id: order.id,
    promoter_id: promoter.id,
    commission_earned: commission,
  })
}

async function handleOrderUpdate(body: PoshWebhookBody) {
  const order = await getOrderByOrderNumber(body.order_number)

  if (!order) {
    const log: WebhookLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: body.type,
      order_number: body.order_number,
      promoter_id: null,
      event_id: body.event_id,
      success: false,
      error_message: "Order not found",
      raw_data: body,
    }
    await addWebhookLog(log)
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
  }

  const promoter = await getPromoterByTrackingLink(order.tracking_link)
  const event = await getEventById(order.event_id)

  if (!promoter || !event) {
    return NextResponse.json({ success: false, error: "Data not found" }, { status: 404 })
  }

  // Handle refund or cancellation
  if ((body.cancelled || body.refunded) && !order.cancelled && !order.refunded) {
    const ticketCount = order.items.length

    // Reverse the metrics
    promoter.total_tickets_sold -= ticketCount
    promoter.total_revenue_generated -= order.subtotal
    promoter.total_commission_earned -= order.commission_earned

    // Recalculate tier
    const tierInfo = calculateTier(promoter.total_tickets_sold)
    promoter.tier = tierInfo.tier
    promoter.commission_rate = tierInfo.rate

    await updatePromoter(promoter)

    event.total_tickets_sold -= ticketCount
    event.total_revenue -= order.subtotal
    await updateEvent(event)

    order.cancelled = body.cancelled
    order.refunded = body.refunded
    await updateOrder(order)

    await recalculateRankings()
  }

  const log: WebhookLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: body.type,
    order_number: body.order_number,
    promoter_id: promoter.id,
    event_id: body.event_id,
    success: true,
    raw_data: body,
  }
  await addWebhookLog(log)

  return NextResponse.json({
    success: true,
    message: "Order updated",
  })
}
