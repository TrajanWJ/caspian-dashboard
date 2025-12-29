import { NextResponse } from "next/server"

export async function GET() {
  const testOrder = {
    type: "new_order",
    account_first_name: "Test",
    account_last_name: "Customer",
    account_email: "test@example.com",
    account_phone: "+1234567890",
    event_name: "Summer Music Festival 2025",
    event_start: "2025-06-15T19:00:00Z",
    event_end: "2025-06-15T23:00:00Z",
    event_id: "event-001",
    items: [
      {
        item_id: "ticket-001",
        name: "General Admission",
        price: 45,
      },
      {
        item_id: "ticket-002",
        name: "General Admission",
        price: 45,
      },
    ],
    date_purchased: new Date().toISOString(),
    subtotal: 90,
    total: 95.5,
    tracking_link: "PROMO001",
    order_number: `TEST-${Date.now()}`,
    update_date: new Date().toISOString(),
    cancelled: false,
    refunded: false,
    disputed: false,
    partialRefund: 0,
    isInPersonOrder: false,
  }

  // Send to our webhook endpoint
  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://caspian-dashboard.vercel.app"}/api/webhook/posh`

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testOrder),
    })

    const result = await response.json()

    return NextResponse.json({
      message: "Test webhook sent",
      test_order: testOrder,
      webhook_response: result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to send test webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
